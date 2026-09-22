---
title: "Pocha"
description: "Marcador para el juego de la pocha con la baraja española."
showToc: true
disableAnchoredHeadings: true
hideAuthor: true
---

<link rel="stylesheet" href="/pocha/app.css">

<div class="pocha" id="pocha-app">
  <noscript>Esta página necesita JavaScript para llevar el marcador.</noscript>
</div>

<script src="/pocha/app.js" defer></script>

## Cómo se juega

La pocha se juega con la baraja española de 40 cartas, del 1 al 7 más sota, caballo y rey. En cada ronda se reparte el mismo número de cartas a cada jugador, cada uno apuesta cuántas bazas cree que va a ganar y después se juega la mano. El número máximo de cartas por mano es 40 dividido entre el número de jugadores, redondeado hacia abajo.

Las rondas suben de una carta hasta el máximo, se repite la mano larga tantas veces como jugadores menos uno, y después bajan de nuevo hasta una carta. La opción **repetir rondas largas** multiplica esas manos largas por el número de jugadores, de forma que cada jugador reparte una mano larga en cada vuelta.

Quien reparte apuesta el último y no puede casar la suma: el total de las apuestas no puede coincidir con el número de cartas de la mano, así que al menos un jugador falla. El marcador avisa cuando la suma cuadra, y no deja cerrar la ronda hasta que las bazas anotadas suman exactamente el número de cartas repartidas.

## Puntuación

| Resultado | Puntos |
| --- | --- |
| Acierta la apuesta | 10 + 5 × apuesta |
| Falla la apuesta | −5 × diferencia entre apuesta y bazas |

Acertar una apuesta de cero vale 10 puntos, y acertar una apuesta de tres vale 25. Gana la partida quien acumula más puntos después de la última ronda.

## Orden de la mesa

Los nombres se escriben en el orden en el que se sientan los jugadores, empezando por cualquiera de ellos y siguiendo hacia la derecha, es decir, en el sentido contrario a las agujas del reloj. La pantalla de configuración muestra ese orden mientras se escriben los nombres, y el marcador lo reutiliza en cada ronda: las filas aparecen en el orden de juego, desde la derecha del repartidor hasta el repartidor, que apuesta el último. Anotar en ese orden evita buscar a cada jugador en la lista.

## Sorteo del repartidor

El botón con el dado, junto a **reparte primero**, elige al azar quién reparte la primera mano. El sorteo recorre los nombres y se detiene en el elegido. Cada jugador tiene la misma probabilidad de salir: el número se toma del generador criptográfico del navegador y se descartan los valores que caen fuera del último bloque completo, de forma que el resto no favorece a los primeros nombres de la lista. A partir de esa mano, el turno de repartir avanza una posición por ronda en el orden de la mesa.

## Nombres guardados

Los nombres de los jugadores se guardan en el navegador de este dispositivo, junto con la última alineación y la partida en curso. Al volver a abrir la página aparecen como sugerencias y como botones de acceso rápido, y una partida a medias se recupera tal y como se dejó. El botón **borrar nombres guardados** elimina la lista.

## Conexión con Google Sheets

El marcador envía la partida terminada a una hoja de cálculo a través de una aplicación web de Apps Script, que es el puente entre una página estática y Google Sheets. La configuración se hace una sola vez.

1. Crea una hoja de cálculo en Google Sheets con dos pestañas, `Partidas` y `Clasificación`.
2. Abre **Extensiones → Apps Script** y pega el código siguiente.
3. Pulsa **Implementar → Nueva implementación**, elige el tipo **Aplicación web**, ejecuta la aplicación como tu cuenta y da acceso a **Cualquier usuario**.
4. Copia la URL que termina en `/exec` y pégala en **Conexión con Google Sheets**, dentro del marcador.

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var games = book.getSheetByName('Partidas');
  var board = book.getSheetByName('Clasificación');

  if (games.getLastRow() === 0) {
    games.appendRow(['Fecha', 'Jugadores', 'Rondas', 'Puesto', 'Nombre', 'Puntos', 'Gana']);
  }
  var date = new Date(data.finishedAt);
  data.standings.forEach(function (row) {
    games.appendRow([date, data.players.length, data.roundsPlayed,
                     row.position, row.name, row.total, row.won ? 1 : 0]);
  });

  board.clear();
  board.appendRow(['Nombre', 'Partidas', 'Victorias', 'Puntos totales']);
  var tally = {};
  var played = games.getRange(2, 5, Math.max(games.getLastRow() - 1, 1), 3).getValues();
  played.forEach(function (row) {
    var name = row[0];
    if (!name) return;
    if (!tally[name]) tally[name] = { games: 0, wins: 0, points: 0 };
    tally[name].games += 1;
    tally[name].wins += Number(row[2]) || 0;
    tally[name].points += Number(row[1]) || 0;
  });
  Object.keys(tally)
    .sort(function (a, b) { return tally[b].wins - tally[a].wins; })
    .forEach(function (name) {
      board.appendRow([name, tally[name].games, tally[name].wins, tally[name].points]);
    });

  return ContentService.createTextOutput('ok');
}
```

La pestaña `Partidas` guarda una fila por jugador y partida, y la pestaña `Clasificación` se recalcula en cada envío con las partidas jugadas, las victorias y los puntos acumulados por nombre. El navegador envía los datos sin leer la respuesta, por lo que conviene comprobar en la hoja que la partida ha llegado. Mientras tanto, el botón **descargar CSV** guarda el marcador completo en el dispositivo.
