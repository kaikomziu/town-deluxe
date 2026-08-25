// タウンDELUXE コアロジック

const Game = (() => {
  let state = null;
  let lastTick = Date.now();
  let comboCount = 0;
  let comboTimer = null;
  let comboMult = 1;
  let goldenBuilding = null; // { x, y, expiresAt }
  let rainUntil = 0;
  let ufo = null;
  let listeners = { tick: [], buy: [], achievement: [], prestige: [], event: [] };

  function on(evt, fn) { listeners[evt].push(fn); }
  function emit(evt, data) { listeners[evt].forEach((fn) => fn(data)); }

  function init() {
    state = loadGame() || defaultState();
    Effects.setMuted(!!state.muted);
    // UI.init()がイベント購読を終えてから発火させるため次のマイクロタスクへ遅延
    setTimeout(handleOfflineEarnings, 0);
    lastTick = Date.now();
    scheduleGolden();
    scheduleRain();
    scheduleUfo();
    setInterval(tick, 100);
    setInterval(() => saveGame(state), 10000);
    window.addEventListener('beforeunload', () => saveGame(state));
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(state); });
  }

  function handleOfflineEarnings() {
    const elapsedMs = Date.now() - (state.lastSave || Date.now());
    const elapsedSec = Math.min(elapsedMs / 1000, 8 * 3600); // 最大8時間分
    if (elapsedSec > 30) {
      const income = incomePerSec();
      const earned = income * elapsedSec;
      if (earned > 0) {
        state.money += earned;
        state.lifetimeMoney += earned;
        emit('event', { type: 'offline', earned, seconds: elapsedSec });
      }
    }
  }

  function buildingCount(id) { return state.buildings[id] || 0; }

  function buildingMultiplier(id) {
    let mult = 1;
    state.upgrades.forEach((uid) => {
      const up = UPGRADES.find((u) => u.id === uid);
      if (up && up.effect.type === 'mult' && up.effect.buildingId === id) mult *= up.effect.value;
    });
    return mult;
  }

  function clickMultiplier() {
    let mult = 1;
    state.upgrades.forEach((uid) => {
      const up = UPGRADES.find((u) => u.id === uid);
      if (up && up.effect.type === 'click') mult *= up.effect.value;
    });
    return mult;
  }

  function globalMultiplier() {
    const prestigeMult = 1 + state.famePoints * 0.02;
    const happinessMult = 1 + state.happiness / 100;
    const rainMult = Date.now() < rainUntil ? 1.5 : 1;
    return prestigeMult * happinessMult * rainMult;
  }

  function incomePerSec() {
    let total = 0;
    BUILDINGS.forEach((b) => {
      total += buildingCount(b.id) * b.baseIncome * buildingMultiplier(b.id);
    });
    return total * globalMultiplier();
  }

  function recomputeStats() {
    let pop = 0, happiness = 50;
    BUILDINGS.forEach((b) => {
      const n = buildingCount(b.id);
      pop += n * b.pop;
      happiness += n * b.happiness;
    });
    state.population = pop;
    state.happiness = Math.max(0, Math.min(150, happiness));
  }

  function tick() {
    const now = Date.now();
    const delta = Math.min((now - lastTick) / 1000, 1);
    lastTick = now;
    recomputeStats();
    const income = incomePerSec();
    state.money += income * delta;
    state.lifetimeMoney += income * delta;
    state.playtime += delta;
    checkGolden();
    checkAchievements();
    emit('tick', { income, delta });
  }

  function canAfford(cost) { return state.money >= cost; }

  function buyBuilding(id, qty) {
    const b = BUILDINGS.find((x) => x.id === id);
    if (!b) return false;
    const count = buildingCount(id);
    const actualQty = qty === 'max' ? maxAffordable(b, count, state.money) : qty;
    if (actualQty <= 0) { Effects.sound('error'); return false; }
    const cost = buildingCost(b, count, actualQty);
    if (!canAfford(cost)) { Effects.sound('error'); return false; }
    state.money -= cost;
    state.buildings[id] = count + actualQty;
    recomputeStats();
    Effects.sound('buy');
    emit('buy', { id, qty: actualQty, cost });
    if ((count + actualQty) % 10 === 0 || count === 0) {
      emit('event', { type: 'milestone', building: b, count: count + actualQty });
    }
    return true;
  }

  function buyUpgrade(id) {
    const up = UPGRADES.find((u) => u.id === id);
    if (!up) return false;
    if (state.upgrades.includes(id)) return false;
    if (!canAfford(up.cost)) { Effects.sound('error'); return false; }
    state.money -= up.cost;
    state.upgrades.push(id);
    Effects.sound('buy');
    emit('buy', { id, upgrade: true });
    return true;
  }

  function isUpgradeUnlocked(up) {
    if (up.buildingId) return buildingCount(up.buildingId) >= up.require;
    if (up.requireLifetime) return state.lifetimeMoney >= up.requireLifetime;
    return true;
  }

  function manualClick() {
    const now = Date.now();
    comboCount++;
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { comboCount = 0; comboMult = 1; }, 2000);
    comboMult = 1 + Math.min(4, Math.floor(comboCount / 10) * 0.5);
    const base = Math.max(1, incomePerSec() * 0.5 + 1);
    const gain = base * clickMultiplier() * comboMult;
    state.money += gain;
    state.lifetimeMoney += gain;
    state.totalClicks++;
    Effects.sound('click');
    return { gain, combo: comboCount, comboMult };
  }

  // --- ゴールデンビル ---
  function scheduleGolden() {
    const delay = 60000 + Math.random() * 60000; // 60~120秒
    setTimeout(() => {
      if (!goldenBuilding) spawnGolden();
      scheduleGolden();
    }, delay);
  }
  function spawnGolden() {
    goldenBuilding = { expiresAt: Date.now() + 15000 };
    emit('event', { type: 'golden-spawn' });
  }
  function checkGolden() {
    if (goldenBuilding && Date.now() > goldenBuilding.expiresAt) {
      goldenBuilding = null;
      emit('event', { type: 'golden-expire' });
    }
  }
  function clickGolden() {
    if (!goldenBuilding) return null;
    goldenBuilding = null;
    state.goldenClicks++;
    const income = incomePerSec();
    const reward = income > 0 ? income * (20 + Math.random() * 20) : 100 + state.lifetimeMoney * 0.1;
    state.money += reward;
    state.lifetimeMoney += reward;
    Effects.sound('golden');
    emit('event', { type: 'golden-click', reward });
    return reward;
  }

  // --- 雨 ---
  function scheduleRain() {
    const delay = 90000 + Math.random() * 120000;
    setTimeout(() => {
      rainUntil = Date.now() + 45000;
      emit('event', { type: 'rain-start' });
      setTimeout(() => emit('event', { type: 'rain-end' }), 45000);
      scheduleRain();
    }, delay);
  }

  // --- UFO ---
  function scheduleUfo() {
    const delay = 180000 + Math.random() * 240000;
    setTimeout(() => {
      ufo = { expiresAt: Date.now() + 8000 };
      emit('event', { type: 'ufo-spawn' });
      setTimeout(() => { if (ufo) { ufo = null; emit('event', { type: 'ufo-expire' }); } }, 8000);
      scheduleUfo();
    }, delay);
  }
  function clickUfo() {
    if (!ufo) return null;
    ufo = null;
    state.ufoClicks++;
    const reward = Math.max(500, state.lifetimeMoney * 0.02);
    state.money += reward;
    state.lifetimeMoney += reward;
    Effects.sound('golden');
    emit('event', { type: 'ufo-click', reward });
    return reward;
  }

  // --- 実績 ---
  function checkAchievements() {
    ACHIEVEMENTS.forEach((a) => {
      if (!state.achievements.includes(a.id) && a.check(state)) {
        state.achievements.push(a.id);
        Effects.sound('achievement');
        emit('achievement', a);
      }
    });
  }

  // --- 都市合併(プレステージ) ---
  function prestigeThreshold() { return 1000000; }
  function potentialFame() {
    if (state.lifetimeMoney < prestigeThreshold()) return 0;
    return Math.floor(Math.sqrt(state.lifetimeMoney / 1000000));
  }
  function canPrestige() { return potentialFame() > state.famePoints; }
  function doPrestige() {
    const gained = potentialFame() - state.famePoints;
    if (gained <= 0) return false;
    state.famePoints = potentialFame();
    state.prestigeCount++;
    state.money = 0;
    BUILDINGS.forEach((b) => (state.buildings[b.id] = 0));
    state.upgrades = [];
    recomputeStats();
    Effects.sound('prestige');
    emit('prestige', { gained });
    return true;
  }

  function toggleMute() {
    state.muted = !state.muted;
    Effects.setMuted(state.muted);
    return state.muted;
  }

  function doReset() {
    resetGame();
    state = defaultState();
    recomputeStats();
  }

  return {
    init, on,
    getState: () => state,
    buildingCount, buildingMultiplier, clickMultiplier, globalMultiplier, incomePerSec,
    buyBuilding, buyUpgrade, isUpgradeUnlocked, manualClick,
    getGolden: () => goldenBuilding, clickGolden,
    getUfo: () => ufo, clickUfo,
    isRaining: () => Date.now() < rainUntil,
    potentialFame, canPrestige, doPrestige, prestigeThreshold,
    toggleMute, doReset, saveNow: () => saveGame(state)
  };
})();
