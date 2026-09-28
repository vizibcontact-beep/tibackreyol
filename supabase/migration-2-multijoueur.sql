-- ============================================================
--  Ti Bac Kréyol — migration : parties en ligne de 2 à 5 joueurs
--  (salle d'attente, invitations multiples)
-- ============================================================
alter table public.matches
  add column if not exists max_players integer not null default 2 check (max_players between 2 and 5),
  add column if not exists started     boolean not null default false,
  add column if not exists invites     uuid[]  not null default '{}',
  add column if not exists declined    uuid[]  not null default '{}';
create index if not exists matches_invites_idx on public.matches using gin (invites);

-- Parties existantes : les duels complets sont considérés comme lancés, l'ancienne invitation est reprise
update public.matches set started = true where coalesce(array_length(players, 1), 0) >= max_players;
update public.matches set invites = array[invite] where invite is not null and cardinality(invites) = 0;
update public.matches set declined = array[invite] where invite is not null and invite_status = 'declined';

drop policy if exists "Créer sa partie" on public.matches;
create policy "Créer sa partie" on public.matches for insert to authenticated
  with check (auth.uid() = host and players = array[auth.uid()] and started = false and cardinality(declined) = 0);

-- Rejoindre une partie (code, lien ou invitation) : refusé si complète ou inscriptions fermées
create or replace function public.join_match(p_code text, p_pseudo text, p_avatar text) returns text
language plpgsql security definer set search_path = public as $$
declare m public.matches%rowtype; n integer;
begin
  if auth.uid() is null then return 'Connecte-toi pour rejoindre une partie.'; end if;
  select * into m from public.matches where code = upper(p_code) for update;
  if not found then return 'Aucune partie avec ce code.'; end if;
  if auth.uid() = any (m.players) then return null; end if;
  n := coalesce(array_length(m.players, 1), 0);
  if m.started then return 'Les inscriptions à cette partie sont fermées.'; end if;
  if n >= m.max_players then return 'Cette partie est complète.'; end if;
  update public.matches set
    players  = players || auth.uid(),
    pseudos  = pseudos || jsonb_build_object(auth.uid()::text, left(p_pseudo, 16)),
    avatars  = avatars || jsonb_build_object(auth.uid()::text, left(p_avatar, 20)),
    declined = array_remove(declined, auth.uid()),
    started  = (n + 1 >= m.max_players),
    invite_status = case when invite = auth.uid() then 'accepted' else invite_status end
  where code = m.code;
  return null;
end $$;

-- Lancer la partie / fermer les inscriptions (créateur uniquement, 2 joueurs minimum)
create or replace function public.start_match(p_code text) returns text
language plpgsql security definer set search_path = public as $$
declare m public.matches%rowtype;
begin
  if auth.uid() is null then return 'Connecte-toi.'; end if;
  select * into m from public.matches where code = upper(p_code) for update;
  if not found then return 'Aucune partie avec ce code.'; end if;
  if m.host <> auth.uid() then return 'Seul le créateur de la partie peut la lancer.'; end if;
  if coalesce(array_length(m.players, 1), 0) < 2 then return 'Il faut au moins 2 joueurs.'; end if;
  update public.matches set started = true where code = m.code;
  return null;
end $$;

-- Refuser une invitation reçue
create or replace function public.decline_invite(p_code text) returns void
language sql security definer set search_path = public as $$
  update public.matches set declined = array_append(declined, auth.uid()),
    invite_status = case when invite = auth.uid() then 'declined' else invite_status end
  where code = upper(p_code) and auth.uid() = any (invites)
    and not (auth.uid() = any (declined)) and not (auth.uid() = any (players));
$$;

revoke all on function public.join_match(text, text, text) from public, anon;
revoke all on function public.start_match(text) from public, anon;
revoke all on function public.decline_invite(text) from public, anon;
grant execute on function public.join_match(text, text, text) to authenticated;
grant execute on function public.start_match(text) to authenticated;
grant execute on function public.decline_invite(text) to authenticated;
