-- Jeu Kréyol — migration 8 : classement pour Woulé yol, Koko tonbé et Mémory Ti moun
alter table public.jk_scores drop constraint if exists jk_scores_game_check;
alter table public.jk_scores add constraint jk_scores_game_check check (game in (
  'mo','mele_easy','mele_normal','mele_hard','vf','pw','km','lk_MQ','lk_GP','lk_GF',
  'kt','mem_easy','mem_normal','mem_hard','yol'));
