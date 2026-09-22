/* Pocha — marcador bilingüe. Estado, reglas de puntuación e interfaz. */
/* Pocha — bilingual scoreboard. State, scoring rules and interface. */
(function () {
  'use strict';

  var DECK = 40;
  var LS = {
    roster: 'pocha:roster',
    lineup: 'pocha:lineup',
    game: 'pocha:game',
    sheet: 'pocha:sheetUrl',
    lang: 'pocha:lang'
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

  /* ---------- idioma / language ---------- */

  var DICT = window.POCHA_I18N;

  function preferredLang() {
    var stored = load(LS.lang, null);
    return stored === 'en' ? 'en' : 'es';
  }

  var lang = preferredLang();

  function t(key) {
    var value = DICT[lang][key];
    if (typeof value !== 'function') return value;
    return value.apply(null, Array.prototype.slice.call(arguments, 1));
  }

  var HASHES = { docs: '#reglas', table: '#tabla' };

  function viewOf(hash) {
    for (var name in HASHES) {
      if (HASHES[name] === hash) return name;
    }
    return 'game';
  }

  function hrefOf(name) {
    return HASHES[name] || window.location.pathname;
  }

  var view = viewOf(window.location.hash);

  function setView(next) {
    if (next === view) return;
    rememberSetup();
    view = next;
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', hrefOf(next));
    } else {
      window.location.hash = HASHES[next] || '';
    }
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.addEventListener('hashchange', function () {
    var next = viewOf(window.location.hash);
    if (next === view) return;
    rememberSetup();
    view = next;
    render();
  });

  var captureSetup = null; // devuelto por la pantalla de configuración / set by the setup screen

  // guarda lo escrito antes de rehacer la página / keeps what is typed before the page is rebuilt
  function rememberSetup() {
    if (captureSetup) save(LS.lineup, captureSetup());
  }

  function setLang(next) {
    if (next === lang) return;
    rememberSetup();
    lang = next;
    save(LS.lang, lang);
    document.documentElement.lang = lang;
    render();
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
    var played = game.results.length;
    var totals = totalsAfter(game, played);
    var last = played ? game.results[played - 1] : null;
    return game.players
      .map(function (name, i) {
        var hits = 0;
        game.results.forEach(function (res) { if (res.bids[i] === res.won[i]) hits += 1; });
        return {
          name: name,
          index: i,
          total: totals[i],
          hits: hits,
          played: played,
          last: last ? points(last.bids[i], last.won[i]) : null
        };
      })
      .sort(function (a, b) { return b.total - a.total || b.hits - a.hits; });
  }

  /* ---------- utilidades ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

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
    var lineup = load(LS.lineup, { players: ['', '', '', ''], firstDealer: 0, repeatMiddle: false });
    var names = (lineup.players || []).slice();
    while (names.length < 3) names.push('');

    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', t('newGame')));

    var topRow = el('div', 'row');

    var countField = el('div', 'field');
    countField.appendChild(el('label', null, t('playersLabel')));
    var countInput = el('input');
    countInput.type = 'number';
    countInput.min = '3';
    countInput.max = '10';
    countInput.value = String(names.length);
    countField.appendChild(countInput);
    topRow.appendChild(countField);

    var dealerField = el('div', 'field');
    dealerField.appendChild(el('label', null, t('dealsFirst')));
    var dealerPick = el('div', 'dealer-pick');
    var dealerSelect = el('select');
    dealerPick.appendChild(dealerSelect);
    var diceBtn = el('button', 'dice', '\uD83C\uDFB2');
    diceBtn.type = 'button';
    diceBtn.title = t('drawDealer');
    diceBtn.setAttribute('aria-label', t('drawDealer'));
    dealerPick.appendChild(diceBtn);
    dealerField.appendChild(dealerPick);
    topRow.appendChild(dealerField);

    var switchLabel = el('label', 'switch');
    var repeatInput = el('input');
    repeatInput.type = 'checkbox';
    repeatInput.checked = !!lineup.repeatMiddle;
    switchLabel.appendChild(repeatInput);
    switchLabel.appendChild(el('span', null, t('repeatLong')));
    topRow.appendChild(switchLabel);

    card.appendChild(topRow);

    var seatHint = el('p', 'hint seat-hint', t('seatHint'));
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
      card.appendChild(el('p', 'hint', t('rosterHint')));
      var rosterBox = el('div', 'roster');
      roster.forEach(function (n) {
        var b = el('button', null, n);
        b.type = 'button';
        b.addEventListener('click', function () {
          var slots = playersBox.querySelectorAll('input');
          for (var i = 0; i < slots.length; i++) {
            if (!slots[i].value.trim()) {
              slots[i].value = n;
              typed[i] = n;
              syncDealer();
              return;
            }
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
    var startBtn = el('button', 'primary', t('start'));
    startBtn.type = 'button';
    actions.appendChild(startBtn);
    var forgetBtn = el('button', 'ghost', t('forget'));
    forgetBtn.type = 'button';
    forgetBtn.addEventListener('click', function () {
      if (window.confirm(t('confirmForget'))) {
        drop(LS.roster);
        render();
      }
    });
    actions.appendChild(forgetBtn);
    card.appendChild(actions);

    root.appendChild(card);

    captureSetup = function () {
      return {
        players: currentNamesRaw(),
        firstDealer: parseInt(dealerSelect.value, 10) || 0,
        repeatMiddle: repeatInput.checked
      };
    };

    // los nombres viven aquí, no en el DOM, para que no se pierdan al rehacer los huecos
    // the names live here, not in the DOM, so that rebuilding the seats does not lose them
    var typed = names.slice();

    function currentNamesRaw() {
      return typed.slice(0, seatCount()).map(function (name) { return (name || '').trim(); });
    }

    function seatCount() {
      var n = parseInt(countInput.value, 10);
      if (isNaN(n)) return typed.length;
      return Math.max(3, Math.min(10, n));
    }

    function currentNames() {
      var out = [];
      var seats = seatCount();
      for (var i = 0; i < seats; i++) {
        out.push((typed[i] || '').trim() || t('playerN', i + 1));
      }
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
      seatOrder.appendChild(el('span', 'seat-label', t('seatLabel')));
      names.forEach(function (name, i) {
        if (i > 0) seatOrder.appendChild(el('span', 'seat-arrow', '\u2192'));
        seatOrder.appendChild(el('span', 'seat-name', name));
      });
      seatOrder.appendChild(el('span', 'seat-arrow', '\u21A9'));

      var rounds = buildRounds(n, repeatInput.checked);
      var maxCards = Math.floor(DECK / n);
      preview.textContent = t('preview', n, maxCards, rounds.length);
    }

    function syncSlots() {
      var n = seatCount();
      while (typed.length < n) typed.push('');
      if (playersBox.children.length === n) { syncDealer(); return; }
      clear(playersBox);
      for (var i = 0; i < n; i++) {
        playersBox.appendChild(seatSlot(i));
      }
      syncDealer();
    }

    function seatSlot(i) {
      var slot = el('div', 'player-slot');
      slot.appendChild(el('span', 'idx', String(i + 1)));
      var input = el('input');
      input.type = 'text';
      input.setAttribute('list', 'pocha-roster');
      input.placeholder = t('playerN', i + 1);
      input.value = typed[i] || '';
      input.autocomplete = 'off';
      input.addEventListener('input', function () {
        typed[i] = input.value;
        syncDealer();
      });
      slot.appendChild(input);
      return slot;
    }

    function randomIndex(n) {
      var crypto = window.crypto || window.msCrypto;
      if (crypto && crypto.getRandomValues) {
        var limit = Math.floor(4294967296 / n) * n;
        var buf = new Uint32Array(1);
        do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
        return buf[0] % n;
      }
      return Math.floor(Math.random() * n);
    }

    function drawDealer() {
      var n = currentNames().length;
      var winner = randomIndex(n);
      var rolls = n * 2 + winner;
      var step = 0;
      diceBtn.disabled = true;
      diceBtn.classList.add('rolling');
      (function tick() {
        dealerSelect.value = String(step % n);
        step += 1;
        if (step <= rolls) {
          window.setTimeout(tick, 60 + 12 * step);
        } else {
          dealerSelect.value = String(winner);
          diceBtn.disabled = false;
          diceBtn.classList.remove('rolling');
          dealerField.classList.add('drawn');
          window.setTimeout(function () { dealerField.classList.remove('drawn'); }, 900);
        }
      })();
    }

    diceBtn.addEventListener('click', drawDealer);

    countInput.addEventListener('input', syncSlots);
    countInput.addEventListener('change', function () {
      countInput.value = String(seatCount());
      syncSlots();
    });
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
      render();
    });
  }

  /* ---------- pantalla de partida ---------- */

  function renderGame() {
    captureSetup = null;
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
    head.appendChild(el('span', 'big', t('roundOf', roundIdx + 1, game.rounds.length)));
    head.appendChild(el('span', 'meta', t('cardsEach', cards)));
    head.appendChild(el('span', 'chip dealer', t('dealsChip', game.players[dealer])));
    head.appendChild(el('span', 'meta', t('rowOrder')));
    card.appendChild(head);

    var header = el('div', 'bids-head');
    header.appendChild(el('span', null, t('colPlayer')));
    header.appendChild(el('span', null, t('colBid')));
    header.appendChild(el('span', null, t('colTricks')));
    card.appendChild(header);

    var box = el('div', 'bids');
    var order = [];
    for (var k = 1; k <= game.players.length; k++) order.push((dealer + k) % game.players.length);

    order.forEach(function (p) {
      var row = el('div', 'bid-row' + (p === dealer ? ' is-dealer' : ''));
      row.appendChild(el('div', 'who', game.players[p]));
      row.appendChild(numberInput(cards, draft.bids, p));
      row.appendChild(numberInput(cards, draft.won, p));
      box.appendChild(row);
    });
    card.appendChild(box);

    var tally = el('p', 'tally');
    card.appendChild(tally);

    var alert = el('div', 'round-alert');
    alert.style.display = 'none';
    card.appendChild(alert);

    var actions = el('div', 'actions');
    var confirmBtn = el('button', 'primary', t('saveRound'));
    confirmBtn.type = 'button';
    actions.appendChild(confirmBtn);
    if (game.results.length > 0) {
      var undoBtn = el('button', 'ghost', t('undoRound'));
      undoBtn.type = 'button';
      undoBtn.addEventListener('click', function () {
        var last = game.results.pop();
        persist();
        draft = { bids: last.bids.slice(), won: last.won.slice() };
        render();
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
      var counts = [];

      counts.push(bidsDone ? t('bidsSum', bidSum, cards) : t('bidsMissing'));
      if (wonDone) counts.push(t('tricksSum', wonSum, cards));
      tally.textContent = counts.join(' · ') + '.';

      // las apuestas sólo casan cuando está anotada la última / the bids can only match once the last one is in
      var bidsTie = bidsDone && bidSum === cards;
      var tricksOff = wonDone && wonSum !== cards;
      clear(alert);
      if (bidsTie) alert.appendChild(el('span', 'bad', t('bidsTie', cards)));
      if (tricksOff) alert.appendChild(el('span', 'warn', t('tricksCheck', wonSum, cards)));
      alert.style.display = bidsTie || tricksOff ? 'block' : 'none';

      tally.className = 'tally' + (bidsDone && wonDone && !bidsTie && !tricksOff ? ' ok' : '');
      // ni una ronda con las apuestas casadas ni unas bazas que no cuadran se guardan
      // neither matching bids nor tricks that do not add up are saved
      confirmBtn.disabled = !(bidsDone && wonDone) || bidsTie || tricksOff;
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
      render();
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
    card.appendChild(el('h2', 'card-title', t('standings')));
    var box = el('div', 'standings');
    var order = ranking(game);
    order.forEach(function (entry, i) {
      var item = el('div', 'standing' + (i === 0 && entry.played ? ' lead' : ''));

      var head = el('div', 'standing-head');
      head.appendChild(el('span', 'pos', (i + 1)));
      head.appendChild(el('span', 'nm', entry.name));
      if (entry.last !== null) {
        head.appendChild(el('span', 'delta ' + (entry.last >= 0 ? 'up' : 'down'),
          (entry.last > 0 ? '+' : '') + entry.last));
      }
      item.appendChild(head);

      var foot = el('div', 'standing-foot');
      var pts = el('span', 'pts');
      pts.appendChild(el('strong', null, String(entry.total)));
      pts.appendChild(el('span', 'pts-unit', t('pointsUnit')));
      foot.appendChild(pts);
      foot.appendChild(el('span', 'hits', t('hitsOf', entry.hits, entry.played)));
      item.appendChild(foot);

      box.appendChild(item);
    });
    card.appendChild(box);
    card.appendChild(el('p', 'hint', t('standingsLegend')));
    return card;
  }

  function historyCard() {
    var card = el('section', 'card');
    card.appendChild(el('h2', 'card-title', t('playedRounds')));

    if (!game.results.length) {
      card.appendChild(el('p', 'hint', t('noRounds')));
      var empty = el('div', 'actions');
      empty.appendChild(viewLink('button-link', t('fullTable'), 'table'));
      card.appendChild(empty);
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
      [t('shortBid'), t('shortTricks'), t('shortPoints'), t('shortTotal')].forEach(function (label, i) {
        r2.appendChild(el('th', i === 0 ? 'group' : null, label));
      });
    });
    thead.appendChild(r2);
    table.appendChild(thead);

    var tbody = el('tbody');
    var running = game.players.map(function () { return 0; });
    game.results.forEach(function (res, r) {
      var tr = el('tr');
      var dealer = res.dealer;
      var cardsCell = el('td', 'cards', String(res.cards));
      cardsCell.title = t('dealsChip', game.players[dealer]);
      tr.appendChild(cardsCell);
      game.players.forEach(function (name, p) {
        var pts = points(res.bids[p], res.won[p]);
        running[p] += pts;
        tr.appendChild(el('td', 'group' + (p === dealer ? ' deals' : ''), String(res.bids[p])));
        tr.appendChild(el('td', null, String(res.won[p])));
        tr.appendChild(el('td', pts >= 0 ? 'hit' : 'miss', (pts > 0 ? '+' : '') + pts));
        tr.appendChild(el('td', 'total', String(running[p])));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);
    card.appendChild(el('p', 'hint', t('tableLegend')));

    var actions = el('div', 'actions');
    actions.appendChild(viewLink('button-link', t('fullTable'), 'table'));
    card.appendChild(actions);
    return card;
  }

  function winnerCard() {
    var card = el('section', 'card winner');
    var order = ranking(game);
    card.appendChild(el('div', 'trophy', '🏆'));
    card.appendChild(el('div', 'nm', order[0].name));
    card.appendChild(el('p', 'hint', t('winsWith', order[0].total)));
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
    var head = t('csvHeaders');
    var lines = [];
    lines.push([head.round, head.cards, head.deals].concat(game.players.map(function (n) {
      return [n + ' ' + head.bid, n + ' ' + head.tricks, n + ' ' + head.points, n + ' ' + head.total];
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
    lines.push([head.totalRow, '', ''].concat(game.players.map(function (n, p) {
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
    card.appendChild(el('h2', 'card-title', t('saveShare')));

    var status = el('div', 'banner');
    status.style.display = 'none';
    card.appendChild(status);

    function report(text, tone) {
      status.className = 'banner' + (tone ? ' ' + tone : '');
      status.textContent = text;
      status.style.display = 'block';
    }

    var actions = el('div', 'actions');

    var csvBtn = el('button', null, t('downloadCsv'));
    csvBtn.type = 'button';
    csvBtn.disabled = !game.results.length;
    csvBtn.addEventListener('click', function () {
      download('pocha-' + stamp() + '.csv', toCsv(), 'text/csv;charset=utf-8');
    });
    actions.appendChild(csvBtn);

    var sheetBtn = el('button', finished ? 'primary' : '', t('sendSheets'));
    sheetBtn.type = 'button';
    sheetBtn.disabled = !game.results.length;
    actions.appendChild(sheetBtn);

    var newBtn = el('button', 'ghost', t('newGameBtn'));
    newBtn.type = 'button';
    newBtn.addEventListener('click', function () {
      if (game.results.length && !finished &&
          !window.confirm(t('confirmNew'))) return;
      drop(LS.game);
      game = null;
      draft = null;
      render();
    });
    actions.appendChild(newBtn);

    card.appendChild(actions);

    var details = el('details', 'sync');
    details.appendChild(el('summary', null, t('sheetsSection')));
    var field = el('div', 'field');
    field.style.marginTop = '0.6rem';
    field.appendChild(el('label', null, t('sheetsUrlLabel')));
    var urlInput = el('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'https://script.google.com/macros/s/.../exec';
    urlInput.value = load(LS.sheet, '') || '';
    urlInput.addEventListener('change', function () { save(LS.sheet, urlInput.value.trim()); });
    field.appendChild(urlInput);
    details.appendChild(field);
    details.appendChild(el('p', 'hint', t('sheetsUrlHint')));
    card.appendChild(details);

    sheetBtn.addEventListener('click', function () {
      var url = (load(LS.sheet, '') || '').trim();
      if (!url) {
        details.open = true;
        urlInput.focus();
        report(t('sheetsNeedUrl'), 'bad');
        return;
      }
      sheetBtn.disabled = true;
      report(t('sheetsSending'));
      window.fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(gamePayload())
      }).then(function () {
        report(t('sheetsSent'), 'ok');
      }).catch(function () {
        report(t('sheetsFailed'), 'bad');
      }).then(function () {
        sheetBtn.disabled = false;
      });
    });

    return card;
  }

  /* ---------- tabla completa / full table ---------- */

  function fullTableCard() {
    var card = el('section', 'card');
    var head = el('div', 'round-head');
    head.appendChild(el('span', 'big', t('fullTable')));
    var played = game.results.length;
    head.appendChild(el('span', 'meta', t('roundsDone', played, game.rounds.length)));
    card.appendChild(head);

    var wrap = el('div', 'table-wrap');
    var table = el('table', 'full-table');

    var thead = el('thead');
    var r1 = el('tr');
    var corner = el('th', 'cards-col', t('shortCards'));
    corner.rowSpan = 2;
    r1.appendChild(corner);
    game.players.forEach(function (name) {
      var cell = el('th', 'group', name);
      cell.colSpan = 4;
      r1.appendChild(cell);
    });
    thead.appendChild(r1);
    var r2 = el('tr');
    game.players.forEach(function () {
      [t('shortBid'), t('shortTricks'), t('shortPoints'), t('shortTotal')].forEach(function (label, i) {
        r2.appendChild(el('th', i === 0 ? 'group' : null, label));
      });
    });
    thead.appendChild(r2);
    table.appendChild(thead);

    var tbody = el('tbody');
    var running = game.players.map(function () { return 0; });
    game.rounds.forEach(function (cards, r) {
      var res = game.results[r];
      var tr = el('tr', res ? '' : 'pending');
      var dealer = dealerOf(game, r);
      var cell = el('td', 'cards-col', String(cards));
      cell.title = t('dealsChip', game.players[dealer]);
      tr.appendChild(cell);
      game.players.forEach(function (name, p) {
        if (!res) {
          tr.appendChild(el('td', 'group' + (p === dealer ? ' deals' : ''), p === dealer ? '\u25CF' : ''));
          tr.appendChild(el('td', null, ''));
          tr.appendChild(el('td', null, ''));
          tr.appendChild(el('td', null, ''));
          return;
        }
        var pts = points(res.bids[p], res.won[p]);
        running[p] += pts;
        tr.appendChild(el('td', 'group' + (p === dealer ? ' deals' : ''), String(res.bids[p])));
        tr.appendChild(el('td', null, String(res.won[p])));
        tr.appendChild(el('td', pts >= 0 ? 'hit' : 'miss', (pts > 0 ? '+' : '') + pts));
        tr.appendChild(el('td', 'total', String(running[p])));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    var tfoot = el('tfoot');
    var tr = el('tr');
    tr.appendChild(el('td', 'cards-col', t('shortTotal')));
    game.players.forEach(function (name, p) {
      var cell = el('td', 'group total');
      cell.colSpan = 4;
      cell.textContent = String(running[p]);
      tr.appendChild(cell);
    });
    tfoot.appendChild(tr);
    table.appendChild(tfoot);

    wrap.appendChild(table);
    card.appendChild(wrap);
    card.appendChild(el('p', 'hint', t('fullTableLegend')));

    var actions = el('div', 'actions');
    actions.appendChild(viewLink('button-link primary', t('backToGame'), 'game'));
    var printBtn = el('button', null, t('printTable'));
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () { window.print(); });
    actions.appendChild(printBtn);
    card.appendChild(actions);

    return card;
  }

  /* ---------- barra de idioma / language bar ---------- */

  function topBar() {
    var bar = el('div', 'top-bar');

    var tabs = el('nav', 'tabs');
    var entries = [['game', 'tabGame']];
    if (game && game.results) entries.push(['table', 'tabTable']);
    entries.push(['docs', 'tabRules']);
    entries.forEach(function (entry) {
      tabs.appendChild(viewLink('tab' + (entry[0] === view ? ' on' : ''), t(entry[1]), entry[0]));
    });
    bar.appendChild(tabs);

    bar.appendChild(langBar());
    return bar;
  }

  function viewLink(className, label, name) {
    var link = el('a', className, label);
    link.href = hrefOf(name);
    if (name === view) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      setView(name);
    });
    return link;
  }

  function langBar() {
    var bar = el('div', 'lang-bar');
    ['es', 'en'].forEach(function (code) {
      var btn = el('button', 'lang' + (code === lang ? ' on' : ''), DICT[code].label);
      btn.type = 'button';
      btn.lang = code;
      if (code === lang) btn.setAttribute('aria-current', 'true');
      btn.addEventListener('click', function () { setLang(code); });
      bar.appendChild(btn);
    });
    return bar;
  }

  /* ---------- documentación / documentation ---------- */

  function docsSection() {
    var section = el('section', 'docs');
    t('docs').forEach(function (block) {
      if (block.h2) {
        section.appendChild(el('h2', null, block.h2));
        return;
      }
      if (block.p) {
        var para = el('p');
        para.innerHTML = block.p;
        section.appendChild(para);
        return;
      }
      if (block.ol) {
        var list = el('ol');
        block.ol.forEach(function (item) {
          var li = el('li');
          li.innerHTML = item;
          list.appendChild(li);
        });
        section.appendChild(list);
        return;
      }
      if (block.table) {
        var wrap = el('div', 'table-wrap');
        var table = el('table', 'docs-table');
        var thead = el('thead');
        var hr = el('tr');
        block.table.head.forEach(function (h) { hr.appendChild(el('th', null, h)); });
        thead.appendChild(hr);
        table.appendChild(thead);
        var tbody = el('tbody');
        block.table.rows.forEach(function (row) {
          var tr = el('tr');
          row.forEach(function (cell) { tr.appendChild(el('td', null, cell)); });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        section.appendChild(wrap);
        return;
      }
      if (block.ranks) {
        var row = el('div', 'rank-row');
        block.ranks.forEach(function (rank, i) {
          if (i > 0) row.appendChild(el('span', 'rank-arrow', '>'));
          row.appendChild(el('span', 'rank' + (i === 0 ? ' top' : ''), rank));
        });
        section.appendChild(row);
        return;
      }
      if (block.code) {
        var pre = el('pre', 'docs-code');
        pre.appendChild(el('code', null, DICT.snippets[block.code]));
        section.appendChild(pre);
      }
    });
    return section;
  }

  /* ---------- arranque / start ---------- */

  function render() {
    document.documentElement.lang = lang;
    clear(root);
    root.appendChild(topBar());
    if (view === 'docs') {
      captureSetup = null;
      root.appendChild(docsSection());
      return;
    }
    if (view === 'table' && game && game.results) {
      captureSetup = null;
      root.appendChild(fullTableCard());
      return;
    }
    if (game && game.players && game.rounds) renderGame();
    else renderSetup();
  }

  render();
})();
