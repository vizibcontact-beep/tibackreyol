-- ============================================================
--  Ti Bac Kréyol — migration 6 : protection anti-spam
--  Limites par joueur et par 24 heures, vérifiées par la base
--  (un robot qui contourne l'application est bloqué quand même)
-- ============================================================

create or replace function public.limit_per_day() returns trigger
language plpgsql security definer set search_path = public as $$
declare n integer; who uuid; lim integer := tg_argv[1]::int;
begin
  -- l'administratrice et les tâches automatiques ne sont pas limitées
  if auth.uid() is null or public.is_admin() then return new; end if;
  who := auth.uid();
  execute format('select count(*) from public.%I where %I = $1 and created_at > now() - interval ''24 hours''', tg_table_name, tg_argv[0])
    into n using who;
  if n >= lim then
    raise exception 'Limite atteinte : réessaie demain.' using errcode = 'P0001', hint = 'limite_quotidienne';
  end if;
  return new;
end $$;

drop trigger if exists limit_reports on public.reports;
create trigger limit_reports before insert on public.reports
  for each row execute function public.limit_per_day('user_id', '40');

drop trigger if exists limit_friend_requests on public.friendships;
create trigger limit_friend_requests before insert on public.friendships
  for each row execute function public.limit_per_day('from_id', '30');

drop trigger if exists limit_matches on public.matches;
create trigger limit_matches before insert on public.matches
  for each row execute function public.limit_per_day('host', '40');

-- Signalements : réponse de 1 à 40 caractères
alter table public.reports drop constraint if exists reports_answer_len;
alter table public.reports add constraint reports_answer_len check (char_length(btrim(answer)) between 1 and 40) not valid;

revoke all on function public.limit_per_day() from public, anon, authenticated;
