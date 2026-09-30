-- ============================================================
--  Ti Bac Kréyol — migration 5 : jouer contre un adversaire au hasard
--  de son niveau (classement mondial)
-- ============================================================
--  Fonctionnement :
--   * le joueur appuie sur « Trouver un adversaire » ;
--   * s'il existe une partie « au hasard » en attente créée par un joueur de niveau
--     proche (même niveau ou un niveau d'écart), il la rejoint : la partie démarre ;
--   * une partie qui attend depuis plus de 24 h peut être prise par n'importe quel niveau
--     (pour que personne n'attende trop quand il y a peu de joueurs) ;
--   * sinon, une nouvelle partie en différé est créée : le joueur peut jouer tout de suite,
--     le prochain joueur de son niveau la rejoindra.

alter table public.matches add column if not exists random boolean not null default false;
create index if not exists matches_random_open_idx on public.matches (created_at) where random and not started;

-- Les parties « au hasard » ne se créent que par la fonction ci-dessous
drop policy if exists "Créer sa partie" on public.matches;
create policy "Créer sa partie" on public.matches for insert to authenticated
  with check (auth.uid() = host and players = array[auth.uid()] and started = false
              and cardinality(declined) = 0 and random = false);

-- Niveau (0 à 9) à partir des points de classement : mêmes paliers que dans l'application
create or replace function public.level_of(p_xp integer) returns integer
language sql immutable set search_path = public as $$
  select count(*)::int - 1 from unnest(array[0,100,300,600,1000,1600,2500,4000,6000,9000]) t where t <= coalesce(p_xp, 0);
$$;

create or replace function public.find_random_match(p_pseudo text, p_avatar text, p_themes integer[], p_dur integer, p_terr text[])
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid(); my_xp integer; my_lv integer; m public.matches%rowtype; opp record; c text; k integer;
begin
  if me is null then return jsonb_build_object('error', 'Connecte-toi pour jouer en ligne.'); end if;
  select xp into my_xp from public.profiles where id = me;
  if not found then return jsonb_build_object('error', 'Crée ton profil pour jouer en ligne.'); end if;
  my_lv := public.level_of(my_xp);

  -- 1) déjà une recherche en cours : on la renvoie
  select * into m from public.matches
    where random and not started and host = me and players = array[me] and created_at > now() - interval '7 days'
    order by created_at desc limit 1;
  if found then return jsonb_build_object('code', m.code, 'joined', false); end if;

  -- 2) une partie en attente d'un joueur de niveau proche (la plus proche, puis la plus ancienne)
  select mm.* into m from public.matches mm join public.profiles p on p.id = mm.host
    where mm.random and not mm.started and mm.host <> me
      and cardinality(mm.players) = 1 and not (me = any (mm.declined))
      and mm.created_at > now() - interval '7 days'
      and (abs(public.level_of(p.xp) - my_lv) <= 1 or mm.created_at < now() - interval '24 hours')
    order by abs(p.xp - my_xp), mm.created_at
    limit 1
    for update of mm skip locked;
  if found then
    update public.matches set
      players = players || me,
      pseudos = pseudos || jsonb_build_object(me::text, left(p_pseudo, 16)),
      avatars = avatars || jsonb_build_object(me::text, left(p_avatar, 20)),
      started = true
    where code = m.code;
    select pseudo, xp into opp from public.profiles where id = m.host;
    return jsonb_build_object('code', m.code, 'joined', true, 'opponent', opp.pseudo, 'xp', opp.xp);
  end if;

  -- 3) personne en attente : nouvelle partie en différé
  if p_themes is null or cardinality(p_themes) <> 5 then return jsonb_build_object('error', 'Thèmes invalides.'); end if;
  for k in 1..8 loop
    c := (select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '') from generate_series(1, 5));
    begin
      insert into public.matches (code, host, mode, dur, terr, themes, players, max_players, random, pseudos, avatars)
      values (c, me, 'async', case when p_dur in (45, 60, 90) then p_dur else 60 end, coalesce(p_terr, '{}'), p_themes, array[me], 2, true,
              jsonb_build_object(me::text, left(p_pseudo, 16)), jsonb_build_object(me::text, left(p_avatar, 20)));
      return jsonb_build_object('code', c, 'joined', false);
    exception when unique_violation then
      -- code déjà pris : on en tire un autre
    end;
  end loop;
  return jsonb_build_object('error', 'Réessaie dans un instant.');
end $$;

-- Nombre de joueurs qui attendent un adversaire (pour l'affichage)
create or replace function public.random_waiting() returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.matches
  where random and not started and cardinality(players) = 1 and created_at > now() - interval '7 days'
    and host <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;

revoke all on function public.find_random_match(text, text, integer[], integer, text[]) from public, anon;
revoke all on function public.random_waiting() from public, anon;
grant execute on function public.find_random_match(text, text, integer[], integer, text[]) to authenticated;
grant execute on function public.random_waiting() to authenticated;
