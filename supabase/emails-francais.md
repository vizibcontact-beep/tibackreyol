# E-mails de connexion en français (Supabase)

Deux réglages, à faire une seule fois dans Supabase (projet **tibackreyol**).

## 1. Brancher un service d'envoi (SMTP)

Sans ce réglage, Supabase n'envoie les e-mails **qu'aux membres de ton équipe Supabase**, et seulement quelques-uns par heure. Les autres joueurs ne reçoivent pas leur code de confirmation ni le lien « mot de passe oublié ».

### Option A — Gmail (le plus simple, jusqu'à 500 e-mails par jour)

1. Sur ton compte Google : **Sécurité** → active la **validation en deux étapes** si ce n'est pas déjà fait.
2. Toujours dans **Sécurité**, ouvre **Mots de passe des applications**, crée-en un nommé « Ti Bac Kréyol » et copie le code de 16 lettres.
3. Dans Supabase : **Authentication** → **Emails** → onglet **SMTP Settings** → active **Enable custom SMTP** et remplis :
   - Sender email : ton adresse Gmail
   - Sender name : `Ti Bac Kréyol`
   - Host : `smtp.gmail.com`
   - Port : `587`
   - Username : ton adresse Gmail
   - Password : le code de 16 lettres
4. **Save**.

### Option B — Brevo (gratuit, 300 e-mails par jour, adresse d'expéditeur dédiée)

1. Crée un compte sur brevo.com, puis **Senders, domains & dedicated IPs** → ajoute et valide ton adresse d'expéditeur.
2. **SMTP & API** → onglet **SMTP** : note le **login SMTP** et génère une **clé SMTP**.
3. Dans Supabase (même écran qu'au-dessus) :
   - Host : `smtp-relay.brevo.com` — Port : `587`
   - Username : le login SMTP Brevo — Password : la clé SMTP
   - Sender email : l'adresse validée — Sender name : `Ti Bac Kréyol`

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
