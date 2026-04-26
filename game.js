/* ============================================================
 * Bengali Codenames — game logic
 * ============================================================ */

(function () {
  'use strict';

  // ----- Constants -----
  const GRID_SIZE = 25;
  const TYPE_RED = 'red';
  const TYPE_BLUE = 'blue';
  const TYPE_NEUTRAL = 'neutral';
  const TYPE_ASSASSIN = 'assassin';

  // ----- DOM -----
  const boardEl = document.getElementById('board');
  const redCountEl = document.getElementById('red-count');
  const blueCountEl = document.getElementById('blue-count');
  const redScoreEl = document.getElementById('red-score');
  const blueScoreEl = document.getElementById('blue-score');
  const turnIndicatorEl = document.getElementById('turn-indicator');
  const turnTextEl = document.getElementById('turn-text');
  const newGameBtn = document.getElementById('new-game-btn');
  const spymasterBtn = document.getElementById('spymaster-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const helpCloseBtn = document.getElementById('help-close');
  const gameoverModal = document.getElementById('gameover-modal');
  const gameoverTitle = document.getElementById('gameover-title');
  const gameoverText = document.getElementById('gameover-text');
  const gameoverNewGameBtn = document.getElementById('gameover-newgame');

  // ----- State -----
  let cards = [];          // [{ word, type, revealed }]
  let firstTeam = TYPE_RED;
  let currentTurn = TYPE_RED;
  let redRemaining = 0;
  let blueRemaining = 0;
  let spymasterMode = false;
  let gameOver = false;

  // ----- Helpers -----
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickWords() {
    const pool = (typeof BENGALI_WORDS !== 'undefined' ? BENGALI_WORDS : (typeof UNIQUE_WORDS !== 'undefined' ? UNIQUE_WORDS : []));
    // words.js exports `UNIQUE_WORDS` to module.exports but for browser use BENGALI_WORDS-derived constant directly.
    // We re-derive a unique list at runtime for safety.
    const unique = [...new Set(pool)];
    return shuffle(unique).slice(0, GRID_SIZE);
  }

  function buildKey() {
    // Standard Codenames distribution: 9-8-7-1 (first team gets 9)
    firstTeam = Math.random() < 0.5 ? TYPE_RED : TYPE_BLUE;
    const types = [];
    if (firstTeam === TYPE_RED) {
      for (let i = 0; i < 9; i++) types.push(TYPE_RED);
      for (let i = 0; i < 8; i++) types.push(TYPE_BLUE);
    } else {
      for (let i = 0; i < 9; i++) types.push(TYPE_BLUE);
      for (let i = 0; i < 8; i++) types.push(TYPE_RED);
    }
    for (let i = 0; i < 7; i++) types.push(TYPE_NEUTRAL);
    types.push(TYPE_ASSASSIN);
    return shuffle(types);
  }

  // ----- New game -----
  function newGame() {
    const words = pickWords();
    const key = buildKey();
    cards = words.map((word, i) => ({
      word,
      type: key[i],
      revealed: false,
    }));
    redRemaining = cards.filter(c => c.type === TYPE_RED).length;
    blueRemaining = cards.filter(c => c.type === TYPE_BLUE).length;
    currentTurn = firstTeam;
    gameOver = false;
    spymasterMode = false;
    spymasterBtn.classList.remove('active');
    spymasterBtn.textContent = 'গুপ্তচর প্রধান';
    gameoverModal.hidden = true;
    render();
    updateStatus();
  }

  // ----- Render -----
  function render() {
    boardEl.innerHTML = '';
    cards.forEach((card, idx) => {
      const el = document.createElement('button');
      el.className = 'card';
      el.type = 'button';
      el.dataset.idx = String(idx);
      el.textContent = card.word;

      if (card.revealed) {
        el.classList.add('revealed', card.type);
        el.disabled = true;
      } else if (spymasterMode) {
        el.classList.add('preview-' + card.type);
      }

      el.addEventListener('click', () => onCardClick(idx));
      boardEl.appendChild(el);
    });
  }

  function updateStatus() {
    redCountEl.textContent = String(redRemaining);
    blueCountEl.textContent = String(blueRemaining);
    redScoreEl.classList.toggle('active', currentTurn === TYPE_RED && !gameOver);
    blueScoreEl.classList.toggle('active', currentTurn === TYPE_BLUE && !gameOver);

    turnIndicatorEl.classList.remove('red', 'blue');
    if (!gameOver) {
      turnIndicatorEl.classList.add(currentTurn);
      turnTextEl.textContent = currentTurn === TYPE_RED ? 'লাল দলের পালা' : 'নীল দলের পালা';
    } else {
      turnTextEl.textContent = 'খেলা শেষ';
    }
  }

  // ----- Click handling -----
  function onCardClick(idx) {
    if (gameOver) return;
    if (spymasterMode) return; // spymaster view is read-only
    const card = cards[idx];
    if (card.revealed) return;

    card.revealed = true;

    if (card.type === TYPE_ASSASSIN) {
      // Current team loses
      const winner = currentTurn === TYPE_RED ? TYPE_BLUE : TYPE_RED;
      endGame(winner, 'assassin');
      render();
      return;
    }

    if (card.type === TYPE_RED) {
      redRemaining--;
      if (redRemaining === 0) { endGame(TYPE_RED, 'cleared'); render(); return; }
      if (currentTurn !== TYPE_RED) endTurn();
    } else if (card.type === TYPE_BLUE) {
      blueRemaining--;
      if (blueRemaining === 0) { endGame(TYPE_BLUE, 'cleared'); render(); return; }
      if (currentTurn !== TYPE_BLUE) endTurn();
    } else {
      // neutral
      endTurn();
    }

    render();
    updateStatus();
  }

  function endTurn() {
    currentTurn = currentTurn === TYPE_RED ? TYPE_BLUE : TYPE_RED;
  }

  function endGame(winner, reason) {
    gameOver = true;
    const teamName = winner === TYPE_RED ? 'লাল দল' : 'নীল দল';
    let message;
    if (reason === 'assassin') {
      message = `আততায়ী শব্দে ক্লিক হয়েছে! ${teamName} জিতেছে।`;
    } else {
      message = `${teamName} সব এজেন্ট খুঁজে পেয়েছে এবং জিতেছে!`;
    }
    gameoverTitle.textContent = `${teamName} বিজয়ী 🎉`;
    gameoverText.textContent = message;
    gameoverModal.hidden = false;
    updateStatus();
  }

  // ----- Spymaster toggle -----
  function toggleSpymaster() {
    spymasterMode = !spymasterMode;
    spymasterBtn.classList.toggle('active', spymasterMode);
    spymasterBtn.textContent = spymasterMode ? 'খেলোয়াড় দৃশ্য' : 'গুপ্তচর প্রধান';
    render();
  }

  // ----- Wire up -----
  newGameBtn.addEventListener('click', newGame);
  gameoverNewGameBtn.addEventListener('click', newGame);
  spymasterBtn.addEventListener('click', toggleSpymaster);
  helpBtn.addEventListener('click', () => { helpModal.hidden = false; });
  helpCloseBtn.addEventListener('click', () => { helpModal.hidden = true; });

  // Click outside modals to close (help only)
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.hidden = true;
  });

  // Keyboard: N for new game, S to toggle spymaster, Esc to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      helpModal.hidden = true;
    } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
      newGame();
    } else if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
      toggleSpymaster();
    }
  });

  // First game
  newGame();
})();
