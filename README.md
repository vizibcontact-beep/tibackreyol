# Ti Bac Kréyol — mise en ligne pas à pas

Le petit bac de la culture antillaise, en application web installable sur téléphone.
Même méthode que Sa ki ka fèt : **Supabase** (comptes et données), **GitHub** (le code), **Vercel** (le site).

Durée : environ 45 minutes. Coût : 0 €.

---

## Ce que contient ce dossier

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | La page du jeu |
| `app.js`, `data.js`, `style.css` | Le jeu, les 66 thèmes, le style |
| `config.js` | **Les 2 clés Supabase à remplir** (étape 2) |
| `supabase/schema.sql` | La base de données à créer (étape 1) |
| `avatars/`, `icons/` | Les 18 personnages et les icônes de l'appli |
| `manifest.webmanifest`, `sw.js` | Ce qui rend l'appli installable sur l'écran d'accueil |
| `vendor/supabase.js` | La bibliothèque Supabase (version 2.117.2) |
| `vercel.json` | Réglages de Vercel |

---

## Étape 1 — Créer la base de données (Supabase)

1. Va sur **supabase.com** → **New project**.
   - Nom : `tibackreyol`
   - Mot de passe de la base : génère-le et **garde-le** dans ton gestionnaire de mots de passe.
   - **Région : choisis une région en Europe** (Paris ou Frankfurt), c'est préférable pour le RGPD.
2. Attends que le projet soit prêt (1 à 2 minutes).
3. Menu de gauche → **SQL Editor** → **New query**.
4. Ouvre le fichier `supabase/schema.sql`, copie **tout** son contenu, colle-le, puis clique **Run**.
   Tu dois voir « Success. No rows returned ».
5. Recommence avec le fichier `supabase/migration-2-multijoueur.sql` (parties en ligne de 2 à 5 joueurs) : **New query**, coller, **Run**.
6. Idem avec `supabase/migration-3-quitter-partie.sql` (supprimer ou quitter une partie).
7. Idem avec `supabase/migration-4-nettoyage-stats-notifs.sql` (statistiques des réponses, classement de la semaine, notifications, nettoyage automatique), puis `supabase/migration-4b-taches-planifiees.sql` (tâches de chaque nuit et rappel du défi).
8. Notifications : déploie la fonction `supabase/functions/notify` (Edge Functions → Deploy, **sans** « Verify JWT »), puis remplis la table `app_secrets` : `vapid_public`, `vapid_private` (clés générées avec `npx web-push generate-vapid-keys`), `vapid_subject` (`mailto:ton@adresse`), `cron_secret` (une longue suite de caractères au hasard) et `functions_url` (`https://TON-PROJET.supabase.co/functions/v1`). Mets la même clé publique dans `config.js` (`VAPID_PUBLIC`).

## Étape 2 — Relier le jeu à la base

1. Dans Supabase : **Project Settings** (roue crantée) → **API** (ou **Data API**).
2. Copie **Project URL** et la clé **anon / public**.
3. Ouvre `config.js` et remplace :
   - `https://VOTRE-PROJET.supabase.co` par ton Project URL,
   - `VOTRE-CLE-ANON` par ta clé anon.
4. ⚠️ Ne mets **jamais** la clé `service_role` dans ce fichier : elle donne tous les droits.

## Étape 3 — Mettre le code sur GitHub

1. Sur **github.com** → **New repository** → nom : `tibackreyol` → **Create repository**.
2. Sur la page du dépôt vide → **uploading an existing file**.
3. Glisse-dépose **tout le contenu** du dossier (fichiers **et** dossiers `avatars`, `icons`, `supabase`, `vendor`).
4. **Commit changes**.

## Étape 4 — Publier avec Vercel

1. Sur **vercel.com** → **Add New… → Project** → importe le dépôt `tibackreyol`.
2. Framework Preset : **Other**. Ne change rien d'autre.
3. **Deploy**. Au bout d'une minute, Vercel te donne une adresse du type `https://tibackreyol.vercel.app`.

## Étape 5 — Dire à Supabase où se trouve le jeu

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL** : colle ton adresse Vercel (`https://tibackreyol.vercel.app`).
3. **Redirect URLs** → **Add URL** : la même adresse, suivie de `/**`.
4. **Save**.

Sans cette étape, les liens des e-mails (confirmation, mot de passe oublié) ne ramènent pas au jeu.

## Étape 6 — Créer ton compte et devenir admin

1. Ouvre ton adresse Vercel sur ton téléphone → onglet **Connexion** → **Créer un compte**.
2. Clique sur le lien de l'e-mail de confirmation, reviens, connecte-toi, crée ton profil.
3. Dans Supabase → **SQL Editor** → **New query**, colle en remplaçant par **ton** e-mail :
   ```sql
   insert into public.app_admins (user_id)
   select id from auth.users where email = 'ton.adresse@exemple.com';
   ```
   → **Run**. Recharge le jeu : l'onglet **Admin** apparaît.

## Étape 7 — Installer l'appli sur le téléphone

- **Android (Chrome)** : onglet Jouer → bouton **Installer sur ce téléphone**, ou menu ⋮ → « Installer l'application ».
- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».

---

## Réglages conseillés

- **E-mails en français** : Authentication → **Email Templates** → traduis les modèles « Confirm signup » et « Reset password ».
- **Limite d'e-mails** : le service d'e-mail intégré de Supabase n'envoie que quelques e-mails par heure. C'est suffisant pour les tests. Avant d'ouvrir le jeu au public, branche un service d'envoi gratuit (Brevo, Resend…) dans Authentication → **SMTP Settings**.
- **Pendant les tests seulement**, tu peux désactiver la confirmation d'e-mail (Authentication → Sign In / Providers → Email → *Confirm email*) pour aller plus vite. Réactive-la avant le lancement public.
- **Projet gratuit en pause** : Supabase met en pause un projet gratuit resté inactif environ une semaine. Il suffit de le relancer depuis le tableau de bord. Si le jeu a des joueurs réguliers, ce n'est pas un problème.
- **Nom de domaine** (ex. `tibackreyol.com`) : Vercel → ton projet → **Settings → Domains**. Pense ensuite à mettre à jour la Site URL et les Redirect URLs dans Supabase (étape 5).

## Mettre le jeu à jour

1. Modifie les fichiers dans GitHub (ou dépose les nouvelles versions).
2. Vercel republie automatiquement en une minute.
3. Si tu modifies `app.js`, `data.js` ou `style.css`, change aussi `tibac-v1` en `tibac-v2` (puis v3…) dans `sw.js`, pour que les téléphones récupèrent la nouvelle version.

## Données et RGPD

- Chaque joueur peut supprimer son compte et toutes ses données depuis l'onglet **Connexion**.
- Tu peux consulter et supprimer des données dans Supabase → **Table Editor**.
- Les durées de conservation annoncées dans les mentions légales (2 ans sans connexion, 12 mois pour les parties, les scores du jour et les signalements traités) sont appliquées automatiquement chaque nuit à 3 h 17 (heure des Antilles). Le résultat du dernier nettoyage s'affiche en bas de l'onglet Admin.

## Limites connues de cette première version

- Les scores sont calculés sur le téléphone de chaque joueur : un joueur très motivé pourrait tricher. Les règles de la base empêchent de modifier le score **d'un autre**, mais pas le sien. À renforcer avant un grand lancement (vérification des scores côté serveur).
