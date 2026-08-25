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
  let petition = null; // { template, expiresAt }
  let lastRankIndex = -1;
  let listeners = { tick: [], buy: [], achievement: [], prestige: [], event: [] };

  function on(evt, fn) { listeners[evt].push(fn); }
  function emit(evt, data) { listeners[evt].forEach((fn) => fn(data)); }

  function init() {
    state = loadGame() || defaultState();
    Effects.setMuted(!!state.muted);
    sanitizeLayout();
    checkDailyReset();
    lastRankIndex = rankIndexFor(state.lifetimeMoney); // 起動直後は称号アップ演出を出さない
    // UI.init()がイベント購読を終えてから発火させるため次のマイクロタスクへ遅延
    setTimeout(handleReturnFlow, 0);
    lastTick = Date.now();
    scheduleGolden();
    scheduleRain();
    scheduleUfo();
    schedulePetition();
    scheduleSickness();
    setInterval(tick, 100);
    scheduleAutoBuy();
    setInterval(() => { saveGame(state); emit('event', { type: 'autosave' }); }, 10000);
    window.addEventListener('beforeunload', () => saveGame(state));
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(state); });
  }

  function computeOfflineEarnings() {
    const elapsedMs = Date.now() - (state.lastSave || Date.now());
    const capHours = fameEffectMax('offlineCapHours', 8);
    const elapsedSec = Math.min(elapsedMs / 1000, capHours * 3600); // 名声ショップで延長可能(基本8時間)
    if (elapsedSec > 30) {
      const income = incomePerSec();
      const earned = income * elapsedSec;
      if (earned > 0) {
        state.money += earned;
        state.lifetimeMoney += earned;
        return { earned, seconds: elapsedSec };
      }
    }
    return null;
  }

  // ログインボーナスとオフライン報酬をまとめて1つの通知にする(モーダルの重複表示を避ける)
  function handleReturnFlow() {
    const login = checkLoginStreak();
    const offline = computeOfflineEarnings();
    if (login || offline) {
      emit('event', { type: 'welcome-back', login, offline });
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
    return mult * fameEffectMult('clickMult');
  }

  function globalMultiplier() {
    const prestigeMult = 1 + state.famePoints * 0.02;
    const happinessMult = 1 + state.happiness / 100;
    const rainMult = Date.now() < rainUntil ? 1.5 : 1;
    return prestigeMult * happinessMult * rainMult * fameEffectMult('incomeMult');
  }

  function incomePerSec() {
    let total = 0;
    BUILDINGS.forEach((b) => {
      total += buildingCount(b.id) * b.baseIncome * buildingMultiplier(b.id);
    });
    return total * globalMultiplier();
  }

  function recomputeStats() {
    let pop = 0, happiness = 50 + (state.happinessBonus || 0) + fameEffectSum('happinessBonusFlat', 0);
    BUILDINGS.forEach((b) => {
      const n = buildingCount(b.id);
      pop += n * b.pop;
      happiness += n * b.happiness;
    });
    if (Date.now() < state.sicknessUntil) {
      const mitigation = buildingCount('hospital') * 1.5;
      happiness -= Math.max(2, state.sicknessSeverity - mitigation);
    }
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
    addDailyProgress('moneyEarnedToday', income * delta);
    state.playtime += delta;
    checkGolden();
    checkPetitionExpire();
    checkSickness();
    checkRank();
    checkDailyReset();
    checkAchievements();
    emit('tick', { income, delta });
  }

  function canAfford(cost) { return state.money >= cost; }

  function buyBuilding(id, qty, opts) {
    opts = opts || {};
    const b = BUILDINGS.find((x) => x.id === id);
    if (!b) return false;
    const count = buildingCount(id);
    const actualQty = qty === 'max' ? maxAffordable(b, count, state.money) : qty;
    if (actualQty <= 0) { if (!opts.silent) Effects.sound('error'); return false; }
    const cost = buildingCost(b, count, actualQty);
    if (!canAfford(cost)) { if (!opts.silent) Effects.sound('error'); return false; }
    state.money -= cost;
    state.buildings[id] = count + actualQty;
    addLayoutEntries(id, actualQty);
    addDailyProgress('buildingsBoughtToday', actualQty);
    recomputeStats();
    emit('buy', { id, qty: actualQty, cost, silent: !!opts.silent });
    if (!opts.silent) {
      Effects.sound('buy');
      if ((count + actualQty) % 10 === 0 || count === 0) {
        emit('event', { type: 'milestone', building: b, count: count + actualQty });
      }
    }
    return true;
  }

  // --- 執事の自動購入(名声ショップで解放): 数秒おきに、買える中で最も安い施設を1つ買う ---
  function scheduleAutoBuy() {
    setInterval(() => {
      if (!fameHasEffect('autoBuy')) return;
      let best = null, bestCost = Infinity;
      BUILDINGS.forEach((b) => {
        const cost = buildingCost(b, buildingCount(b.id), 1);
        if (cost < bestCost && canAfford(cost)) { bestCost = cost; best = b; }
      });
      if (best) buyBuilding(best.id, 1, { silent: true });
    }, 4000);
  }

  function buyUpgrade(id) {
    const up = UPGRADES.find((u) => u.id === id);
    if (!up) return false;
    if (state.upgrades.includes(id)) return false;
    if (!canAfford(up.cost)) { Effects.sound('error'); return false; }
    state.money -= up.cost;
    state.upgrades.push(id);
    addDailyProgress('upgradesToday', 1);
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
    addDailyProgress('clicksToday', 1);
    addDailyProgress('moneyEarnedToday', gain);
    Effects.sound('click');
    return { gain, combo: comboCount, comboMult };
  }

  // --- ゴールデンビル ---
  function scheduleGolden() {
    const delay = (60000 + Math.random() * 60000) * fameEffectMult('goldenFreqMult'); // 60~120秒(名声ショップで短縮可能)
    setTimeout(() => {
      if (!goldenBuilding) spawnGolden();
      scheduleGolden();
    }, delay);
  }
  function spawnGolden() {
    goldenBuilding = { expiresAt: Date.now() + 15000 * fameEffectMult('goldenDurationMult') };
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
    addDailyProgress('goldenToday', 1);
    addDailyProgress('moneyEarnedToday', reward);
    Effects.sound('golden');
    emit('event', { type: 'golden-click', reward });
    return reward;
  }

  // --- 雨 ---
  function scheduleRain() {
    const delay = (90000 + Math.random() * 120000) * fameEffectMult('rainFreqMult');
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
    addDailyProgress('moneyEarnedToday', reward);
    Effects.sound('golden');
    emit('event', { type: 'ufo-click', reward });
    return reward;
  }

  // --- 町民の声(陳情) ---
  function schedulePetition() {
    const delay = 70000 + Math.random() * 90000; // 70~160秒
    setTimeout(() => {
      if (!petition) spawnPetition();
      schedulePetition();
    }, delay);
  }
  function spawnPetition() {
    const season = currentSeason();
    // 通常の陳情プールに、今の季節に合う季節限定の陳情を1枠分だけ混ぜる
    const seasonal = SEASONAL_COMPLAINTS.filter((c) => c.season === season);
    const pool = COMPLAINTS.concat(seasonal);
    const template = pool[Math.floor(Math.random() * pool.length)];
    petition = { template, expiresAt: Date.now() + 25000, createdAt: Date.now() };
    emit('event', { type: 'petition-spawn', petition });
  }
  function petitionCost() {
    return Math.max(20, Math.round(incomePerSec() * 25));
  }
  function checkPetitionExpire() {
    if (petition && Date.now() > petition.expiresAt) {
      const template = petition.template;
      state.happinessBonus = Math.max(-100, Math.min(100, (state.happinessBonus || 0) + template.ignoreHappiness));
      state.petitionsIgnored++;
      petition = null;
      recomputeStats();
      emit('event', { type: 'petition-expire', template });
    }
  }
  function resolvePetition(agree) {
    if (!petition) return null;
    const template = petition.template;
    let result;
    if (agree) {
      const cost = petitionCost();
      if (!canAfford(cost)) { Effects.sound('error'); return null; }
      const happinessGain = template.agreeHappiness * fameEffectMult('petitionAgreeMult');
      state.money -= cost;
      state.happinessBonus = Math.max(-100, Math.min(100, (state.happinessBonus || 0) + happinessGain));
      state.petitionsAnswered++;
      addDailyProgress('petitionsToday', 1);
      if (template.season && !state.seasonalComplaintsResolved.includes(template.id)) {
        state.seasonalComplaintsResolved.push(template.id);
      }
      result = { agree: true, cost, happiness: happinessGain, template };
    } else {
      state.happinessBonus = Math.max(-100, Math.min(100, (state.happinessBonus || 0) + template.ignoreHappiness));
      state.petitionsIgnored++;
      result = { agree: false, happiness: template.ignoreHappiness, template };
    }
    petition = null;
    recomputeStats();
    Effects.sound(agree ? 'buy' : 'error');
    emit('event', { type: 'petition-resolved', result });
    return result;
  }

  // --- 病気イベント ---
  function scheduleSickness() {
    const delay = 180000 + Math.random() * 180000; // 3~6分
    setTimeout(() => {
      attemptSickness();
      scheduleSickness();
    }, delay);
  }
  // 予防チェック: 病院が多いほど、そもそも流行が起きにくくなる(0円でも最大95%までしか防げない=稀に起きる)
  function preventionChance(buildingId, ratePerBuilding, cap) {
    return Math.min(cap, buildingCount(buildingId) * ratePerBuilding);
  }
  function sicknessPreventionChance() {
    return preventionChance('hospital', 0.12 * fameEffectMult('preventionMult'), 0.95);
  }
  function attemptSickness() {
    if (Date.now() < state.sicknessUntil) return; // 既に流行中なら重複させない
    const hospitals = buildingCount('hospital');
    if (hospitals > 0 && Math.random() < sicknessPreventionChance()) {
      state.sicknessPrevented = (state.sicknessPrevented || 0) + 1;
      emit('event', { type: 'sickness-prevented', hospitals });
      return;
    }
    triggerSickness();
  }
  function triggerSickness() {
    if (Date.now() < state.sicknessUntil) return; // 既に流行中なら重複させない
    const hospitals = buildingCount('hospital');
    const baseSeverity = 18 + Math.random() * 10;
    const severity = Math.max(3, baseSeverity - hospitals * 1.5);
    const baseDuration = 50000 + Math.random() * 30000;
    const duration = Math.max(15000, baseDuration - hospitals * 2500);
    const info = SICKNESS_EVENTS[Math.floor(Math.random() * SICKNESS_EVENTS.length)];
    state.sicknessUntil = Date.now() + duration;
    state.sicknessSeverity = severity;
    state.sicknessName = info.name;
    state.sicknessIcon = info.icon;
    recomputeStats();
    emit('event', { type: 'sickness-start', name: info.name, icon: info.icon, severity, duration });
  }
  function checkSickness() {
    if (state.sicknessUntil > 0 && Date.now() > state.sicknessUntil) {
      state.sicknessSurvived++;
      state.sicknessUntil = 0;
      state.sicknessSeverity = 0;
      recomputeStats();
      emit('event', { type: 'sickness-end', cured: false });
    }
  }
  function sicknessCureCost() {
    return Math.max(150, Math.round(incomePerSec() * 45));
  }
  function cureSickness() {
    if (state.sicknessUntil <= Date.now()) return false;
    const cost = sicknessCureCost();
    if (!canAfford(cost)) { Effects.sound('error'); return false; }
    state.money -= cost;
    state.sicknessUntil = 0;
    state.sicknessSeverity = 0;
    state.sicknessCured++;
    recomputeStats();
    Effects.sound('prestige');
    emit('event', { type: 'sickness-end', cured: true });
    return true;
  }

  // --- 街並みレイアウト(ドラッグ配置) ---
  const MAX_LAYOUT_PER_BUILDING = 24;
  // 町役場(下部中央)の真下に建物が重なって掴めなくなるのを防ぐ「配置禁止ゾーン」
  const TOWN_HALL_ZONE = { xMin: 34, xMax: 66, yMin: 84 };
  function sanitizeLayoutPosition(x, y) {
    x = Math.min(97, Math.max(3, x));
    y = Math.min(97, Math.max(3, y));
    if (x >= TOWN_HALL_ZONE.xMin && x <= TOWN_HALL_ZONE.xMax && y >= TOWN_HALL_ZONE.yMin) {
      x = x < 50 ? TOWN_HALL_ZONE.xMin - 5 : TOWN_HALL_ZONE.xMax + 5;
      x = Math.min(97, Math.max(3, x));
    }
    return { x, y };
  }
  function sanitizeLayout() {
    (state.layout || []).forEach((e) => {
      const fixed = sanitizeLayoutPosition(e.x, e.y);
      e.x = fixed.x; e.y = fixed.y;
    });
  }
  // ドラッグ配置は廃止し、購入時にランダムな位置へ設置する(見た目のみ・経済効果なし)
  function defaultLayoutPosition() {
    const x = 4 + Math.random() * 92;
    const y = 6 + Math.random() * 90;
    return sanitizeLayoutPosition(x, y);
  }
  function addLayoutEntries(buildingId, qty) {
    const existing = state.layout.filter((e) => e.type === buildingId).length;
    const toAdd = Math.max(0, Math.min(qty, MAX_LAYOUT_PER_BUILDING - existing));
    for (let i = 0; i < toAdd; i++) {
      const idx = state.layout.length;
      const pos = defaultLayoutPosition();
      state.layout.push({ id: `b${idx}_${buildingId}_${Date.now().toString(36)}${i}`, type: buildingId, x: pos.x, y: pos.y });
    }
  }

  // --- 市長ランク(称号) ---
  function checkRank() {
    const idx = rankIndexFor(state.lifetimeMoney);
    if (idx > lastRankIndex) {
      lastRankIndex = idx;
      emit('event', { type: 'rank-up', rank: RANK_TIERS[idx] });
    }
  }

  // --- デイリーミッション ---
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function pickDailyMissions() {
    const pool = MISSION_POOL.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const income = incomePerSec();
    return pool.slice(0, 3).map((m) => {
      const target = m.dynamicTarget ? Math.max(500, Math.round(income * 150)) : m.target;
      const reward = Math.max(m.tier === 2 ? 200 : 80, Math.round(income * (m.tier === 2 ? 60 : 25)));
      return { id: m.id, metric: m.metric, target, reward, claimed: false, icon: m.icon, label: m.label(target) };
    });
  }
  function checkDailyReset() {
    const today = todayStr();
    if (!state.daily || state.daily.date !== today) {
      state.daily = {
        date: today,
        missions: pickDailyMissions(),
        progress: { buildingsBoughtToday: 0, moneyEarnedToday: 0, clicksToday: 0, petitionsToday: 0, goldenToday: 0, upgradesToday: 0 }
      };
      emit('event', { type: 'daily-reset' });
    }
  }
  function addDailyProgress(metric, amount) {
    if (!state.daily || !state.daily.progress) return;
    state.daily.progress[metric] = (state.daily.progress[metric] || 0) + amount;
  }
  function claimMission(id) {
    const m = state.daily.missions.find((x) => x.id === id);
    if (!m || m.claimed) return false;
    const progress = state.daily.progress[m.metric] || 0;
    if (progress < m.target) return false;
    m.claimed = true;
    state.money += m.reward;
    state.lifetimeMoney += m.reward;
    state.dailyMissionsClaimed = (state.dailyMissionsClaimed || 0) + 1;
    Effects.sound('buy');
    emit('event', { type: 'mission-claimed', mission: m });
    return true;
  }

  // --- 連続ログイン報酬 ---
  function checkLoginStreak() {
    const today = todayStr();
    if (state.lastLoginDate === today) return null;
    let broken = false;
    if (state.lastLoginDate === '') {
      state.loginStreak = 1;
    } else if (state.lastLoginDate === yesterdayStr()) {
      state.loginStreak = (state.loginStreak || 0) + 1;
    } else {
      state.loginStreak = 1;
      broken = true;
    }
    state.lastLoginDate = today;
    const reward = Math.max(100, Math.round(incomePerSec() * 30)) * Math.min(state.loginStreak, 7);
    state.money += reward;
    state.lifetimeMoney += reward;
    return { streak: state.loginStreak, reward, broken };
  }

  // --- 住民の表示切り替え(演出負荷が気になる場合オフに) ---
  function togglePedestrians() {
    state.showPedestrians = !state.showPedestrians;
    return state.showPedestrians;
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

  // --- 名声ショップ(都市合併で得た名声ポイントを使う恒久アップグレード) ---
  // famePointsは収入倍率(+2%/pt)の源泉として都市合併ごとに再計算される「総獲得量」なので、
  // ショップの購入では減らさず、代わりにfameSpent(使用済み量)を積み上げて差分を「利用可能額」とする。
  function fameAvailable() { return state.famePoints - (state.fameSpent || 0); }
  function isFameShopTierUnlocked(tier) { return fameShopTierUnlocked(tier, state.prestigeCount); }
  function isFameUpgradeOwned(id) { return (state.fameShopUpgrades || []).includes(id); }
  function buyFameUpgrade(id) {
    const item = FAME_SHOP.find((f) => f.id === id);
    if (!item) return false;
    if (isFameUpgradeOwned(id)) return false;
    if (!isFameShopTierUnlocked(item.tier)) return false;
    if (fameAvailable() < item.cost) { Effects.sound('error'); return false; }
    state.fameSpent = (state.fameSpent || 0) + item.cost;
    state.fameShopUpgrades.push(id);
    recomputeStats();
    Effects.sound('buy');
    emit('event', { type: 'fame-upgrade-bought', item });
    return true;
  }
  function fameOwnedItems() {
    return (state.fameShopUpgrades || []).map((id) => FAME_SHOP.find((f) => f.id === id)).filter(Boolean);
  }
  function fameEffectMult(type) {
    let mult = 1;
    fameOwnedItems().forEach((item) => { if (item.effect.type === type) mult *= item.effect.value; });
    return mult;
  }
  function fameEffectMax(type, base) {
    let best = base;
    fameOwnedItems().forEach((item) => { if (item.effect.type === type) best = Math.max(best, item.effect.value); });
    return best;
  }
  function fameEffectSum(type, base) {
    let total = base;
    fameOwnedItems().forEach((item) => { if (item.effect.type === type) total += item.effect.value; });
    return total;
  }
  function fameHasEffect(type) {
    return fameOwnedItems().some((item) => item.effect.type === type);
  }

  // --- 都市合併(プレステージ) ---
  function prestigeThreshold() { return 1000000 * fameEffectMult('prestigeThresholdMult'); }
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
    state.layout = [];
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

  function toggleBgmMute() {
    state.bgmMuted = !state.bgmMuted;
    return state.bgmMuted;
  }

  function setBgmVolume(v) {
    state.bgmVolume = Math.max(0, Math.min(1, v));
    return state.bgmVolume;
  }

  // --- BGMショップ ---
  function buyBgmTrack(id) {
    const track = BGM_TRACKS.find((t) => t.id === id);
    if (!track) return false;
    if (state.bgmUnlocked.includes(id)) return false;
    if (!canAfford(track.price)) { Effects.sound('error'); return false; }
    state.money -= track.price;
    state.bgmUnlocked.push(id);
    Effects.sound('buy');
    emit('event', { type: 'bgm-unlocked', track });
    return true;
  }

  function selectBgm(id) {
    if (!state.bgmUnlocked.includes(id)) return false;
    state.currentBgm = id;
    emit('event', { type: 'bgm-changed', id });
    return true;
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
    getPetition: () => petition, resolvePetition, petitionCost,
    isSick: () => Date.now() < state.sicknessUntil, cureSickness, sicknessCureCost, sicknessPreventionChance,
    getLayout: () => state.layout,
    getRank: () => RANK_TIERS[rankIndexFor(state.lifetimeMoney)],
    getDaily: () => state.daily, claimMission,
    getShowPedestrians: () => state.showPedestrians, togglePedestrians,
    potentialFame, canPrestige, doPrestige, prestigeThreshold,
    fameAvailable, isFameShopTierUnlocked, isFameUpgradeOwned, buyFameUpgrade,
    toggleMute, toggleBgmMute, setBgmVolume, buyBgmTrack, selectBgm, doReset, saveNow: () => saveGame(state)
  };
})();
