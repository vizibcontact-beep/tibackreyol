-- ============================================================
--  Ti Bac Kréyol — migration 4
--  Nettoyage automatique (RGPD), statistiques des réponses,
--  classement de la semaine, notifications sur le téléphone
-- ============================================================

-- ---------- 1. Profils : semaine et dernière activité ----------
alter table public.profiles add column if not exists week_xp   integer     not null default 0;
alter table public.profiles add column if not exists week_key  text        not null default '';
alter table public.profiles add column if not exists last_seen timestamptz not null default now();
create index if not exists profiles_week_idx on public.profiles (week_key, week_xp desc);

-- ---------- 2. Statistiques des réponses (anonymes) ----------
create table if not exists public.theme_stats (
  theme      integer primary key,
  rounds     integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.answer_stats (
  theme integer not null,
  name  text    not null,
  found integer not null default 0,
  primary key (theme, name)
);
alter table public.theme_stats  enable row level security;
alter table public.answer_stats enable row level security;
drop policy if exists "Stats des thèmes (admin)" on public.theme_stats;
drop policy if exists "Stats des réponses (admin)" on public.answer_stats;
create policy "Stats des thèmes (admin)"   on public.theme_stats  for select using (public.is_admin());
create policy "Stats des réponses (admin)" on public.answer_stats for select using (public.is_admin());

-- Appelée à la fin de chaque manche : +1 manche pour le thème, +1 pour chaque réponse trouvée
create or replace function public.record_answers(p_theme integer, p_names text[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or p_theme is null or p_theme < 0 or p_theme > 999 then return; end if;
  if coalesce(array_length(p_names, 1), 0) > 150 then return; end if;
  insert into public.theme_stats (theme, rounds) values (p_theme, 1)
    on conflict (theme) do update set rounds = public.theme_stats.rounds + 1, updated_at = now();
  insert into public.answer_stats (theme, name, found)
    select p_theme, n, 1 from (select distinct left(trim(x), 60) as n from unnest(coalesce(p_names, '{}')) as x) s where n <> ''
    on conflict (theme, name) do update set found = public.answer_stats.found + 1;
end $$;

-- ---------- 3. Notifications ----------
create table if not exists public.push_subs (
  endpoint   text primary key check (char_length(endpoint) < 1000),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  p256dh     text not null check (char_length(p256dh) < 200),
  auth       text not null check (char_length(auth) < 100),
  daily      boolean not null default true,
  invites    boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists push_subs_user_idx on public.push_subs (user_id);
alter table public.push_subs enable row level security;
drop policy if exists "Voir ses abonnements" on public.push_subs;
drop policy if exists "Retirer ses abonnements" on public.push_subs;
drop policy if exists "Régler ses abonnements" on public.push_subs;
create policy "Voir ses abonnements"    on public.push_subs for select using (auth.uid() = user_id);
create policy "Retirer ses abonnements" on public.push_subs for delete using (auth.uid() = user_id);
create policy "Régler ses abonnements"  on public.push_subs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Un téléphone = un abonnement : s'il servait à un autre compte, il passe au compte connecté
create or replace function public.save_push_sub(p_endpoint text, p_p256dh text, p_auth text, p_daily boolean, p_invites boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then raise exception 'Crée ton profil'; end if;
  delete from public.push_subs where endpoint = p_endpoint;
  insert into public.push_subs (endpoint, user_id, p256dh, auth, daily, invites)
    values (p_endpoint, auth.uid(), p_p256dh, p_auth, coalesce(p_daily, true), coalesce(p_invites, true));
end $$;

-- Clés privées (lues uniquement par la fonction serveur « notify »)
create table if not exists public.app_secrets (k text primary key, v text not null);
alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;

-- ---------- 4. Nettoyage automatique (durées annoncées dans les mentions légales) ----------
create table if not exists public.maintenance_log (
  id     bigserial primary key,
  at     timestamptz not null default now(),
  result jsonb not null
);
alter table public.maintenance_log enable row level security;
drop policy if exists "Journal (admin)" on public.maintenance_log;
create policy "Journal (admin)" on public.maintenance_log for select using (public.is_admin());

create or replace function public.purge_old_data() returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare n_users int; n_matches int; n_daily int; n_reports int; res jsonb;
begin
  -- parties en ligne sans activité depuis 12 mois (leurs manches partent avec elles)
  with gone as (
    delete from public.matches m
    where m.created_at < now() - interval '12 months'
      and not exists (select 1 from public.plays p where p.code = m.code and p.updated_at >= now() - interval '12 months')
    returning 1)
  select count(*) into n_matches from gone;
  -- scores du défi du jour de plus de 12 mois
  with gone as (delete from public.dailyscores where updated_at < now() - interval '12 months' returning 1)
  select count(*) into n_daily from gone;
  -- signalements traités depuis plus de 12 mois
  with gone as (
    delete from public.reports
    where status <> 'new' and coalesce(treated_at, created_at) < now() - interval '12 months'
    returning 1)
  select count(*) into n_reports from gone;
  -- comptes sans connexion ni partie depuis 2 ans (sauf administratrices)
  with gone as (
    delete from auth.users u
    where not exists (select 1 from public.app_admins a where a.user_id = u.id)
      and greatest(u.created_at,
                   coalesce(u.last_sign_in_at, u.created_at),
                   coalesce((select p.last_seen from public.profiles p where p.id = u.id), u.created_at))
          < now() - interval '2 years'
    returning 1)
  select count(*) into n_users from gone;
  -- le journal lui-même ne garde que 12 mois
  delete from public.maintenance_log where at < now() - interval '12 months';
  res := jsonb_build_object('comptes', n_users, 'parties', n_matches, 'defis', n_daily, 'signalements', n_reports);
  insert into public.maintenance_log (result) values (res);
  return res;
end $$;

-- ---------- 5. Droits d'exécution ----------
revoke all on function public.record_answers(integer, text[]) from public, anon;
grant execute on function public.record_answers(integer, text[]) to authenticated;
revoke all on function public.save_push_sub(text, text, text, boolean, boolean) from public, anon;
grant execute on function public.save_push_sub(text, text, text, boolean, boolean) to authenticated;
revoke all on function public.purge_old_data() from public, anon, authenticated;

-- ---------- 6. Tâches planifiées (Supabase : extensions pg_cron et pg_net) ----------
-- À exécuter sur Supabase uniquement (voir migration-4b-taches-planifiees.sql)
