-- ============================================================
--  Ti Bac Kréyol — base de données Supabase
--  À coller en entier dans Supabase > SQL Editor > New query > Run
--  (une seule fois, sur un projet neuf)
-- ============================================================

-- ---------- Profils des joueurs ----------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  pseudo      text not null check (char_length(pseudo) between 3 and 16),
  avatar      text not null default 'lapen',
  xp          integer not null default 0,
  wins        integer not null default 0,
  games       integer not null default 0,
  perfect     integer not null default 0,
  rare3       integer not null default 0,
  daily       integer not null default 0,
  best        jsonb   not null default '{}'::jsonb,
  counted     text[]  not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index profiles_pseudo_unique on public.profiles (lower(pseudo));
create index profiles_xp_idx on public.profiles (xp desc);
alter table public.profiles enable row level security;
create policy "Profils visibles par tous" on public.profiles for select using (true);
create policy "Chacun crée son profil" on public.profiles for insert with check (auth.uid() = id);
create policy "Chacun modifie son profil" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- Administratrices ----------
create table public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.app_admins enable row level security;
create policy "Voir son propre statut admin" on public.app_admins for select using (auth.uid() = user_id);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

-- ---------- Amis ----------
create table public.friendships (
  id         text primary key,
  user_a     uuid not null references public.profiles(id) on delete cascade,
  user_b     uuid not null references public.profiles(id) on delete cascade,
  from_id    uuid not null references public.profiles(id) on delete cascade,
  to_id      uuid not null references public.profiles(id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now()
);
alter table public.friendships enable row level security;
create policy "Voir ses amitiés" on public.friendships for select using (auth.uid() in (user_a, user_b));
create policy "Envoyer une demande" on public.friendships for insert
  with check (auth.uid() = from_id and status = 'pending' and from_id in (user_a, user_b) and to_id in (user_a, user_b) and from_id <> to_id);
create policy "Accepter une demande reçue" on public.friendships for update
  using (auth.uid() = to_id) with check (auth.uid() = to_id);
create policy "Refuser ou retirer" on public.friendships for delete using (auth.uid() in (user_a, user_b));

-- ---------- Parties en ligne ----------
create table public.matches (
  code          text primary key check (code ~ '^[A-Z0-9]{5}$'),
  host          uuid not null references public.profiles(id) on delete cascade,
  mode          text not null check (mode in ('live','async')),
  dur           integer not null check (dur in (45,60,90)),
  terr          text[] not null default '{}',
  themes        integer[] not null,
  players       uuid[] not null,
  invite        uuid references public.profiles(id) on delete set null,
  invite_status text,
  pseudos       jsonb not null default '{}'::jsonb,
  avatars       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index matches_players_idx on public.matches using gin (players);
create index matches_invite_idx on public.matches (invite);
alter table public.matches enable row level security;
create policy "Parties visibles par les joueurs connectés" on public.matches for select to authenticated using (true);
create policy "Créer sa partie" on public.matches for insert to authenticated
  with check (auth.uid() = host and players = array[auth.uid()]);

-- Manches jouées : une ligne par joueur et par partie
create table public.plays (
  code        text not null references public.matches(code) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rounds      jsonb not null default '{}'::jsonb,
  jokers      jsonb not null default '{"time":1,"hint":2}'::jsonb,
  r           integer not null default 0,
  score       integer not null default 0,
  found_count integer not null default 0,
  updated_at  timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.plays enable row level security;
create policy "Manches visibles par les joueurs connectés" on public.plays for select to authenticated using (true);
create policy "Enregistrer ses manches" on public.plays for insert to authenticated
  with check (auth.uid() = user_id and exists (select 1 from public.matches m where m.code = plays.code and auth.uid() = any (m.players)));
create policy "Mettre à jour ses manches" on public.plays for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and exists (select 1 from public.matches m where m.code = plays.code and auth.uid() = any (m.players)));

-- Rejoindre une partie (avec un code, un lien ou une invitation)
create or replace function public.join_match(p_code text, p_pseudo text, p_avatar text) returns text
language plpgsql security definer set search_path = public as $$
declare m public.matches%rowtype;
begin
  if auth.uid() is null then return 'Connecte-toi pour rejoindre une partie.'; end if;
  select * into m from public.matches where code = upper(p_code) for update;
  if not found then return 'Aucune partie avec ce code.'; end if;
  if auth.uid() = any (m.players) then return null; end if;
  if coalesce(array_length(m.players, 1), 0) >= 2 then return 'Cette partie a déjà deux joueurs.'; end if;
  update public.matches set
    players = players || auth.uid(),
    pseudos = pseudos || jsonb_build_object(auth.uid()::text, left(p_pseudo, 16)),
    avatars = avatars || jsonb_build_object(auth.uid()::text, left(p_avatar, 20)),
    invite_status = case when invite = auth.uid() then 'accepted' else invite_status end
  where code = m.code;
  return null;
end $$;

-- Refuser une invitation reçue
create or replace function public.decline_invite(p_code text) returns void
language sql security definer set search_path = public as $$
  update public.matches set invite_status = 'declined'
  where code = upper(p_code) and invite = auth.uid() and coalesce(array_length(players, 1), 0) < 2;
$$;

-- ---------- Défi du jour ----------
create table public.dailyscores (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  avatar     text,
  last       text not null,
  last_pts   integer not null default 0,
  last_found integer not null default 0,
  count      integer not null default 0,
  done       boolean not null default false,
  updated_at timestamptz not null default now()
);
create index dailyscores_last_idx on public.dailyscores (last, last_pts desc);
alter table public.dailyscores enable row level security;
create policy "Scores du jour visibles par tous" on public.dailyscores for select using (true);
create policy "Enregistrer son défi" on public.dailyscores for insert with check (auth.uid() = user_id);
create policy "Mettre à jour son défi" on public.dailyscores for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Réponses signalées ----------
create table public.reports (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  theme      integer not null,
  answer     text not null check (char_length(answer) between 1 and 40),
  status     text not null default 'new' check (status in ('new','ok','no')),
  created_at timestamptz not null default now(),
  treated_at timestamptz
);
alter table public.reports enable row level security;
create policy "Signaler une réponse" on public.reports for insert with check (auth.uid() = user_id and status = 'new');
create policy "Voir ses signalements (admin : tous)" on public.reports for select using (auth.uid() = user_id or public.is_admin());
create policy "Traiter les signalements (admin)" on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "Supprimer des signalements (admin)" on public.reports for delete using (public.is_admin());

-- ---------- Réponses ajoutées par l'admin ----------
create table public.extras (
  id         bigserial primary key,
  theme      integer not null,
  name       text not null check (char_length(name) between 2 and 40),
  pts        integer not null default 1 check (pts between 1 and 3),
  alias      text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.extras enable row level security;
create policy "Réponses ajoutées visibles par tous" on public.extras for select using (true);
create policy "Ajouter des réponses (admin)" on public.extras for insert with check (public.is_admin());
create policy "Modifier des réponses (admin)" on public.extras for update using (public.is_admin()) with check (public.is_admin());
create policy "Retirer des réponses (admin)" on public.extras for delete using (public.is_admin());

-- ---------- Supprimer son compte (RGPD) ----------
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- Droits d'exécution ----------
revoke all on function public.join_match(text, text, text) from public;
revoke all on function public.decline_invite(text) from public;
revoke all on function public.delete_my_account() from public;
grant execute on function public.join_match(text, text, text) to authenticated;
grant execute on function public.decline_invite(text) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Temps réel ----------
alter publication supabase_realtime add table
  public.profiles, public.friendships, public.matches, public.plays,
  public.dailyscores, public.reports, public.extras;

-- ============================================================
--  APRÈS avoir créé ton compte dans le jeu, exécute UNE fois
--  la ligne ci-dessous (avec ton adresse e-mail) pour devenir admin :
--
--  insert into public.app_admins (user_id)
--  select id from auth.users where email = 'ton.adresse@exemple.com';
-- ============================================================
