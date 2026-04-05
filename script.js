(function () {
  'use strict';

  if (document.getElementById('tf-overlay')) return;
  document.documentElement.style.overflow = 'hidden';

  // ─── PALETTES ────────────────────────────────────────────────────────
  const PALETTES = {
    obsidian: {
      name: 'Obsidian', swatch: '#c8a84b', dark: true,
      vars: {
        '--tf-bg': '#0f0f0f', '--tf-surface': '#111111', '--tf-hover': '#151209',
        '--tf-text': '#e8e4dc', '--tf-muted': '#3e3e3e', '--tf-ghost': '#232323',
        '--tf-accent': '#c8a84b', '--tf-accent2': '#dfc060',
        '--tf-accent-dim': 'rgba(200,168,75,0.15)',
        '--tf-line': '#1c1c1c', '--tf-grid': 'rgba(255,255,255,0.022)',
        '--tf-grad-end': '#000000',
      },
    },
    midnight: {
      name: 'Midnight', swatch: '#6c9fff', dark: true,
      vars: {
        '--tf-bg': '#0d0f1a', '--tf-surface': '#131628', '--tf-hover': '#161b30',
        '--tf-text': '#dde4f0', '--tf-muted': '#3a4060', '--tf-ghost': '#252840',
        '--tf-accent': '#6c9fff', '--tf-accent2': '#88b0ff',
        '--tf-accent-dim': 'rgba(108,159,255,0.15)',
        '--tf-line': '#1e2240', '--tf-grid': 'rgba(108,159,255,0.04)',
        '--tf-grad-end': '#060810',
      },
    },
    forest: {
      name: 'Forest', swatch: '#4db87a', dark: true,
      vars: {
        '--tf-bg': '#0c110e', '--tf-surface': '#111a12', '--tf-hover': '#141e15',
        '--tf-text': '#d4e8d8', '--tf-muted': '#2a4030', '--tf-ghost': '#1e3025',
        '--tf-accent': '#4db87a', '--tf-accent2': '#6acc90',
        '--tf-accent-dim': 'rgba(77,184,122,0.15)',
        '--tf-line': '#182820', '--tf-grid': 'rgba(77,184,122,0.04)',
        '--tf-grad-end': '#060a07',
      },
    },
    cream: {
      name: 'Cream', swatch: '#b8941f', dark: false,
      vars: {
        '--tf-bg': '#faf8f4', '--tf-surface': '#ffffff', '--tf-hover': '#fdf9f2',
        '--tf-text': '#1a1a1a', '--tf-muted': '#888888', '--tf-ghost': '#c0b8ac',
        '--tf-accent': '#b8941f', '--tf-accent2': '#c8a830',
        '--tf-accent-dim': 'rgba(184,148,31,0.15)',
        '--tf-line': '#e8e0d4', '--tf-grid': 'rgba(0,0,0,0.04)',
        '--tf-grad-end': '#ffffff',
      },
    },
    cloud: {
      name: 'Cloud', swatch: '#5b7cfa', dark: false,
      vars: {
        '--tf-bg': '#f5f7fa', '--tf-surface': '#ffffff', '--tf-hover': '#eef2ff',
        '--tf-text': '#1e2030', '--tf-muted': '#8090b0', '--tf-ghost': '#b8c4d8',
        '--tf-accent': '#5b7cfa', '--tf-accent2': '#7090ff',
        '--tf-accent-dim': 'rgba(91,124,250,0.15)',
        '--tf-line': '#dde3f0', '--tf-grid': 'rgba(91,124,250,0.04)',
        '--tf-grad-end': '#ffffff',
      },
    },
    rose: {
      name: 'Rose', swatch: '#c4604a', dark: false,
      vars: {
        '--tf-bg': '#fdf7f5', '--tf-surface': '#ffffff', '--tf-hover': '#fcf0ed',
        '--tf-text': '#2a1a18', '--tf-muted': '#9a7060', '--tf-ghost': '#c8b0a8',
        '--tf-accent': '#c4604a', '--tf-accent2': '#d4735a',
        '--tf-accent-dim': 'rgba(196,96,74,0.15)',
        '--tf-line': '#f0dcd8', '--tf-grid': 'rgba(196,96,74,0.1)',
        '--tf-grad-end': '#ffffff',
      },
    },
  };

  const PALETTE_KEY = 'tf_palette';

  function applyPalette(key) {
    const p = PALETTES[key];
    if (!p) return;
    const el = document.getElementById('tf-overlay');
    Object.entries(p.vars).forEach(([k, v]) => el.style.setProperty(k, v));
    localStorage.setItem(PALETTE_KEY, key);
    // Update button dot color + name
    const dot  = document.getElementById('tf-themeBtnDot');
    const name = document.getElementById('tf-themeBtnName');
    if (dot)  dot.style.background  = p.swatch;
    if (name) name.textContent       = p.name;
    // Update active state in dropdown
    el.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.palette === key);
    });
    // Close dropdown
    const dd = document.getElementById('tf-themeDropdown');
    if (dd) dd.classList.remove('open');
  }

  // ─── BUILD DROPDOWN OPTIONS ──────────────────────────────────────────
  function buildOptions(keys) {
    return keys.map(k => `
      <button class="theme-option" data-palette="${k}">
        <span class="theme-dot" style="background:${PALETTES[k].swatch}"></span>
        <span class="theme-name">${PALETTES[k].name}</span>
        <span class="theme-check">✓</span>
      </button>`).join('');
  }

  const darkKeys  = ['obsidian', 'midnight', 'forest'];
  const lightKeys = ['cream', 'cloud', 'rose'];

  const dropdownHTML = `
    <div class="theme-wrap" id="tf-themeWrap">
      <button class="theme-btn" id="tf-themeBtn" title="Change theme">
        <span class="theme-btn-dot" id="tf-themeBtnDot"></span>
        <span class="theme-btn-name" id="tf-themeBtnName"></span>
        <span class="theme-btn-arrow">▾</span>
      </button>
      <div class="theme-dropdown" id="tf-themeDropdown">
        <div class="theme-group-label">Dark</div>
        ${buildOptions(darkKeys)}
        <div class="theme-divider"></div>
        <div class="theme-group-label">Light</div>
        ${buildOptions(lightKeys)}
      </div>
    </div>`;

  // ─── CONFIG ──────────────────────────────────────────────────────────
  const DIFFS = {
    easy:   { pairs: 8,  cols: 4, time: 120 },
    normal: { pairs: 12, cols: 6, time: 180 },
    hard:   { pairs: 18, cols: 6, time: 180 },
  };
  const KEY        = 'tf_scores';
  const STREAK_KEY  = 'tf_streak';

  // ─── STATE ───────────────────────────────────────────────────────────
  let cur = 'easy', flipped = [], matched = 0, moves = 0,
      timeLeft = 0, ticker = null, locked = false, total = 0;

  // ─── INJECT HTML ─────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'tf-overlay';
  overlay.innerHTML = `
    <div class="app">
      <div class="grid-bg"></div>
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>

      <div class="top-bar">
        <span class="top-label">ThinkFirst</span>
        <div class="top-right">
          <button class="back-btn" id="tf-backBtn">← Menu</button>
          ${dropdownHTML}
          <div class="status-dot"><div class="dot"></div>Intercepted</div>
          <div class="timer-pill" id="tf-timerPill">2:00</div>
        </div>
      </div>

      <!-- LANDING -->
      <div class="screen on" id="tf-landingScreen">
        <div class="screen-inner">
          <div class="land-eyebrow">Brain checkpoint</div>
          <h1 class="land-title">Match pairs.<br/><em>Unlock</em> the AI.</h1>
          <p class="land-sub">Pick a difficulty. Beat the game. Then think with AI — not instead of it.</p>
          <div class="diff-cards">
            <div class="diff-card" id="tf-easy-card">
              <div class="diff-left">
                <span class="diff-name">Easy</span>
                <span class="diff-meta">8 pairs · 2 min</span>
              </div>
              <span class="diff-badge" id="tf-badge-easy">No record</span>
              <span class="diff-arrow">→</span>
            </div>
            <div class="diff-card" id="tf-normal-card">
              <div class="diff-left">
                <span class="diff-name">Normal</span>
                <span class="diff-meta">12 pairs · 3 min</span>
              </div>
              <span class="diff-badge" id="tf-badge-normal">No record</span>
              <span class="diff-arrow">→</span>
            </div>
            <div class="diff-card" id="tf-hard-card">
              <div class="diff-left">
                <span class="diff-name">Hard</span>
                <span class="diff-meta">18 pairs · 3 min</span>
              </div>
              <span class="diff-badge" id="tf-badge-hard">No record</span>
              <span class="diff-arrow">→</span>
            </div>
          </div>
          <!-- STREAK -->
          <div class="streak-section" id="tf-streakSection">
            <div class="streak-header">
              <span class="streak-count" id="tf-streakCount">0</span>
              <span class="streak-label">day streak</span>
            </div>
            <div class="streak-days" id="tf-streakDays"></div>
          </div>

          <div class="scores-section">
            <div class="scores-label">Top scores</div>
            <div class="scores-grid">
              <div class="score-box" id="tf-sbox-easy">
                <span class="sv" id="tf-sc-easy">—</span><span class="sl">Easy</span>
              </div>
              <div class="score-box" id="tf-sbox-normal">
                <span class="sv" id="tf-sc-normal">—</span><span class="sl">Normal</span>
              </div>
              <div class="score-box" id="tf-sbox-hard">
                <span class="sv" id="tf-sc-hard">—</span><span class="sl">Hard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GAME -->
      <div class="screen" id="tf-gameScreen">
        <div class="game-inner">
          <div class="g-eyebrow">Round active</div>
          <h2 class="g-title">Match the pairs to <em>unlock</em> the AI</h2>
          <div class="stats-row">
            <div class="stat-box hl">
              <span class="stat-val" id="tf-pairsVal">0/8</span>
              <span class="stat-lbl">Pairs</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="tf-movesVal">0</span>
              <span class="stat-lbl">Moves</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="tf-bestVal">—</span>
              <span class="stat-lbl">Best</span>
            </div>
          </div>
          <div class="prog-track"><div class="prog-fill" id="tf-progFill"></div></div>
          <div class="grid-wrap"><div class="grid" id="tf-grid"></div></div>
          <div class="skip-wrap">
            <button class="btn-skip" id="tf-skipBtn">Skip — proceed without warming up</button>
          </div>
        </div>
      </div>

      <!-- WIN -->
      <div class="overlay ov-win" id="tf-winOverlay">
        <div class="new-best" id="tf-newBestTag" style="display:none">★ New best score!</div>
        <div class="ov-icon">🧠</div>
        <h2 class="ov-title">Mind warmed up.</h2>
        <p class="ov-msg">All pairs matched in <strong id="tf-wMoves">—</strong> moves with <strong id="tf-wTime">—</strong> left. Think with AI — not instead of it.</p>
        <div class="ov-stats">
          <div class="ov-stat"><span class="s" id="tf-wScore">—</span><span class="l">Score</span></div>
          <div class="ov-stat"><span class="s" id="tf-wMovesS">—</span><span class="l">Moves</span></div>
          <div class="ov-stat"><span class="s" id="tf-wTimeS">—</span><span class="l">Time left</span></div>
        </div>
        <button class="btn-g btn-gold" id="tf-continueBtn">Continue to the site →</button>
        <button class="btn-g btn-dark" id="tf-playAgainWin">Play again</button>
        <button class="btn-g btn-dark" id="tf-changeDiffWin">Change difficulty</button>
      </div>

      <!-- LOSE -->
      <div class="overlay ov-lose" id="tf-loseOverlay">
        <div class="ov-icon">⏱</div>
        <h2 class="ov-title" id="tf-loseTitleEl">Time's up.</h2>
        <p class="ov-msg" id="tf-loseMsgEl">Give your brain another shot.</p>
        <div class="ov-stats">
          <div class="ov-stat"><span class="s" id="tf-lPairs">—</span><span class="l">Pairs found</span></div>
          <div class="ov-stat"><span class="s" id="tf-lMoves">—</span><span class="l">Moves</span></div>
        </div>
        <button class="btn-g btn-gold" id="tf-tryAgainBtn">Try again</button>
        <button class="btn-g btn-dark" id="tf-changeDiffLose">Change difficulty</button>
        <button class="btn-g btn-dark" id="tf-proceedBtn">Proceed anyway</button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(overlay);

  // ─── APPLY SAVED PALETTE ─────────────────────────────────────────────
  const savedPalette = localStorage.getItem(PALETTE_KEY) || 'obsidian';
  applyPalette(savedPalette);

  // ─── DROPDOWN EVENTS ─────────────────────────────────────────────────
  const themeBtn = document.getElementById('tf-themeBtn');
  const themeDD  = document.getElementById('tf-themeDropdown');

  themeBtn.addEventListener('click', e => {
    e.stopPropagation();
    themeDD.classList.toggle('open');
  });

  // Close on click outside
  document.addEventListener('click', e => {
    if (!document.getElementById('tf-themeWrap').contains(e.target)) {
      themeDD.classList.remove('open');
    }
  });

  // Palette option clicks
  overlay.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => applyPalette(btn.dataset.palette));
  });

  // ─── SHORTHAND ───────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  // ─── MAIN EVENTS ─────────────────────────────────────────────────────
  $('tf-backBtn').addEventListener('click', goLanding);
  $('tf-easy-card').addEventListener('click', () => startGame('easy'));
  $('tf-normal-card').addEventListener('click', () => startGame('normal'));
  $('tf-hard-card').addEventListener('click', () => startGame('hard'));
  $('tf-skipBtn').addEventListener('click', () => triggerLose(true));
  $('tf-continueBtn').addEventListener('click', goToSite);
  $('tf-playAgainWin').addEventListener('click', playAgain);
  $('tf-changeDiffWin').addEventListener('click', goLanding);
  $('tf-tryAgainBtn').addEventListener('click', playAgain);
  $('tf-changeDiffLose').addEventListener('click', goLanding);
  $('tf-proceedBtn').addEventListener('click', goToSite);

  // ─── SCORES ──────────────────────────────────────────────────────────
  function loadScores() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function saveScore(difficulty, score) {
    const s = loadScores();
    if (!s[difficulty] || score > s[difficulty]) s[difficulty] = score;
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  // ─── STREAK ──────────────────────────────────────────────────────────
  // Storage shape: { streak: Number, lastDate: 'YYYY-MM-DD', playedDates: ['YYYY-MM-DD', ...] }
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  function loadStreak() {
    try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { streak: 0, lastDate: null, playedDates: [] }; }
    catch (e) { return { streak: 0, lastDate: null, playedDates: [] }; }
  }

  function updateStreak() {
    const data  = loadStreak();
    const today = todayKey();
    if (data.lastDate === today) return; // already counted today

    // Check if yesterday was played (streak continues)
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.getFullYear() + '-' + String(yesterday.getMonth()+1).padStart(2,'0') + '-' + String(yesterday.getDate()).padStart(2,'0');
    if (data.lastDate === yKey) {
      data.streak++;
    } else {
      data.streak = 1; // reset
    }
    data.lastDate = today;
    if (!data.playedDates.includes(today)) data.playedDates.push(today);
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  }

  // Returns 7 day objects for the current week (Sat→Fri), each: { label, date, played, isToday }
  function getWeekDays() {
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const data = loadStreak();
    const today = new Date();
    // Find most recent Saturday (day 6)
    const todayDay = today.getDay(); // 0=Sun … 6=Sat
    const daysFromSat = (todayDay + 1) % 7; // 0 on Sat, 1 on Sun, …
    const satDate = new Date(today);
    satDate.setDate(today.getDate() - daysFromSat);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(satDate);
      d.setDate(satDate.getDate() + i);
      const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      return {
        label:   DAY_NAMES[d.getDay()],
        date:    d.getDate() + '-' + MONTHS[d.getMonth()],
        played:  data.playedDates.includes(key),
        isToday: key === todayKey(),
        future:  d > today && key !== todayKey(),
      };
    });
  }

  function renderStreak() {
    const data = loadStreak();
    const countEl = $('tf-streakCount');
    const daysEl  = $('tf-streakDays');
    if (!countEl || !daysEl) return;
    countEl.textContent = data.streak;
    const days = getWeekDays();
    daysEl.innerHTML = days.map(d => `
      <div class="streak-day${d.played ? ' played' : ''}${d.isToday ? ' today' : ''}${d.future ? ' future' : ''}">
        <span class="sd-name">${d.label}</span>
        <div class="sd-pip"></div>
        <span class="sd-date">${d.date}</span>
      </div>
    `).join('');
  }

  // ─── SCREENS ─────────────────────────────────────────────────────────
  function renderLanding() {
    renderStreak();
    const saved = loadScores();
    ['easy', 'normal', 'hard'].forEach(d => {
      const score = saved[d];
      const box   = $('tf-sbox-' + d);
      const badge = $('tf-badge-' + d);
      const val   = $('tf-sc-' + d);
      if (score) {
        box.classList.add('has');   badge.classList.add('has');
        val.textContent   = score;  badge.textContent = 'Best: ' + score;
      } else {
        box.classList.remove('has'); badge.classList.remove('has');
        val.textContent   = '—';    badge.textContent = 'No record';
      }
    });
  }

  function showScreen(id) {
    overlay.querySelectorAll('.screen').forEach(s => { s.classList.remove('on'); s.scrollTop = 0; });
    $(id).classList.add('on');
  }

  function goLanding() {
    clearInterval(ticker);
    $('tf-winOverlay').classList.remove('on');
    $('tf-loseOverlay').classList.remove('on');
    $('tf-timerPill').classList.remove('on', 'warn');
    $('tf-backBtn').classList.remove('on');
    renderLanding();
    showScreen('tf-landingScreen');
  }

  // ─── GAME ────────────────────────────────────────────────────────────
  function startGame(d) {
    cur = d;
    const cfg = DIFFS[d];
    total = cfg.pairs; timeLeft = cfg.time;
    flipped = []; matched = 0; moves = 0; locked = false;
    $('tf-timerPill').classList.add('on');
    $('tf-timerPill').classList.remove('warn');
    $('tf-backBtn').classList.add('on');
    $('tf-pairsVal').textContent = '0/' + total;
    $('tf-movesVal').textContent = '0';
    $('tf-progFill').style.width = '0%';
    $('tf-bestVal').textContent  = loadScores()[d] || '—';
    buildGrid(cfg); renderTimer();
    showScreen('tf-gameScreen');
    clearInterval(ticker);
    ticker = setInterval(tick, 1000);
  }

  // ─── GRID ────────────────────────────────────────────────────────────
  function getImages(count) {
    const images = [], usedSeeds = new Set();
    while (images.length < count) {
      const seed = Math.floor(Math.random() * 1000);
      if (!usedSeeds.has(seed)) { usedSeeds.add(seed); images.push('https://picsum.photos/seed/' + seed + '/200/200'); }
    }
    return images;
  }

  function responsiveCols(ideal) {
    const w = window.innerWidth;
    if (w < 360) return Math.min(ideal, 4);
    if (w < 480) return Math.min(ideal, 5);
    return ideal;
  }

  function buildGrid(cfg) {
    const g = $('tf-grid');
    g.innerHTML = '';
    g.style.gridTemplateColumns = 'repeat(' + responsiveCols(cfg.cols) + ',1fr)';
    const gallery = getImages(cfg.pairs);
    [...gallery, ...gallery].sort(() => Math.random() - 0.5).forEach(url => {
      const c = document.createElement('div');
      c.className = 'card'; c.dataset.e = url;
      c.innerHTML = `
        <div class="card-inner">
          <div class="card-b"></div>
          <div class="card-f"><img src="${url}" alt="card" loading="lazy"></div>
        </div>`;
      c.addEventListener('click', () => flip(c));
      g.appendChild(c);
    });
  }

  // ─── FLIP ────────────────────────────────────────────────────────────
  function flip(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length >= 2) return;
    card.classList.add('flipped'); flipped.push(card);
    if (flipped.length === 2) {
      moves++; $('tf-movesVal').textContent = moves; locked = true;
      if (flipped[0].dataset.e === flipped[1].dataset.e) {
        setTimeout(() => {
          flipped.forEach(c => c.classList.add('matched')); matched++;
          $('tf-pairsVal').textContent = matched + '/' + total;
          $('tf-progFill').style.width = (matched / total) * 100 + '%';
          flipped = []; locked = false;
          if (matched === total) setTimeout(triggerWin, 400);
        }, 300);
      } else {
        setTimeout(() => { flipped.forEach(c => c.classList.remove('flipped')); flipped = []; locked = false; }, 800);
      }
    }
  }

  // ─── TIMER ───────────────────────────────────────────────────────────
  function tick() { timeLeft--; renderTimer(); if (timeLeft <= 0) { clearInterval(ticker); triggerLose(false); } }
  function renderTimer() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    const p = $('tf-timerPill');
    p.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    p.classList.toggle('warn', timeLeft <= 20);
  }

  // ─── WIN / LOSE ───────────────────────────────────────────────────────
  function calcScore() { return Math.max(0, Math.round(matched * 100 + timeLeft * 5 - moves * 3)); }

  function triggerWin() {
    clearInterval(ticker);
    updateStreak();
    const score = calcScore(), old = loadScores()[cur], isNew = !old || score > old;
    saveScore(cur, score);
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    const ts = m + ':' + (s < 10 ? '0' : '') + s;
    $('tf-wMoves').textContent = moves;   $('tf-wTime').textContent  = ts;
    $('tf-wScore').textContent = score;   $('tf-wMovesS').textContent = moves;
    $('tf-wTimeS').textContent = ts;
    $('tf-newBestTag').style.display = isNew ? 'block' : 'none';
    $('tf-winOverlay').classList.add('on');
  }

  function triggerLose(skipped) {
    clearInterval(ticker);
    $('tf-lPairs').textContent     = matched + '/' + total;
    $('tf-lMoves').textContent     = moves;
    $('tf-loseTitleEl').textContent = skipped ? 'Skipped.' : "Time's up.";
    $('tf-loseMsgEl').textContent   = skipped
      ? 'No warmup today. Try again anytime.'
      : 'You found ' + matched + ' of ' + total + ' pairs. Give it another shot.';
    $('tf-loseOverlay').classList.add('on');
  }

  function playAgain() {
    $('tf-winOverlay').classList.remove('on');
    $('tf-loseOverlay').classList.remove('on');
    startGame(cur);
  }

  // ─── UNLOCK ───────────────────────────────────────────────────────────
  function goToSite() {
    overlay.style.transition = 'opacity 0.5s'; overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); document.documentElement.style.overflow = ''; }, 500);
  }

  // ─── RESIZE ───────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const gs = $('tf-gameScreen');
    if (gs && gs.classList.contains('on')) {
      const g = $('tf-grid');
      if (g) g.style.gridTemplateColumns = 'repeat(' + responsiveCols(DIFFS[cur].cols) + ',1fr)';
    }
  });

  // ─── INIT ─────────────────────────────────────────────────────────────
  renderLanding();
})();