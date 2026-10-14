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
