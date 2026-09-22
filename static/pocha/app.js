/* Pocha — marcador. Estado, reglas de puntuación e interfaz. */
(function () {
  'use strict';

  var DECK = 40;
  var LS = {
    roster: 'pocha:roster',
    lineup: 'pocha:lineup',
    game: 'pocha:game',
    sheet: 'pocha:sheetUrl'
  };

  /* ---------- almacenamiento local ---------- */

  function load(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }

  function save(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado */ }
  }

  function drop(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* modo privado */ }
  }

  function rememberNames(names) {
    var roster = load(LS.roster, []);
    names.forEach(function (n) {
      if (n && roster.indexOf(n) === -1) roster.push(n);
    });
    save(LS.roster, roster.slice(-40));
  }

  /* ---------- reglas del juego ---------- */

  function buildRounds(numPlayers, repeatMiddle) {
    var maxCards = Math.floor(DECK / numPlayers);
    var rounds = [];
    var i;
    for (i = 1; i <= maxCards; i++) rounds.push(i);
    var repeats = repeatMiddle ? (numPlayers - 1) * numPlayers : numPlayers - 1;
    for (i = 0; i < repeats; i++) rounds.push(maxCards);
    for (i = maxCards - 1; i >= 1; i--) rounds.push(i);
    return rounds;
  }

  function points(bid, won) {
    return bid === won ? 10 + 5 * bid : -5 * Math.abs(bid - won);
  }

  function dealerOf(game, roundIdx) {
    return (game.firstDealer + roundIdx) % game.players.length;
  }

  function totalsAfter(game, roundCount) {
    var totals = game.players.map(function () { return 0; });
    for (var r = 0; r < roundCount && r < game.results.length; r++) {
      var res = game.results[r];
      for (var p = 0; p < game.players.length; p++) {
        totals[p] += points(res.bids[p], res.won[p]);
      }
    }
    return totals;
  }

  function ranking(game) {
    var totals = totalsAfter(game, game.results.length);
    return game.players
      .map(function (name, i) { return { name: name, index: i, total: totals[i] }; })
      .sort(function (a, b) { return b.total - a.total; });
  }

  /* ---------- utilidades ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ---------- estado de la aplicación ---------- */

  var root = document.getElementById('pocha-app');
  if (!root) return;

  var game = load(LS.game, null);
  var draft = null; // { bids: [], won: [] } de la ronda en curso

  function newDraft() {
    return {
      bids: game.players.map(function () { return null; }),
      won: game.players.map(function () { return null; })
    };
  }

  function persist() { save(LS.game, game); }

  /* ---------- pantalla de configuración ---------- */

  function renderSetup() {
    clear(root);
    var lineup = load(LS.lineup, { players: ['', '', '', ''], firstDealer: 0, repeatMiddle: false });
    var names = lineup.players.slice();
    if (names.length < 3) while (names.length < 4) names.push('');

    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', 'Nueva partida'));

    var topRow = el('div', 'row');

    var countField = el('div', 'field');
    countField.appendChild(el('label', null, 'Jugadores'));
    var countInput = el('input');
    countInput.type = 'number';
    countInput.min = '3';
    countInput.max = '10';
    countInput.value = String(names.length);
    countField.appendChild(countInput);
    topRow.appendChild(countField);

    var dealerField = el('div', 'field');
    dealerField.appendChild(el('label', null, 'Reparte primero'));
    var dealerSelect = el('select');
    dealerField.appendChild(dealerSelect);
    topRow.appendChild(dealerField);

    var switchLabel = el('label', 'switch');
    var repeatInput = el('input');
    repeatInput.type = 'checkbox';
    repeatInput.checked = !!lineup.repeatMiddle;
    switchLabel.appendChild(repeatInput);
    switchLabel.appendChild(el('span', null, 'Repetir rondas largas'));
    topRow.appendChild(switchLabel);

    card.appendChild(topRow);

    var seatHint = el('p', 'hint seat-hint',
      'Escribe los nombres en el orden de la mesa, empezando por quien quieras y siguiendo hacia la derecha, en el sentido contrario a las agujas del reloj. Las rondas se anotan en ese mismo orden.');
    seatHint.style.marginTop = '1rem';
    card.appendChild(seatHint);

    var playersBox = el('div', 'players');
    playersBox.style.marginTop = '0.6rem';
    card.appendChild(playersBox);

    var datalist = el('datalist');
    datalist.id = 'pocha-roster';
    load(LS.roster, []).forEach(function (n) {
      var opt = el('option');
      opt.value = n;
      datalist.appendChild(opt);
    });
    card.appendChild(datalist);

    var roster = load(LS.roster, []);
    if (roster.length) {
      card.appendChild(el('p', 'hint', 'Nombres guardados en este dispositivo. Pulsa uno para añadirlo al primer hueco libre.'));
      var rosterBox = el('div', 'roster');
      roster.forEach(function (n) {
        var b = el('button', null, n);
        b.type = 'button';
        b.addEventListener('click', function () {
          var slots = playersBox.querySelectorAll('input');
          for (var i = 0; i < slots.length; i++) {
            if (!slots[i].value.trim()) { slots[i].value = n; syncDealer(); return; }
          }
        });
        rosterBox.appendChild(b);
      });
      card.appendChild(rosterBox);
    }

    var seatOrder = el('p', 'seat-order');
    card.appendChild(seatOrder);

    var preview = el('p', 'hint');
    card.appendChild(preview);

    var actions = el('div', 'actions');
    var startBtn = el('button', 'primary', 'Empezar partida');
    startBtn.type = 'button';
    actions.appendChild(startBtn);
    var forgetBtn = el('button', 'ghost', 'Borrar nombres guardados');
    forgetBtn.type = 'button';
    forgetBtn.addEventListener('click', function () {
      if (window.confirm('¿Borrar los nombres guardados en este dispositivo?')) {
        drop(LS.roster);
        renderSetup();
      }
    });
    actions.appendChild(forgetBtn);
    card.appendChild(actions);

    root.appendChild(card);

    function currentNames() {
      var out = [];
      playersBox.querySelectorAll('input').forEach(function (input, i) {
        out.push(input.value.trim() || 'Jugador ' + (i + 1));
      });
      return out;
    }

    function syncDealer() {
      var chosen = dealerSelect.value;
      clear(dealerSelect);
      currentNames().forEach(function (n, i) {
        var opt = el('option', null, n);
        opt.value = String(i);
        dealerSelect.appendChild(opt);
      });
      dealerSelect.value = chosen !== '' && Number(chosen) < currentNames().length ? chosen : '0';
      syncPreview();
    }

    function syncPreview() {
      var names = currentNames();
      var n = names.length;
      clear(seatOrder);
      seatOrder.appendChild(el('span', 'seat-label', 'Orden de la mesa'));
      names.forEach(function (name, i) {
        if (i > 0) seatOrder.appendChild(el('span', 'seat-arrow', '\u2192'));
        seatOrder.appendChild(el('span', 'seat-name', name));
      });
      seatOrder.appendChild(el('span', 'seat-arrow', '\u21A9'));

      var rounds = buildRounds(n, repeatInput.checked);
      var maxCards = Math.floor(DECK / n);
      preview.textContent = n + ' jugadores, ' + maxCards + ' cartas como máximo por mano y ' +
        rounds.length + ' ' + plural(rounds.length, 'ronda', 'rondas') + ' en total.';
    }

    function syncSlots() {
      var n = Math.max(3, Math.min(10, parseInt(countInput.value, 10) || 4));
      countInput.value = String(n);
      var existing = [];
      playersBox.querySelectorAll('input').forEach(function (i) { existing.push(i.value); });
      clear(playersBox);
      for (var i = 0; i < n; i++) {
        var slot = el('div', 'player-slot');
        slot.appendChild(el('span', 'idx', String(i + 1)));
        var input = el('input');
        input.type = 'text';
        input.setAttribute('list', 'pocha-roster');
        input.placeholder = 'Jugador ' + (i + 1);
        input.value = existing[i] !== undefined ? existing[i] : (names[i] || '');
        input.autocomplete = 'off';
        input.addEventListener('input', syncDealer);
        slot.appendChild(input);
        playersBox.appendChild(slot);
      }
      syncDealer();
    }

    countInput.addEventListener('change', syncSlots);
    repeatInput.addEventListener('change', syncPreview);
    syncSlots();
    dealerSelect.value = String(Math.min(lineup.firstDealer || 0, names.length - 1));

    startBtn.addEventListener('click', function () {
      var players = currentNames();
      var firstDealer = parseInt(dealerSelect.value, 10) || 0;
      rememberNames(players);
      save(LS.lineup, { players: players, firstDealer: firstDealer, repeatMiddle: repeatInput.checked });
      game = {
        players: players,
        firstDealer: firstDealer,
        repeatMiddle: repeatInput.checked,
        rounds: buildRounds(players.length, repeatInput.checked),
        results: [],
        startedAt: new Date().toISOString()
      };
      draft = newDraft();
      persist();
      renderGame();
    });
  }

  /* ---------- pantalla de partida ---------- */

  function renderGame() {
    clear(root);
    var roundIdx = game.results.length;
    var finished = roundIdx >= game.rounds.length;
    if (!draft) draft = newDraft();

    if (finished) root.appendChild(winnerCard());
    else root.appendChild(roundCard(roundIdx));

    root.appendChild(standingsCard());
    root.appendChild(historyCard());
    root.appendChild(exportCard(finished));
  }

  function roundCard(roundIdx) {
    var cards = game.rounds[roundIdx];
    var dealer = dealerOf(game, roundIdx);
    var card = el('section', 'card');

    var head = el('div', 'round-head');
    head.appendChild(el('span', 'big', 'Ronda ' + (roundIdx + 1) + ' de ' + game.rounds.length));
    head.appendChild(el('span', 'meta', cards + ' ' + plural(cards, 'carta', 'cartas') + ' por jugador'));
    head.appendChild(el('span', 'chip dealer', 'Reparte ' + game.players[dealer]));
    head.appendChild(el('span', 'meta', 'Filas en orden de juego, desde la derecha del repartidor'));
    card.appendChild(head);

    var header = el('div', 'bids-head');
    header.appendChild(el('span', null, 'Jugador'));
    header.appendChild(el('span', null, 'Apuesta'));
    header.appendChild(el('span', null, 'Bazas'));
    card.appendChild(header);

    var box = el('div', 'bids');
    var order = [];
    for (var k = 1; k <= game.players.length; k++) order.push((dealer + k) % game.players.length);

    order.forEach(function (p) {
      var row = el('div', 'bid-row' + (p === dealer ? ' is-dealer' : ''));
      var who = el('div', 'who', game.players[p]);
      if (p === dealer) who.appendChild(el('small', null, 'reparte, no puede casar'));
      row.appendChild(who);
      row.appendChild(numberInput(cards, draft.bids, p));
      row.appendChild(numberInput(cards, draft.won, p));
      box.appendChild(row);
    });
    card.appendChild(box);

    var tally = el('p', 'tally');
    card.appendChild(tally);

    var actions = el('div', 'actions');
    var confirmBtn = el('button', 'primary', 'Guardar ronda');
    confirmBtn.type = 'button';
    actions.appendChild(confirmBtn);
    if (game.results.length > 0) {
      var undoBtn = el('button', 'ghost', 'Deshacer ronda anterior');
      undoBtn.type = 'button';
      undoBtn.addEventListener('click', function () {
        var last = game.results.pop();
        persist();
        draft = { bids: last.bids.slice(), won: last.won.slice() };
        renderGame();
      });
      actions.appendChild(undoBtn);
    }
    card.appendChild(actions);

    function sum(list) {
      return list.reduce(function (a, b) { return a + (b || 0); }, 0);
    }

    function refresh() {
      var bidsDone = draft.bids.every(function (v) { return v !== null; });
      var wonDone = draft.won.every(function (v) { return v !== null; });
      var bidSum = sum(draft.bids);
      var wonSum = sum(draft.won);
      var messages = [];
      var tone = 'tally';

      if (bidsDone) {
        messages.push('Apuestas: ' + bidSum + ' de ' + cards);
        if (bidSum === cards) {
          messages.push('la suma cuadra, el repartidor debe descuadrarla');
          tone = 'tally warn';
        }
      } else {
        messages.push('Faltan apuestas por anotar');
      }

      if (wonDone) {
        messages.push('bazas: ' + wonSum + ' de ' + cards);
        if (wonSum !== cards) {
          messages.push('las bazas deben sumar ' + cards);
          tone = 'tally bad';
        } else if (tone === 'tally') {
          tone = 'tally ok';
        }
      }

      tally.className = tone;
      tally.textContent = messages.join(' · ') + '.';
      confirmBtn.disabled = !(bidsDone && wonDone && wonSum === cards);
    }

    box.addEventListener('input', refresh);
    refresh();

    confirmBtn.addEventListener('click', function () {
      game.results.push({
        cards: cards,
        dealer: dealer,
        bids: draft.bids.slice(),
        won: draft.won.slice()
      });
      draft = newDraft();
      persist();
      renderGame();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return card;
  }

  function numberInput(max, store, index) {
    var input = el('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(max);
    input.inputMode = 'numeric';
    input.value = store[index] === null ? '' : String(store[index]);
    input.addEventListener('input', function () {
      if (input.value === '') { store[index] = null; return; }
      var v = parseInt(input.value, 10);
      if (isNaN(v)) { store[index] = null; return; }
      v = Math.max(0, Math.min(max, v));
      input.value = String(v);
      store[index] = v;
    });
    return input;
  }

  function standingsCard() {
    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', 'Clasificación'));
    var box = el('div', 'standings');
    var order = ranking(game);
    order.forEach(function (entry, i) {
      var item = el('div', 'standing' + (i === 0 && entry.total !== 0 ? ' lead' : ''));
      var left = el('div');
      left.appendChild(el('span', 'pos', (i + 1) + '.'));
      left.appendChild(el('span', 'nm', entry.name));
      item.appendChild(left);
      item.appendChild(el('span', 'pts', String(entry.total)));
      box.appendChild(item);
    });
    card.appendChild(box);
    return card;
  }

  function historyCard() {
    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', 'Rondas jugadas'));

    if (!game.results.length) {
      card.appendChild(el('p', 'hint', 'Todavía no hay rondas anotadas.'));
      return card;
    }

    var wrap = el('div', 'table-wrap');
    var table = el('table');
    var thead = el('thead');
    var r1 = el('tr');
    var th = el('th', null, '#');
    th.rowSpan = 2;
    r1.appendChild(th);
    game.players.forEach(function (name) {
      var cell = el('th', 'group', name);
      cell.colSpan = 4;
      r1.appendChild(cell);
    });
    thead.appendChild(r1);
    var r2 = el('tr');
    game.players.forEach(function () {
      ['A', 'B', 'Pts', 'Tot'].forEach(function (label, i) {
        r2.appendChild(el('th', i === 0 ? 'group' : null, label));
      });
    });
    thead.appendChild(r2);
    table.appendChild(thead);

    var tbody = el('tbody');
    var running = game.players.map(function () { return 0; });
    game.results.forEach(function (res, r) {
      var tr = el('tr');
      tr.appendChild(el('td', 'cards dealer-col', String(res.cards)));
      game.players.forEach(function (name, p) {
        var pts = points(res.bids[p], res.won[p]);
        running[p] += pts;
        tr.appendChild(el('td', 'group', String(res.bids[p])));
        tr.appendChild(el('td', null, String(res.won[p])));
        tr.appendChild(el('td', pts >= 0 ? 'hit' : 'miss', (pts > 0 ? '+' : '') + pts));
        tr.appendChild(el('td', 'total', String(running[p])));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);
    card.appendChild(el('p', 'hint', 'A: apuesta · B: bazas ganadas · Pts: puntos de la ronda · Tot: acumulado. El punto junto al número de cartas marca la mano que reparte.'));
    return card;
  }

  function winnerCard() {
    var card = el('section', 'card winner');
    var order = ranking(game);
    card.appendChild(el('div', 'trophy', '🏆'));
    card.appendChild(el('div', 'nm', order[0].name));
    card.appendChild(el('p', 'hint', 'Gana la partida con ' + order[0].total + ' puntos.'));
    return card;
  }

  /* ---------- exportación y hoja de cálculo ---------- */

  function gamePayload() {
    var order = ranking(game);
    return {
      startedAt: game.startedAt,
      finishedAt: new Date().toISOString(),
      players: game.players,
      rounds: game.rounds.length,
      roundsPlayed: game.results.length,
      repeatMiddle: game.repeatMiddle,
      totals: totalsAfter(game, game.results.length),
      standings: order.map(function (e, i) {
        return { position: i + 1, name: e.name, total: e.total, won: i === 0 };
      }),
      results: game.results
    };
  }

  function toCsv() {
    var lines = [];
    lines.push(['Ronda', 'Cartas', 'Reparte'].concat(game.players.map(function (n) {
      return [n + ' apuesta', n + ' bazas', n + ' puntos', n + ' total'];
    }).reduce(function (a, b) { return a.concat(b); }, [])).join(','));
    var running = game.players.map(function () { return 0; });
    game.results.forEach(function (res, r) {
      var row = [r + 1, res.cards, game.players[res.dealer]];
      game.players.forEach(function (n, p) {
        var pts = points(res.bids[p], res.won[p]);
        running[p] += pts;
        row.push(res.bids[p], res.won[p], pts, running[p]);
      });
      lines.push(row.join(','));
    });
    lines.push(['Total', '', ''].concat(game.players.map(function (n, p) {
      return ['', '', '', running[p]];
    }).reduce(function (a, b) { return a.concat(b); }, [])).join(','));
    return lines.join('\n');
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type });
    var url = URL.createObjectURL(blob);
    var a = el('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function stamp() {
    return new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  }

  function exportCard(finished) {
    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', 'Guardar y compartir'));

    var status = el('div', 'banner');
    status.style.display = 'none';
    card.appendChild(status);

    function report(text, tone) {
      status.className = 'banner' + (tone ? ' ' + tone : '');
      status.textContent = text;
      status.style.display = 'block';
    }

    var actions = el('div', 'actions');

    var csvBtn = el('button', null, 'Descargar CSV');
    csvBtn.type = 'button';
    csvBtn.disabled = !game.results.length;
    csvBtn.addEventListener('click', function () {
      download('pocha-' + stamp() + '.csv', toCsv(), 'text/csv;charset=utf-8');
    });
    actions.appendChild(csvBtn);

    var sheetBtn = el('button', finished ? 'primary' : '', 'Enviar a Google Sheets');
    sheetBtn.type = 'button';
    sheetBtn.disabled = !game.results.length;
    actions.appendChild(sheetBtn);

    var newBtn = el('button', 'ghost', 'Partida nueva');
    newBtn.type = 'button';
    newBtn.addEventListener('click', function () {
      if (game.results.length && !finished &&
          !window.confirm('La partida está a medias. ¿Empezar otra?')) return;
      drop(LS.game);
      game = null;
      draft = null;
      renderSetup();
    });
    actions.appendChild(newBtn);

    card.appendChild(actions);

    var details = el('details', 'sync');
    details.appendChild(el('summary', null, 'Conexión con Google Sheets'));
    var field = el('div', 'field');
    field.style.marginTop = '0.6rem';
    field.appendChild(el('label', null, 'URL de la aplicación web de Apps Script'));
    var urlInput = el('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'https://script.google.com/macros/s/.../exec';
    urlInput.value = load(LS.sheet, '') || '';
    urlInput.addEventListener('change', function () { save(LS.sheet, urlInput.value.trim()); });
    field.appendChild(urlInput);
    details.appendChild(field);
    details.appendChild(el('p', 'hint', 'La URL se guarda en este dispositivo. Las instrucciones para crear la hoja están más abajo.'));
    card.appendChild(details);

    sheetBtn.addEventListener('click', function () {
      var url = (load(LS.sheet, '') || '').trim();
      if (!url) {
        details.open = true;
        urlInput.focus();
        report('Añade primero la URL de la aplicación web de Apps Script.', 'bad');
        return;
      }
      sheetBtn.disabled = true;
      report('Enviando la partida…');
      window.fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(gamePayload())
      }).then(function () {
        report('Partida enviada a la hoja de cálculo. Compruébala para confirmar que la fila aparece.', 'ok');
      }).catch(function () {
        report('No se ha podido enviar la partida. Revisa la URL y la conexión; el CSV sigue disponible.', 'bad');
      }).then(function () {
        sheetBtn.disabled = false;
      });
    });

    return card;
  }

  /* ---------- arranque ---------- */

  if (game && game.players && game.rounds) renderGame();
  else renderSetup();
})();
