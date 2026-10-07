# E-mails de connexion en français (Supabase)

Deux réglages, à faire une seule fois dans Supabase (projet **tibackreyol**).

## 1. Le plan retenu (environ 8 € par an)

- Domaine **jeukreyol.fr** acheté chez OVH (servira pour tous les jeux).
- E-mails **reçus** sur contact@jeukreyol.fr : redirigés vers le Gmail personnel.
- E-mails **envoyés** par les jeux : Brevo gratuit (300 par jour, tous jeux confondus).

Sans service d'envoi, Supabase n'envoie les e-mails **qu'aux membres de l'équipe Supabase** : les autres joueurs ne reçoivent ni code ni lien « mot de passe oublié ».

### Étape 1 — Acheter jeukreyol.fr chez OVH
Cherche le domaine sur ovhcloud.com, refuse les options payantes (hébergement, e-mail pro), paie.

### Étape 2 — Rediriger contact@jeukreyol.fr vers Gmail
Espace client OVH → **Web Cloud** → **Emails** → ton domaine → **Redirection** → **Ajouter** : de `contact@jeukreyol.fr` vers ton Gmail. (Ajoute plus tard tibac@, noreply@… de la même façon.)

### Étape 3 — Brevo : vérifier le domaine et l'expéditeur
1. Crée un compte gratuit sur brevo.com.
2. **Expéditeurs, domaines et IP dédiées** → **Domaines** → **Ajouter un domaine** → `jeukreyol.fr`. Accepte la configuration automatique avec OVH si Brevo la propose ; sinon, copie chaque ligne DNS indiquée dans OVH (**Noms de domaine** → jeukreyol.fr → **Zone DNS** → **Ajouter une entrée**). Clique sur **Vérifier** (quelques minutes à quelques heures).
3. **Expéditeurs** → ajoute `contact@jeukreyol.fr`, nom `Ti Bac Kréyol`. Le code de confirmation arrive dans ton Gmail grâce à l'étape 2.
4. **SMTP et API** → onglet **SMTP** : note le **login SMTP** et génère une **clé SMTP** (garde-la pour toi).

### Étape 4 — Brancher Brevo dans Supabase
Projet **tibackreyol** → **Authentication** → **Emails** → **SMTP Settings** → active **Enable custom SMTP** :
- Sender email : `contact@jeukreyol.fr` — Sender name : `Ti Bac Kréyol`
- Host : `smtp-relay.brevo.com` — Port : `587`
- Username : le login SMTP Brevo — Password : la clé SMTP
- **Save**

### Ensuite

- **Authentication** → **Rate Limits** : Supabase limite d'abord à 30 e-mails par heure ; monte à 100 si besoin.
- **Authentication** → **Sign In / Providers** → **Email** : vérifie que **Confirm email** est **activé** (s'il avait été désactivé pendant les tests, réactive-le maintenant).

## 2. Traduire les modèles d'e-mails

**Authentication** → **Emails** → onglet **Templates**. Pour chaque modèle, remplace l'objet (*Subject*) et le contenu (*Message body*) par le texte ci-dessous.

Le jeu demande un **code à 6 chiffres** à l'inscription : le modèle « Confirm signup » doit donc contenir `{{ .Token }}`.

### Confirm signup

Objet : `Ton code Ti Bac Kréyol : {{ .Token }}`

```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1d2b30">
  <h2 style="color:#154250">Bienvenue dans Ti Bac Kréyol 🌴</h2>
  <p>Voici ton code de confirmation :</p>
  <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#154250">{{ .Token }}</p>
  <p>Saisis-le dans le jeu pour activer ton compte. Tu peux aussi cliquer sur ce lien :</p>
  <p><a href="{{ .ConfirmationURL }}">Confirmer mon adresse</a></p>
  <p style="color:#666;font-size:13px">Si tu n'as pas créé de compte, ignore simplement cet e-mail.</p>
</div>
```

### Reset password

Objet : `Ti Bac Kréyol : choisis un nouveau mot de passe`

```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1d2b30">
  <h2 style="color:#154250">Mot de passe oublié ?</h2>
  <p>Clique sur ce lien pour choisir un nouveau mot de passe :</p>
  <p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#154250;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Choisir un nouveau mot de passe</a></p>
  <p style="color:#666;font-size:13px">Si tu n'as rien demandé, ignore cet e-mail : ton mot de passe ne change pas.</p>
</div>
```

### Magic link

Objet : `Ton code de connexion Ti Bac Kréyol : {{ .Token }}`

```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1d2b30">
  <h2 style="color:#154250">Connexion à Ti Bac Kréyol</h2>
  <p>Ton code :</p>
  <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#154250">{{ .Token }}</p>
  <p>Ou clique sur ce lien : <a href="{{ .ConfirmationURL }}">me connecter</a></p>
  <p style="color:#666;font-size:13px">Si tu n'as rien demandé, ignore cet e-mail.</p>
</div>
```

### Change email address

Objet : `Ti Bac Kréyol : confirme ta nouvelle adresse`

```html
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1d2b30">
  <h2 style="color:#154250">Nouvelle adresse e-mail</h2>
  <p>Confirme le changement de {{ .Email }} vers {{ .NewEmail }} :</p>
  <p><a href="{{ .ConfirmationURL }}">Confirmer ma nouvelle adresse</a></p>
</div>
```

## 3. Tester

Crée un compte avec une autre adresse (par exemple celle d'un proche) : l'e-mail doit arriver en français, avec le code à 6 chiffres. Pense à regarder les spams la première fois.
