-- ============================================================
--  Ti Bac Kréyol — migration 3 : supprimer / quitter une partie
-- ============================================================
alter table public.matches add column if not exists hidden uuid[] not null default '{}';

-- Selon l'état de la partie :
--  * seul joueur          -> la partie est supprimée
--  * partie terminée      -> elle disparaît de la liste du joueur (supprimée quand tous l'ont retirée)
--  * partie en cours      -> le joueur abandonne : ses manches sont retirées, les autres continuent
create or replace function public.leave_match(p_code text) returns text
language plpgsql security definer set search_path = public as $$
declare m public.matches%rowtype; n integer; done_count integer; rest uuid[];
begin
  if auth.uid() is null then return 'Connecte-toi.'; end if;
  select * into m from public.matches where code = upper(p_code) for update;
  if not found or not (auth.uid() = any (m.players)) then return null; end if;
  n := coalesce(array_length(m.players, 1), 0);
  if n <= 1 then
    delete from public.matches where code = m.code;
    return null;
  end if;
  select count(*) into done_count from public.plays
    where code = m.code and r >= 5 and user_id = any (m.players);
  if m.started and done_count >= n then
    update public.matches set hidden = array_append(array_remove(hidden, auth.uid()), auth.uid())
      where code = m.code returning * into m;
    if (select count(*) from unnest(m.players) p where p = any (m.hidden)) >= n then
      delete from public.matches where code = m.code;
    end if;
    return null;
  end if;
  delete from public.plays where code = m.code and user_id = auth.uid();
  rest := array_remove(m.players, auth.uid());
  update public.matches set
    players  = rest,
    host     = case when host = auth.uid() then rest[1] else host end,
    hidden   = array_remove(hidden, auth.uid()),
    declined = array_append(array_remove(declined, auth.uid()), auth.uid())
  where code = m.code;
  return null;
end $$;

revoke all on function public.leave_match(text) from public, anon;
grant execute on function public.leave_match(text) to authenticated;
