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

  var captureSetup = null; // devuelto por la pantalla de configuración / set by the setup screen

  function setLang(next) {
    if (next === lang) return;
    if (captureSetup) save(LS.lineup, captureSetup());
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
    root.appendChild(langBar());
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
    var startBtn = el('button', 'primary', t('start'));
    startBtn.type = 'button';
    actions.appendChild(startBtn);
    var forgetBtn = el('button', 'ghost', t('forget'));
    forgetBtn.type = 'button';
    forgetBtn.addEventListener('click', function () {
      if (window.confirm(t('confirmForget'))) {
        drop(LS.roster);
        renderSetup();
      }
    });
    actions.appendChild(forgetBtn);
    card.appendChild(actions);

    root.appendChild(card);
    root.appendChild(docsSection());

    captureSetup = function () {
      var typed = [];
      playersBox.querySelectorAll('input').forEach(function (input) { typed.push(input.value.trim()); });
      return {
        players: typed,
        firstDealer: parseInt(dealerSelect.value, 10) || 0,
        repeatMiddle: repeatInput.checked
      };
    };

    function currentNames() {
      var out = [];
      playersBox.querySelectorAll('input').forEach(function (input, i) {
        out.push(input.value.trim() || t('playerN', i + 1));
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
        input.placeholder = t('playerN', i + 1);
        input.value = existing[i] !== undefined ? existing[i] : (names[i] || '');
        input.autocomplete = 'off';
        input.addEventListener('input', syncDealer);
        slot.appendChild(input);
        playersBox.appendChild(slot);
      }
      syncDealer();
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
    captureSetup = null;
    root.appendChild(langBar());
    var roundIdx = game.results.length;
    var finished = roundIdx >= game.rounds.length;
    if (!draft) draft = newDraft();

    if (finished) root.appendChild(winnerCard());
    else root.appendChild(roundCard(roundIdx));

    root.appendChild(standingsCard());
    root.appendChild(historyCard());
    root.appendChild(exportCard(finished));
    root.appendChild(docsSection());
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
      var who = el('div', 'who', game.players[p]);
      if (p === dealer) who.appendChild(el('small', null, t('dealerNote')));
      row.appendChild(who);
      row.appendChild(numberInput(cards, draft.bids, p));
      row.appendChild(numberInput(cards, draft.won, p));
      box.appendChild(row);
    });
    card.appendChild(box);

    var tally = el('p', 'tally');
    card.appendChild(tally);

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
        messages.push(t('bidsSum', bidSum, cards));
        if (bidSum === cards) {
          messages.push(t('bidsMatch'));
          tone = 'tally warn';
        }
      } else {
        messages.push(t('bidsMissing'));
      }

      if (wonDone) {
        messages.push(t('tricksSum', wonSum, cards));
        if (wonSum !== cards) {
          messages.push(t('tricksMustAdd', cards));
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
    card.appendChild(el('h2', 'card-title', t('standings')));
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
    card.appendChild(el('h2', 'card-title', t('playedRounds')));

    if (!game.results.length) {
      card.appendChild(el('p', 'hint', t('noRounds')));
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
    card.appendChild(el('p', 'hint', t('tableLegend')));
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
      renderSetup();
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

  /* ---------- barra de idioma / language bar ---------- */

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
    if (game && game.players && game.rounds) renderGame();
    else renderSetup();
  }

  render();
})();
