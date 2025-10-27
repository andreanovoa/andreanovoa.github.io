---
title: "Juego de la pocha"
# date: 2025-08-08
showToc: false
disableAnchoredHeadings: true
hideAuthor: true    
---

<style>
.pocha-app {
  width: 100vw;
  max-width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  box-sizing: border-box;
  margin-left: -30vw;
  margin-top: 10vw
}

.pocha-app table.pocha-table {
  width: auto;
  max-width: 100%;
  table-layout: fixed;
  background-color: var(--code-bg);
}
  .pocha-app table.pocha-table th,
  .pocha-app table.pocha-table td {
    width: auto;
    border: 2px solid var(--theme);
    text-align: center;
    white-space: none;
    color: var(--content);
  }

  .pocha-app table.pocha-table th{
    text-align: center;
    font-size: .7em;
  }
    .pocha-app table.pocha-table td.dealer {
    color: var(--tertiary);
    font-weight: bold;
    font-style: italic;
    }


  .pocha-app input[type=number],
  .pocha-app input[type=text] {
    box-sizing: border-box;
    text-align: center;
    text-transform: uppercase;
    font-style: italic;
    color: var(--tertiary);
    padding: 0
  }
  .pocha-app #playerNamesInputs input {
    min-width: 100px;
    max-width: 100px;
    margin-right: 10px;
    font-weight: 600;
    font-size: 1.1em;
    background: var(--code-bg)
  }

.pocha-generate-btn {
  background: var(--code-bg);
  color: var(--primary);
  border: none;
  border-radius: 6px;
  padding: 0.6em 1.1em;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  margin-top: 1em;
  margin-bottom: 1em;
}

.pocha-generate-btn:hover {
  background: var(--tertiary);
  color: var(--primary);
  box-shadow: 0px 0px 4px var(--primary)
}


</style>

<div class="pocha-app">
  <!-- Inputs -->
  <label>Number of players:
    <input id="numPlayers" type="number" min="3" max="10" value="4">
  </label>

  <label style="margin-left: 10px;">
    Repeat middle rounds? 
    <input id="repeatMiddle" type="checkbox" unchecked>
  </label>

  <div id="playerNamesInputs" style="margin-top: 10px; margin-bottom: 20px"></div>

<label style="margin-top: 20px">
  Select dealer:
  <select id="dealerSelect"></select>
</label>


  <button class="pocha-generate-btn" onclick="generateTable()">Generate Table</button>
  <button class="pocha-generate-btn" id="pochaResetBtn" style="display:none;" onclick="resetPochaTable()">Reset</button>

  <div id="tableContainer"></div>
</div>

<script>
  const pochaApp = document.querySelector('.pocha-app');
  
  const numPlayersInput = pochaApp.querySelector('#numPlayers');
  const repeatMiddleInput = pochaApp.querySelector('#repeatMiddle');
  const playerNamesDiv = pochaApp.querySelector('#playerNamesInputs');
  const tableContainer = pochaApp.querySelector('#tableContainer');

  const dealerSelect = pochaApp.querySelector('#dealerSelect');

function updateDealerOptions() {
  const count = parseInt(numPlayersInput.value);
  dealerSelect.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    let playerNameInput = pochaApp.querySelector('#playerName' + i);
    let name = playerNameInput ? playerNameInput.value : ('Player ' + i);
    const option = document.createElement('option');
    option.value = i - 1; // 0-based index
    option.textContent = name;
    dealerSelect.appendChild(option);
  }
}



function updatePlayerNameInputs() {
  const count = parseInt(numPlayersInput.value);
  playerNamesDiv.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'playerName' + i;
    input.placeholder = 'Player ' + i;
    input.value = 'Player ' + i;
    input.addEventListener('input', () => {
      updateTableHeaders();
      updateDealerOptions();  // <-- update dealer dropdown with new names
    });
    playerNamesDiv.appendChild(input);
  }
  updateDealerOptions(); // <-- also update after all inputs created
}


  function updateTableHeaders() {
    const count = parseInt(numPlayersInput.value);
    for (let i = 1; i <= count; i++) {
      const nameInput = pochaApp.querySelector('#playerName' + i);
      const headerCells = pochaApp.querySelectorAll(`th.player${i}-header`);
      headerCells.forEach(cell => {
        cell.textContent = nameInput.value || ('Player ' + i);
      });
    }
  }
    numPlayersInput.addEventListener('change', () => {
    updatePlayerNameInputs();
    updateDealerOptions();
    tableContainer.innerHTML = '';
    });

    updatePlayerNameInputs();
    updateDealerOptions();


  function generateRounds(numPlayers, repeatMiddle) {
    const maxCards = Math.floor(40 / numPlayers);
    const ascending = [];
    for (let i = 1; i <= maxCards; i++) ascending.push(i);

    let repeats;
    if (repeatMiddle) {
        repeats = (numPlayers - 1) * numPlayers;
    } else {
        repeats = numPlayers - 1;
    }
    
    let rounds = ascending.concat(Array(repeats).fill(maxCards));
    for (let i = maxCards - 1; i >= 1; i--) rounds.push(i);
    return rounds;
  }

  function calculatePoints(bet, actual) {
    if (bet === actual) {
      return 10 + (bet * 5);
    } else {
      return -5 * Math.abs(bet - actual);
    }
  }

  function updateScores(numPlayers, roundsLength) {
    const cumulativeTotals = Array(numPlayers).fill(0);
    for (let round = 0; round < roundsLength; round++) {
      for (let p = 0; p < numPlayers; p++) {
        const betInput = pochaApp.querySelector(`#bet-${round}-${p}`);
        const actualInput = pochaApp.querySelector(`#actual-${round}-${p}`);
        const pointsCell = pochaApp.querySelector(`#points-${round}-${p}`);
        const totalCell = pochaApp.querySelector(`#total-${round}-${p}`);
        const maxForRound = parseInt(pochaApp.querySelector(`#round-${round}`).innerText);
        
        let bet = parseInt(betInput.value);
        let actual = parseInt(actualInput.value);

        bet = (isNaN(bet) || bet < 0) ? 0 : Math.min(bet, maxForRound);
        betInput.value = bet;

        if (isNaN(actual)) {
          pointsCell.textContent = '';
          totalCell.textContent = p > 0 && round > 0 ? pochaApp.querySelector(`#total-${round-1}-${p}`).textContent : '0';
        } else {
          actual = Math.min(Math.max(actual, 0), maxForRound);
          actualInput.value = actual;
          const points = calculatePoints(bet, actual);
          pointsCell.textContent = points;

          cumulativeTotals[p] += points;
          totalCell.textContent = cumulativeTotals[p];
        }
      }
    }
  }

  

  function generateTable() {

    const numPlayers = parseInt(numPlayersInput.value);
    const repeatMiddle = repeatMiddleInput.checked;
    const rounds = generateRounds(numPlayers, repeatMiddle);
    const dealerId = parseInt(dealerSelect.value)


    let playerNames = [];
    for (let i = 1; i <= numPlayers; i++) {
      const name = pochaApp.querySelector('#playerName' + i).value.trim();
      playerNames.push(name ? name : 'Player ' + i);
    }

    let html = '<table class="pocha-table"><thead><tr>';
    html += '<th rowspan="2">#</th>';  
    for (let i = 0; i < numPlayers; i++) {
    html += `<th colspan="4" class="player${i + 1}-header">${playerNames[i]}</th>`;
    }
    // html += '</tr><tr>';
    // for (let i = 0; i < numPlayers; i++) {
    // html += '<th>A</th><th>R</th><th>Pts</th><th>T</th>';
    // }
    html += '</tr></thead><tbody>';

    for (let r = 0; r < rounds.length; r++) {
  if ((r + dealerId) % numPlayers === 0) {  
    // mark dealer cell with a class
    html += `<tr><td class="dealer" id="round-${r}">${rounds[r]}</td>`;
  } else {
    html += `<tr><td id="round-${r}">${rounds[r]}</td>`;
  }

  for (let p = 0; p < numPlayers; p++) {
    html += `<td><input type="number" min="0" max="${rounds[r]}" id="bet-${r}-${p}" oninput="updateScores(${numPlayers},${rounds.length})"></td>`;
    html += `<td><input type="number" min="0" max="${rounds[r]}" id="actual-${r}-${p}" oninput="updateScores(${numPlayers},${rounds.length})"></td>`;
    html += `<td id="points-${r}-${p}"></td>`;
    html += `<td id="total-${r}-${p}"></td>`;
  }
  html += '</tr>';
}
    html += '</tbody></table>';
    tableContainer.innerHTML = html;


    // Collapse inputs and options

    dealerSelect.parentElement.style.display = "none";
    numPlayersInput.parentElement.style.display = "none";
    repeatMiddleInput.parentElement.style.display = "none";
    playerNamesDiv.style.display = "none";

    // Hide Generate button, show Reset button
    document.querySelector('.pocha-generate-btn').style.display = "none";
    document.getElementById('pochaResetBtn').style.display = "inline-block";

    updateScores(numPlayers, rounds.length);
  }

  function resetPochaTable() {
  // Show inputs and Generate button
  numPlayersInput.parentElement.style.display = "";
  repeatMiddleInput.parentElement.style.display = "";
  playerNamesDiv.style.display = "";
  document.querySelector('.pocha-generate-btn').style.display = "inline-block";
  document.getElementById('pochaResetBtn').style.display = "none";
  tableContainer.innerHTML = "";
  updatePlayerNameInputs();
}
</script>

