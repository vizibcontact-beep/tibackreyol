-- ============================================================
--  Ti Bac Kréyol — migration 4b : tâches planifiées
--  (après migration-4). Nécessite les extensions pg_cron et pg_net.
-- ============================================================
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- Appelle la fonction serveur « notify » (adresse et clé secrète rangées dans app_secrets)
create or replace function public.ping_notify(p_kind text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare u text; s text;
begin
  select v into u from public.app_secrets where k = 'functions_url';
  select v into s from public.app_secrets where k = 'cron_secret';
  if u is null or s is null then return; end if;
  perform net.http_post(
    url     := u || '/notify',
    body    := jsonb_build_object('kind', p_kind),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', s));
end $$;
revoke all on function public.ping_notify(text) from public, anon, authenticated;

-- Nettoyage chaque nuit à 3 h 17 (heure des Antilles = 7 h 17 UTC)
select cron.schedule('tibac-nettoyage', '17 7 * * *', $$select public.purge_old_data()$$);
-- Rappel du défi du jour à 17 h 30 (heure des Antilles = 21 h 30 UTC), seulement à ceux qui ne l'ont pas joué
select cron.schedule('tibac-rappel-defi', '30 21 * * *', $$select public.ping_notify('daily')$$);
