/* Pocha — configuración de Firebase / Firebase configuration.
 *
 * Pega aquí el objeto firebaseConfig de la consola de Firebase
 * (Configuración del proyecto → Tus apps → App web). Estos valores son
 * públicos: quien protege los datos son las reglas de Firestore.
 * Mientras apiKey esté vacío, el marcador funciona sin cuentas.
 *
 * Paste the firebaseConfig object from the Firebase console here
 * (Project settings → Your apps → Web app). These values are public:
 * the Firestore rules are what protect the data. While apiKey is empty,
 * the scoreboard works without accounts.
 */
window.POCHA_FIREBASE = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: ''
};
