# Pocha accounts: Firebase setup

The scoreboard at `/pocha/` works with no backend. Accounts (sign-in, saved
games, statistics) switch on once `static/pocha/firebase-config.js` holds a
Firebase web config. Until then the *Stats* tab stays hidden.

Everything below fits in Firebase's free Spark plan.

1. **Create the project.** Go to <https://console.firebase.google.com>, then
   *Add project*. Google Analytics is not needed.
2. **Register a web app.** Open *Project settings → General → Your apps → Web*
   (`</>`). Copy the `apiKey`, `authDomain`, `projectId` and `appId` values into
   `static/pocha/firebase-config.js`. They are public by design: the
   Firestore rules are what protect the data.
3. **Turn on sign-in.** Go to *Build → Authentication → Sign-in method*:
   - enable **Google**;
   - enable **Email/Password** and, inside it, **Email link (passwordless
     sign-in)**.
4. **Authorise the site.** Under *Authentication → Settings → Authorized
   domains*, add `andreanovoa.github.io`. `localhost` is already there for
   local testing with `hugo server`.
5. **Create the database.** Go to *Build → Firestore Database → Create
   database*, start in **production mode** and pick a location such as
   `eur3`.
6. **Publish the rules.** In *Firestore → Rules*, paste the contents of
   [`firestore.rules`](firestore.rules) and press *Publish*. With the
   Firebase CLI you can run `firebase deploy --only firestore:rules` instead.
7. **Index.** The game list sorts on one field, so no composite index is
   needed.
8. **Let Google send sign-ins back to this site.** Safari, Brave and the
   installed iOS app block the default sign-in, which returns through
   `<project>.firebaseapp.com`. So the deploy workflow
   (`.github/workflows/hugo.yml`) copies Firebase's sign-in helper into
   `/__/auth/` on this site, and `authDomain` in `firebase-config.js` is
   `andreanovoa.github.io`. For Google to accept that, open
   <https://console.cloud.google.com/apis/credentials>, pick the project,
   open **Web client (auto created by Google Service)** and add:
   - Authorized JavaScript origins: `https://andreanovoa.github.io`
   - Authorized redirect URIs: `https://andreanovoa.github.io/__/auth/handler`

   If the Firebase project ever changes, update `base=` in the workflow step
   *Self-host the Firebase sign-in helper for Pocha* as well.

## Current project

- Firebase project: `pocha-37f93` (Spark plan, no billing)
- Console: <https://console.firebase.google.com/project/pocha-37f93>

## Troubleshooting

| Error | Fix |
| --- | --- |
| `auth/configuration-not-found` | Authentication not started, or the provider is off (step 3). |
| `auth/unauthorized-domain` | Add `andreanovoa.github.io` to Authorized domains (step 4). |
| `missing initial state` | Sign-in went through `firebaseapp.com`; check step 8. |
| `redirect_uri_mismatch` | The redirect URI in step 8 is missing or mistyped. |
| `permission-denied` when saving | The Firestore rules are not published (step 6). |

## Data layout

```
users/{uid}/games/{gameId}
  startedAt    ISO string
  finishedAt   ISO string or null
  finished     bool
  players      [names in seating order]
  firstDealer  seat index
  repeatMiddle bool
  rounds       [cards per round]
  results      [{ cards, dealer, bids: [...], won: [...] }]
  savedAt      server timestamp
```

`gameId` is generated in the browser when a game starts, so saving the
same game again overwrites it instead of creating a duplicate. The
statistics are computed in the browser from the account's saved games.
