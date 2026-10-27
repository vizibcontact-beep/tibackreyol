-- ============================================================
--  Jeu Kréyol — migration 7 : scores du jour des petits jeux
--  (Kréyol Mo, Mo mélé, Vré ou fo, Konbat Pwovèb, Ki moun ?, Lakarté)
--  Un seul résultat par joueur, par jeu et par jour ; il rapporte
--  au plus 10 points de classement (niveau et classement de la semaine).
-- ============================================================

create table if not exists public.jk_scores (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  game       text not null check (game in ('mo','mele_easy','mele_normal','mele_hard','vf','pw','km','lk_MQ','lk_GP','lk_GF')),
  day        date not null,
  score      integer not null check (score between 0 and 100000),
  detail     text check (char_length(detail) <= 120),
  created_at timestamptz not null default now(),
  primary key (user_id, game, day)
);
create index if not exists jk_scores_day_idx on public.jk_scores (game, day, score desc);
alter table public.jk_scores enable row level security;
-- lecture et écriture uniquement par les fonctions ci-dessous
revoke all on public.jk_scores from anon, authenticated;

-- Jour et semaine à l'heure des Antilles (UTC-4)
create or replace function public.jk_today() returns date
language sql stable set search_path = public as $$ select (now() at time zone 'America/Martinique')::date $$;

create or replace function public.jk_submit(p_game text, p_score integer, p_xp integer, p_detail text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); d date := public.jk_today(); wk text; add integer; rk integer; n integer;
begin
  if me is null then return jsonb_build_object('error','connexion'); end if;
  if not exists (select 1 from public.profiles where id = me) then return jsonb_build_object('error','profil'); end if;
  insert into public.jk_scores (user_id, game, day, score, detail)
    values (me, p_game, d, greatest(0, p_score), left(p_detail, 120))
    on conflict do nothing;
  if found then
    add := least(10, greatest(0, coalesce(p_xp, 0)));
    wk := to_char(d - ((extract(isodow from d)::int) - 1), 'YYYY-MM-DD');
    update public.profiles set
      xp = xp + add,
      week_xp = case when week_key = wk then week_xp + add else add end,
      week_key = wk,
      last_seen = now()
    where id = me;
  else
    add := 0;
  end if;
  select count(*) + 1 into rk from public.jk_scores s
    where s.game = p_game and s.day = d
      and s.score > (select score from public.jk_scores where user_id = me and game = p_game and day = d);
  select count(*) into n from public.jk_scores where game = p_game and day = d;
  return jsonb_build_object('xp', add, 'rank', rk, 'players', n);
end $$;

-- Classement du jour d'un jeu (20 premiers)
create or replace function public.jk_top(p_game text)
returns table (pseudo text, avatar text, score integer, detail text, me boolean)
language sql stable security definer set search_path = public as $$
  select p.pseudo, p.avatar, s.score, s.detail, s.user_id = auth.uid()
  from public.jk_scores s join public.profiles p on p.id = s.user_id
  where s.game = p_game and s.day = public.jk_today()
  order by s.score desc, s.created_at asc
  limit 20;
$$;

revoke all on function public.jk_submit(text, integer, integer, text) from public, anon;
revoke all on function public.jk_top(text) from public;
grant execute on function public.jk_submit(text, integer, integer, text) to authenticated;
grant execute on function public.jk_top(text) to anon, authenticated;

-- Nettoyage : les scores des petits jeux sont gardés 12 mois
create or replace function public.jk_purge() returns void
language sql security definer set search_path = public as $$
  delete from public.jk_scores where day < (public.jk_today() - interval '12 months');
$$;
revoke all on function public.jk_purge() from public, anon, authenticated;

-- Tâche planifiée (pg_cron déjà activé par la migration 4b)
select cron.schedule('jk-nettoyage', '23 7 * * *', $$select public.jk_purge()$$);
