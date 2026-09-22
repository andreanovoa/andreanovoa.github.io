/* Pocha — textos de la interfaz y de las reglas / interface and rules copy. */
window.POCHA_I18N = {
  es: {
    label: 'Español',
    switchTo: 'Ver la página en inglés',
    tabGame: 'Partida',
    tabRules: 'Instrucciones',

    /* configuración */
    newGame: 'Nueva partida',
    playersLabel: 'Jugadores',
    dealsFirst: 'Reparte primero',
    drawDealer: 'Sortear quién reparte',
    repeatLong: 'Repetir rondas largas',
    seatHint: 'Escribe los nombres en el orden de la mesa, empezando por quien quieras y siguiendo hacia la derecha, en el sentido contrario a las agujas del reloj. Las rondas se anotan en ese mismo orden. El dado sortea quién reparte la primera mano.',
    seatLabel: 'Orden de la mesa',
    playerN: function (i) { return 'Jugador ' + i; },
    rosterHint: 'Nombres guardados en este dispositivo. Pulsa uno para añadirlo al primer hueco libre.',
    preview: function (n, maxCards, rounds) {
      return n + ' jugadores, ' + maxCards + ' cartas como máximo por mano y ' +
        rounds + (rounds === 1 ? ' ronda' : ' rondas') + ' en total.';
    },
    start: 'Empezar partida',
    forget: 'Borrar nombres guardados',
    confirmForget: '¿Borrar los nombres guardados en este dispositivo?',

    /* ronda */
    roundOf: function (i, total) { return 'Ronda ' + i + ' de ' + total; },
    cardsEach: function (n) { return n + (n === 1 ? ' carta' : ' cartas') + ' por jugador'; },
    dealsChip: function (name) { return 'Reparte ' + name; },
    rowOrder: 'Filas en orden de juego, desde la derecha del repartidor',
    colPlayer: 'Jugador',
    colBid: 'Apuesta',
    colTricks: 'Bazas',
    saveRound: 'Guardar ronda',
    undoRound: 'Deshacer ronda anterior',
    bidsMissing: 'Faltan apuestas por anotar',
    bidsSum: function (sum, cards) { return 'Apuestas: ' + sum + ' de ' + cards; },
    bidsTie: function (cards) { return 'Las apuestas suman ' + cards + ', igual que las cartas de la mano. El repartidor tiene que cambiar su apuesta.'; },
    tricksSum: function (sum, cards) { return 'bazas: ' + sum + ' de ' + cards; },
    tricksCheck: function (sum, cards) { return 'Revisa las bazas anotadas: suman ' + sum + ' y la mano tiene ' + cards + ' ' + (cards === 1 ? 'carta' : 'cartas') + '.'; },

    /* marcador */
    standings: 'Marcador',
    pointsUnit: ' pts',
    hitsOf: function (hits, played) { return hits + ' de ' + played + (played === 1 ? ' ronda acertada' : ' rondas acertadas'); },
    standingsLegend: 'Puntos acumulados, rondas acertadas y cambio de la última ronda.',
    playedRounds: 'Rondas jugadas',
    noRounds: 'Todavía no hay rondas anotadas.',
    shortBid: 'A',
    shortTricks: 'B',
    shortPoints: 'Pts',
    shortTotal: 'Tot',
    tableLegend: 'A: apuesta · B: bazas ganadas · Pts: puntos de la ronda · Tot: acumulado. El punto junto al número de cartas marca la mano que reparte.',
    winsWith: function (points) { return 'Gana la partida con ' + points + ' puntos.'; },

    /* exportación */
    saveShare: 'Guardar y compartir',
    downloadCsv: 'Descargar CSV',
    sendSheets: 'Enviar a Google Sheets',
    newGameBtn: 'Partida nueva',
    confirmNew: 'La partida está a medias. ¿Empezar otra?',
    sheetsSection: 'Conexión con Google Sheets',
    sheetsUrlLabel: 'URL de la aplicación web de Apps Script',
    sheetsUrlHint: 'La URL se guarda en este dispositivo. Las instrucciones para crear la hoja están más abajo.',
    sheetsNeedUrl: 'Añade primero la URL de la aplicación web de Apps Script.',
    sheetsSending: 'Enviando la partida…',
    sheetsSent: 'Partida enviada a la hoja de cálculo. Compruébala para confirmar que la fila aparece.',
    sheetsFailed: 'No se ha podido enviar la partida. Revisa la URL y la conexión; el CSV sigue disponible.',
    csvHeaders: { round: 'Ronda', cards: 'Cartas', deals: 'Reparte', bid: 'apuesta', tricks: 'bazas', points: 'puntos', total: 'total', totalRow: 'Total' },

    /* documentación */
    docs: [
      { h2: 'Cómo se juega' },
      { p: 'La pocha se juega con la baraja española de 40 cartas, del 1 al 7 más sota, caballo y rey. En cada ronda se reparte el mismo número de cartas a cada jugador, cada uno apuesta cuántas bazas cree que va a ganar y después se juega la mano. El número máximo de cartas por mano es 40 dividido entre el número de jugadores, redondeado hacia abajo.' },
      { p: 'Las rondas suben de una carta hasta el máximo, se repite la mano larga tantas veces como jugadores menos uno, y después bajan de nuevo hasta una carta. La opción <em>repetir rondas largas</em> multiplica esas manos largas por el número de jugadores, de forma que cada jugador reparte una mano larga en cada vuelta.' },
      { p: 'Quien reparte apuesta el último, y el total de las apuestas no puede coincidir con el número de cartas de la mano, así que al menos un jugador falla. Al anotar la última apuesta, el marcador avisa en rojo si la suma coincide. Con las bazas, avisa en ámbar si no suman las cartas de la mano, para que se revisen antes de guardar la ronda.' },

      { h2: 'Asistir, subir, fallar y ahorrar' },
      { p: 'Hay que asistir y subir. Si quien sale echa oros, tienes que echar un oro más grande; si no tienes ninguno más grande, echas un oro más pequeño; y si no tienes oros, echas triunfo, que es fallar la baza.' },
      { p: 'Si la ronda ya va fallada, un jugador que no tiene el palo de salida y tiene triunfo, pero no puede superar al triunfo que está en la mesa, puede ahorrar, es decir, descartarse de otro palo en lugar de gastar el triunfo.' },

      { h2: 'Puntuación' },
      { table: { head: ['Resultado', 'Puntos'], rows: [['Acierta la apuesta', '10 + 5 × apuesta'], ['Falla la apuesta', '−5 × diferencia entre apuesta y bazas']] } },
      { p: 'Acertar una apuesta de cero vale 10 puntos, y acertar una apuesta de tres vale 25. Gana la partida quien acumula más puntos después de la última ronda.' },

      { h2: 'Orden de la mesa' },
      { p: 'Los nombres se escriben en el orden en el que se sientan los jugadores, empezando por cualquiera de ellos y siguiendo hacia la derecha, es decir, en el sentido contrario a las agujas del reloj. La pantalla de configuración muestra ese orden mientras se escriben los nombres, y el marcador lo reutiliza en cada ronda: las filas aparecen en el orden de juego, desde la derecha del repartidor hasta el repartidor, que apuesta el último. Anotar en ese orden evita buscar a cada jugador en la lista.' },

      { h2: 'Sorteo del repartidor' },
      { p: 'El botón con el dado, junto a <em>reparte primero</em>, elige al azar quién reparte la primera mano. El sorteo recorre los nombres y se detiene en el elegido. Cada jugador tiene la misma probabilidad de salir: el número se toma del generador criptográfico del navegador y se descartan los valores que caen fuera del último bloque completo, de forma que el resto no favorece a los primeros nombres de la lista. A partir de esa mano, el turno de repartir avanza una posición por ronda en el orden de la mesa.' },

      { h2: 'Nombres guardados' },
      { p: 'Los nombres de los jugadores se guardan en el navegador de este dispositivo, junto con la última alineación y la partida en curso. Al volver a abrir la página aparecen como sugerencias y como botones de acceso rápido, y una partida a medias se recupera tal y como se dejó. El botón <em>borrar nombres guardados</em> elimina la lista.' },

      { h2: 'Conexión con Google Sheets' },
      { p: 'El marcador envía la partida terminada a una hoja de cálculo a través de una aplicación web de Apps Script, que es el puente entre una página estática y Google Sheets. La configuración se hace una sola vez.' },
      { ol: [
        'Crea una hoja de cálculo en Google Sheets con dos pestañas, <code>Partidas</code> y <code>Clasificación</code>.',
        'Abre <strong>Extensiones → Apps Script</strong> y pega el código siguiente.',
        'Pulsa <strong>Implementar → Nueva implementación</strong>, elige el tipo <strong>Aplicación web</strong>, ejecuta la aplicación como tu cuenta y da acceso a <strong>Cualquier usuario</strong>.',
        'Copia la URL que termina en <code>/exec</code> y pégala en <strong>Conexión con Google Sheets</strong>, dentro del marcador.'
      ] },
      { code: 'apps-script' },
      { p: 'La pestaña <code>Partidas</code> guarda una fila por jugador y partida, y la pestaña <code>Clasificación</code> se recalcula en cada envío con las partidas jugadas, las victorias y los puntos acumulados por nombre. El navegador envía los datos sin leer la respuesta, por lo que conviene comprobar en la hoja que la partida ha llegado. Mientras tanto, el botón <em>descargar CSV</em> guarda el marcador completo en el dispositivo.' }
    ]
  },

  en: {
    label: 'English',
    switchTo: 'Read the page in Spanish',
    tabGame: 'Game',
    tabRules: 'Instructions',

    /* setup */
    newGame: 'New game',
    playersLabel: 'Players',
    dealsFirst: 'Deals first',
    drawDealer: 'Draw the first dealer',
    repeatLong: 'Repeat the long rounds',
    seatHint: 'Enter the names in seating order, starting with anyone and moving to the right, that is, anticlockwise. The rounds are scored in that same order. The dice draws who deals the first hand.',
    seatLabel: 'Seating order',
    playerN: function (i) { return 'Player ' + i; },
    rosterHint: 'Names saved on this device. Tap one to drop it into the first empty seat.',
    preview: function (n, maxCards, rounds) {
      return n + ' players, ' + maxCards + ' cards per hand at most and ' +
        rounds + (rounds === 1 ? ' round' : ' rounds') + ' in total.';
    },
    start: 'Start game',
    forget: 'Delete saved names',
    confirmForget: 'Delete the names saved on this device?',

    /* round */
    roundOf: function (i, total) { return 'Round ' + i + ' of ' + total; },
    cardsEach: function (n) { return n + (n === 1 ? ' card' : ' cards') + ' per player'; },
    dealsChip: function (name) { return name + ' deals'; },
    rowOrder: 'Rows in playing order, from the right of the dealer',
    colPlayer: 'Player',
    colBid: 'Bid',
    colTricks: 'Tricks',
    saveRound: 'Save round',
    undoRound: 'Undo the previous round',
    bidsMissing: 'Some bids are still missing',
    bidsSum: function (sum, cards) { return 'Bids: ' + sum + ' of ' + cards; },
    bidsTie: function (cards) { return 'The bids add up to ' + cards + ', the same as the cards in the hand. The dealer has to change their bid.'; },
    tricksSum: function (sum, cards) { return 'tricks: ' + sum + ' of ' + cards; },
    tricksCheck: function (sum, cards) { return 'Check the tricks entered: they add up to ' + sum + ' and the hand has ' + cards + ' ' + (cards === 1 ? 'card' : 'cards') + '.'; },

    /* scoreboard */
    standings: 'Scoreboard',
    pointsUnit: ' pts',
    hitsOf: function (hits, played) { return hits + ' of ' + played + (played === 1 ? ' round hit' : ' rounds hit'); },
    standingsLegend: 'Points accumulated, rounds hit and the change from the last round.',
    playedRounds: 'Rounds played',
    noRounds: 'No rounds scored yet.',
    shortBid: 'B',
    shortTricks: 'T',
    shortPoints: 'Pts',
    shortTotal: 'Tot',
    tableLegend: 'B: bid · T: tricks won · Pts: points of the round · Tot: running total. The dot next to the number of cards marks the hand that deals.',
    winsWith: function (points) { return 'Wins the game with ' + points + ' points.'; },

    /* export */
    saveShare: 'Save and share',
    downloadCsv: 'Download CSV',
    sendSheets: 'Send to Google Sheets',
    newGameBtn: 'New game',
    confirmNew: 'The game is unfinished. Start another one?',
    sheetsSection: 'Google Sheets connection',
    sheetsUrlLabel: 'Apps Script web app URL',
    sheetsUrlHint: 'The URL is kept on this device. The steps to create the spreadsheet are below.',
    sheetsNeedUrl: 'Add the Apps Script web app URL first.',
    sheetsSending: 'Sending the game…',
    sheetsSent: 'Game sent to the spreadsheet. Check the sheet to confirm that the row is there.',
    sheetsFailed: 'The game could not be sent. Check the URL and the connection; the CSV is still available.',
    csvHeaders: { round: 'Round', cards: 'Cards', deals: 'Deals', bid: 'bid', tricks: 'tricks', points: 'points', total: 'total', totalRow: 'Total' },

    /* documentation */
    docs: [
      { h2: 'How the game works' },
      { p: 'Pocha is played with the Spanish deck of 40 cards, from 1 to 7 plus the knave, the knight and the king. Each round deals the same number of cards to every player, each player bids how many tricks they expect to win, and the hand is then played. The largest hand is 40 divided by the number of players, rounded down.' },
      { p: 'The rounds climb from one card up to that maximum, the long hand is repeated as many times as there are players minus one, and the rounds then come back down to one card. The option <em>repeat the long rounds</em> multiplies those long hands by the number of players, so that every player deals a long hand in each lap.' },
      { p: 'The dealer bids last, and the bids cannot add up to the number of cards dealt, so at least one player fails. When the last bid is entered, the scoreboard flags in red that the bids add up to the hand. For the tricks, it flags in amber that they do not add up to the cards dealt, so that they are checked before the round is saved.' },

      { h2: 'Following suit, overtaking, trumping and saving' },
      { p: 'You have to follow suit and overtake. If the player who leads plays oros (coins), you have to play a higher oro; if you hold none that is higher, you play a lower oro; and if you hold no oros at all, you play a trump, which is called to trump the trick.' },
      { p: 'When the trick has already been trumped, a player who holds none of the led suit and holds a trump, but cannot beat the trump on the table, may save that trump, that is, discard from another suit instead of spending it.' },

      { h2: 'Scoring' },
      { table: { head: ['Outcome', 'Points'], rows: [['The bid is met', '10 + 5 × bid'], ['The bid is missed', '−5 × difference between bid and tricks']] } },
      { p: 'A bid of zero that is met is worth 10 points, and a bid of three that is met is worth 25. The player with the most points after the last round wins the game.' },

      { h2: 'Seating order' },
      { p: 'The names are entered in the order in which the players sit, starting with any of them and moving to the right, that is, anticlockwise. The setup screen shows that order as the names are typed, and the scoreboard reuses it in every round: the rows appear in playing order, from the right of the dealer up to the dealer, who bids last. Scoring in that order avoids looking for each player in the list.' },

      { h2: 'Drawing the dealer' },
      { p: 'The dice button, next to <em>deals first</em>, picks at random who deals the first hand. The draw runs through the names and stops on the chosen one. Every player is equally likely to come up: the number comes from the cryptographic generator of the browser, and the values that fall outside the last complete block are discarded, so that the remainder does not favour the first names of the list. From that hand onwards, the turn to deal moves one seat per round in the seating order.' },

      { h2: 'Saved names' },
      { p: 'The names of the players are kept in the browser of this device, together with the last line-up and the game in progress. They come back as suggestions and as quick buttons the next time the page is opened, and an unfinished game is restored as it was left. The <em>delete saved names</em> button clears the list.' },

      { h2: 'Google Sheets connection' },
      { p: 'The scoreboard sends the finished game to a spreadsheet through an Apps Script web app, which is the bridge between a static page and Google Sheets. The setup is done once.' },
      { ol: [
        'Create a spreadsheet in Google Sheets with two tabs, <code>Partidas</code> and <code>Clasificación</code>.',
        'Open <strong>Extensions → Apps Script</strong> and paste the code below.',
        'Press <strong>Deploy → New deployment</strong>, choose the <strong>Web app</strong> type, run the app as your own account and give access to <strong>Anyone</strong>.',
        'Copy the URL that ends in <code>/exec</code> and paste it into <strong>Google Sheets connection</strong>, inside the scoreboard.'
      ] },
      { code: 'apps-script' },
      { p: 'The <code>Partidas</code> tab keeps one row per player and game, and the <code>Clasificación</code> tab is recomputed on every upload with the games played, the wins and the points accumulated per name. The browser sends the data without reading the answer, so it is worth checking in the spreadsheet that the game has arrived. In the meantime, the <em>download CSV</em> button keeps the full scoreboard on the device.' }
    ]
  },

  snippets: {
    'apps-script': [
      "function doPost(e) {",
      "  var data = JSON.parse(e.postData.contents);",
      "  var book = SpreadsheetApp.getActiveSpreadsheet();",
      "  var games = book.getSheetByName('Partidas');",
      "  var board = book.getSheetByName('Clasificación');",
      "",
      "  if (games.getLastRow() === 0) {",
      "    games.appendRow(['Fecha', 'Jugadores', 'Rondas', 'Puesto', 'Nombre', 'Puntos', 'Gana']);",
      "  }",
      "  var date = new Date(data.finishedAt);",
      "  data.standings.forEach(function (row) {",
      "    games.appendRow([date, data.players.length, data.roundsPlayed,",
      "                     row.position, row.name, row.total, row.won ? 1 : 0]);",
      "  });",
      "",
      "  board.clear();",
      "  board.appendRow(['Nombre', 'Partidas', 'Victorias', 'Puntos totales']);",
      "  var tally = {};",
      "  var played = games.getRange(2, 5, Math.max(games.getLastRow() - 1, 1), 3).getValues();",
      "  played.forEach(function (row) {",
      "    var name = row[0];",
      "    if (!name) return;",
      "    if (!tally[name]) tally[name] = { games: 0, wins: 0, points: 0 };",
      "    tally[name].games += 1;",
      "    tally[name].wins += Number(row[2]) || 0;",
      "    tally[name].points += Number(row[1]) || 0;",
      "  });",
      "  Object.keys(tally)",
      "    .sort(function (a, b) { return tally[b].wins - tally[a].wins; })",
      "    .forEach(function (name) {",
      "      board.appendRow([name, tally[name].games, tally[name].wins, tally[name].points]);",
      "    });",
      "",
      "  return ContentService.createTextOutput('ok');",
      "}"
    ].join('\n')
  }
};
