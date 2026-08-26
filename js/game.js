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
  // リスナー1つが例外を投げても他のリスナー(UI再描画など)や呼び出し元の処理が
  // 止まらないよう、各リスナーを個別にtry/catchで保護する。
  function emit(evt, data) {
    listeners[evt].forEach((fn) => {
      try { fn(data); } catch (e) { console.error(`[emit:${evt}]`, e); }
    });
  }

  function init() {
    state = loadGame() || defaultState();
    Effects.setMuted(!!state.muted);
    Effects.setParticlesEnabled(state.showEffects !== false);
    Effects.setShakeEnabled(state.showScreenShake !== false);
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
    scheduleFire();
    scheduleCrime();
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

  // --- 所持アップグレードから来る倍率のキャッシュ ---
  // 施設×アップグレードが数十〜数百種類規模になったため、buildingMultiplierを呼ぶたびに
  // 「所持アップグレード数 × 全アップグレード数」を総当たりで舐めると、施設ごとに呼ばれる
  // incomePerSec()内で数千万回規模の計算になり得る。所持アップグレードが変化した時だけ
  // 1回スキャンして施設ごとの倍率をまとめて計算し、以降はO(1)ルックアップにする。
  let buildingMultCache = null;
  let clickMultFromUpgradesCache = 1;
  function invalidateUpgradeCaches() { buildingMultCache = null; }
  function ensureUpgradeCaches() {
    if (buildingMultCache) return;
    buildingMultCache = {};
    clickMultFromUpgradesCache = 1;
    state.upgrades.forEach((uid) => {
      const up = UPGRADES_BY_ID.get(uid);
      if (!up) return;
      if (up.effect.type === 'mult') {
        buildingMultCache[up.effect.buildingId] = (buildingMultCache[up.effect.buildingId] || 1) * up.effect.value;
      } else if (up.effect.type === 'click') {
        clickMultFromUpgradesCache *= up.effect.value;
      }
    });
  }
  function buildingMultiplier(id) {
    ensureUpgradeCaches();
    return buildingMultCache[id] || 1;
  }

  function clickMultiplier() {
    ensureUpgradeCaches();
    return clickMultFromUpgradesCache * fameEffectMult('clickMult');
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
      const mitigation = medicalPower() * 12.5;
      happiness -= Math.max(2, state.sicknessSeverity - mitigation);
    }
    if (Date.now() < state.hazards.fire.until) {
      const mitigation = firePower() * 10;
      happiness -= Math.max(2, state.hazards.fire.severity - mitigation);
    }
    // 人口は最大人口(町の拡張で引き上げ)まで。超過分は住みきれず、幸福度に軽いペナルティ
    const cap = maxPopulation();
    if (pop > cap) {
      const overRatio = pop / cap - 1;
      happiness -= Math.min(15, overRatio * 10);
    }
    state.population = Math.min(pop, cap);
    state.happiness = Math.max(0, Math.min(maxHappiness(), happiness));
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
    checkFire();
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

  // --- 一括購入: 「MAX」が今選んでいる1施設だけを買い占めるのに対し、こちらは全施設を対象に
  // 買えるだけ買っていく。順序は3種類:
  //   cheap(安い順)     : BUILDINGSの並び(=価格が安い順)のまま、前から順に残り資金の全額を使って買う
  //   expensive(高い順) : 並びを逆にして、高い施設から順に残り資金の全額を使って買う
  //   even(平等)        : 全施設種類で資金を均等割りし、各施設はその持ち分の中で買えるだけ買う
  function buyAllAffordable(mode) {
    mode = mode || 'cheap';
    const bought = [];
    let totalCost = 0, totalQty = 0;
    const order = mode === 'expensive' ? BUILDINGS.slice().reverse() : BUILDINGS;
    // evenは購入が進んでも一人あたりの持ち分を変えたくないため、開始時点の資金で固定して割る
    const evenShare = mode === 'even' ? state.money / BUILDINGS.length : null;
    order.forEach((b) => {
      const count = buildingCount(b.id);
      const budget = mode === 'even' ? evenShare : state.money;
      const qty = maxAffordable(b, count, budget);
      if (qty <= 0) return;
      const cost = buildingCost(b, count, qty);
      if (buyBuilding(b.id, qty, { silent: true })) {
        bought.push({ id: b.id, name: b.name, emoji: b.emoji, qty, cost });
        totalCost += cost;
        totalQty += qty;
      }
    });
    if (totalQty > 0) {
      Effects.sound('buy');
    } else {
      Effects.sound('error');
    }
    emit('event', { type: 'buy-all', bought, totalCost, totalQty, mode });
    return { bought, totalCost, totalQty };
  }

  // --- 執事の自動購入(名声ショップで解放): 数秒おきに、買える中で最も安い施設・アップグレードを買う ---
  // 名声ショップ「執事の増員」でautoBuyIntervalMultが縮まるため、固定setIntervalではなく
  // 毎回間隔を計算し直すsetTimeoutの再帰呼び出しにしている。
  function scheduleAutoBuy() {
    const delay = Math.max(1000, 4000 * fameEffectMult('autoBuyIntervalMult'));
    setTimeout(() => {
      if (fameHasEffect('autoBuy')) {
        let best = null, bestCost = Infinity;
        BUILDINGS.forEach((b) => {
          const cost = buildingCost(b, buildingCount(b.id), 1);
          if (cost < bestCost && canAfford(cost)) { bestCost = cost; best = b; }
        });
        if (best) buyBuilding(best.id, 1, { silent: true });
      }
      if (fameHasEffect('autoBuyUpgrades')) {
        const affordable = UPGRADES.filter((u) => isUpgradeUnlocked(u) && !state.upgrades.includes(u.id) && canAfford(u.cost));
        if (affordable.length) {
          const cheapest = affordable.reduce((a, b) => (a.cost < b.cost ? a : b));
          buyUpgrade(cheapest.id, { silent: true });
        }
      }
      scheduleAutoBuy();
    }, delay);
  }

  function buyUpgrade(id, opts) {
    opts = opts || {};
    const up = UPGRADES_BY_ID.get(id);
    if (!up) return false;
    if (state.upgrades.includes(id)) return false;
    if (!canAfford(up.cost)) { if (!opts.silent) Effects.sound('error'); return false; }
    state.money -= up.cost;
    state.upgrades.push(id);
    invalidateUpgradeCaches();
    addDailyProgress('upgradesToday', 1);
    if (!opts.silent) Effects.sound('buy');
    emit('buy', { id, upgrade: true, silent: !!opts.silent });
    return true;
  }

  function isUpgradeUnlocked(up) {
    if (up.buildingId) return buildingCount(up.buildingId) >= up.require;
    if (up.requireLifetime) return state.lifetimeMoney >= up.requireLifetime;
    return true;
  }

  // --- アップグレード一括購入: 一括購入(施設)と同じ3種類の順序に対応 ---
  // アップグレードは1個ずつしか買えない(数量の概念がない)ため、購入順=どれを優先して買うかがそのまま結果を左右する。
  //   cheap(安い順)     : 安い順に並べ、残り資金の全額を使って前から買えるだけ買う
  //   expensive(高い順) : 高い順に並べ、残り資金の全額を使って前から買えるだけ買う
  //   even(平等)        : 買える候補の数で資金を均等割りし、その持ち分に収まるものだけ買う
  function buyAllUpgrades(mode) {
    mode = mode || 'cheap';
    const candidates = UPGRADES.filter((u) => isUpgradeUnlocked(u) && !state.upgrades.includes(u.id));
    const order = candidates.slice().sort((a, b) => a.cost - b.cost);
    if (mode === 'expensive') order.reverse();
    const evenShare = mode === 'even' && candidates.length > 0 ? state.money / candidates.length : null;
    const bought = [];
    let totalCost = 0;
    order.forEach((u) => {
      const budget = mode === 'even' ? evenShare : state.money;
      if (u.cost > budget) return;
      if (buyUpgrade(u.id, { silent: true })) {
        bought.push(u);
        totalCost += u.cost;
      }
    });
    Effects.sound(bought.length > 0 ? 'buy' : 'error');
    emit('event', { type: 'buy-all-upgrades', bought, totalCost, mode });
    return { bought, totalCost };
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
    const delay = (180000 + Math.random() * 240000) * fameEffectMult('ufoFreqMult');
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

  // --- 町民の声(陳情)(病気・火事・空き巣と同じ「予防」の型: 郵便局・会計事務所が予防を担う) ---
  function schedulePetition() {
    const delay = 70000 + Math.random() * 90000; // 70~160秒
    setTimeout(() => {
      if (!petition) attemptPetition();
      schedulePetition();
    }, delay);
  }
  let petitionBuildingsCache = null;
  function petitionBuildings() {
    if (!petitionBuildingsCache) petitionBuildingsCache = BUILDINGS.filter((b) => b.prevention && b.prevention.petition);
    return petitionBuildingsCache;
  }
  function petitionPower() {
    return petitionBuildings().reduce((sum, b) => sum + buildingCount(b.id) * b.prevention.petition, 0);
  }
  function petitionPreventionChance() {
    return Math.min(0.95, petitionPower() * fameEffectMult('preventionMult'));
  }
  function attemptPetition() {
    const power = petitionPower();
    if (power > 0 && Math.random() < petitionPreventionChance()) {
      state.petitionsPrevented = (state.petitionsPrevented || 0) + 1;
      emit('event', { type: 'petition-prevented' });
      return;
    }
    spawnPetition();
  }
  function spawnPetition() {
    const season = currentSeason();
    // 通常の陳情プールに、今の季節に合う季節限定の陳情を1枠分だけ混ぜる
    const seasonal = SEASONAL_COMPLAINTS.filter((c) => c.season === season);
    const pool = COMPLAINTS.concat(seasonal);
    const template = pool[Math.floor(Math.random() * pool.length)];
    petition = { template, expiresAt: Date.now() + 25000 * fameEffectMult('petitionTimeMult'), createdAt: Date.now() };
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
  // 予防チェック: 医療系施設(病院・動物病院・保健所など)が多いほど、そもそも流行が起きにくくなる
  // (0円でも最大95%までしか防げない=稀に起きる)。各施設の`prevention.sickness`が寄与率。
  // BUILDINGSは定数配列で結果が変わらないため一度だけ計算する
  let medicalBuildingsCache = null;
  function medicalBuildings() {
    if (!medicalBuildingsCache) medicalBuildingsCache = BUILDINGS.filter((b) => b.prevention && b.prevention.sickness);
    return medicalBuildingsCache;
  }
  function medicalPower() {
    return medicalBuildings().reduce((sum, b) => sum + buildingCount(b.id) * b.prevention.sickness, 0);
  }
  function sicknessPreventionChance() {
    return Math.min(0.95, medicalPower() * fameEffectMult('preventionMult'));
  }
  function attemptSickness() {
    if (Date.now() < state.sicknessUntil) return; // 既に流行中なら重複させない
    const power = medicalPower();
    if (power > 0 && Math.random() < sicknessPreventionChance()) {
      state.sicknessPrevented = (state.sicknessPrevented || 0) + 1;
      emit('event', { type: 'sickness-prevented', hospitals: buildingCount('hospital') });
      return;
    }
    triggerSickness();
  }
  function triggerSickness() {
    if (Date.now() < state.sicknessUntil) return; // 既に流行中なら重複させない
    const power = medicalPower();
    const baseSeverity = 18 + Math.random() * 10;
    const severity = Math.max(3, (baseSeverity - power * 12.5) * fameEffectMult('sicknessSeverityMult'));
    const baseDuration = 50000 + Math.random() * 30000;
    const duration = Math.max(15000, (baseDuration - power * 20833.33) * fameEffectMult('sicknessDurationMult'));
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

  // --- 火事イベント(病気と同じ「予防→軽減→早期鎮火」の型) ---
  function scheduleFire() {
    const delay = 240000 + Math.random() * 180000; // 4~7分
    setTimeout(() => {
      attemptFire();
      scheduleFire();
    }, delay);
  }
  let fireBuildingsCache = null;
  function fireBuildings() {
    if (!fireBuildingsCache) fireBuildingsCache = BUILDINGS.filter((b) => b.prevention && b.prevention.fire);
    return fireBuildingsCache;
  }
  function firePower() {
    return fireBuildings().reduce((sum, b) => sum + buildingCount(b.id) * b.prevention.fire, 0);
  }
  function firePreventionChance() {
    return Math.min(0.95, firePower() * fameEffectMult('preventionMult'));
  }
  function attemptFire() {
    if (Date.now() < state.hazards.fire.until) return; // 既に発生中なら重複させない
    const power = firePower();
    if (power > 0 && Math.random() < firePreventionChance()) {
      state.hazards.fire.prevented = (state.hazards.fire.prevented || 0) + 1;
      emit('event', { type: 'fire-prevented' });
      return;
    }
    triggerFire();
  }
  function triggerFire() {
    if (Date.now() < state.hazards.fire.until) return;
    const power = firePower();
    const baseSeverity = 15 + Math.random() * 9;
    const severity = Math.max(3, (baseSeverity - power * 10) * fameEffectMult('sicknessSeverityMult'));
    const baseDuration = 30000 + Math.random() * 25000;
    const duration = Math.max(12000, (baseDuration - power * 15000) * fameEffectMult('sicknessDurationMult'));
    const info = FIRE_EVENTS[Math.floor(Math.random() * FIRE_EVENTS.length)];
    state.hazards.fire.until = Date.now() + duration;
    state.hazards.fire.severity = severity;
    state.hazards.fire.name = info.name;
    state.hazards.fire.icon = info.icon;
    recomputeStats();
    emit('event', { type: 'fire-start', name: info.name, icon: info.icon, severity, duration });
  }
  function checkFire() {
    if (state.hazards.fire.until > 0 && Date.now() > state.hazards.fire.until) {
      state.hazards.fire.survived = (state.hazards.fire.survived || 0) + 1;
      state.hazards.fire.until = 0;
      state.hazards.fire.severity = 0;
      recomputeStats();
      emit('event', { type: 'fire-end', cured: false });
    }
  }
  function fireCureCost() {
    return Math.max(200, Math.round(incomePerSec() * 50));
  }
  function cureFire() {
    if (state.hazards.fire.until <= Date.now()) return false;
    const cost = fireCureCost();
    if (!canAfford(cost)) { Effects.sound('error'); return false; }
    state.money -= cost;
    state.hazards.fire.until = 0;
    state.hazards.fire.severity = 0;
    state.hazards.fire.cured = (state.hazards.fire.cured || 0) + 1;
    recomputeStats();
    Effects.sound('prestige');
    emit('event', { type: 'fire-end', cured: true });
    return true;
  }
  function isFireActive() { return Date.now() < state.hazards.fire.until; }

  // --- 空き巣・犯罪イベント(継続時間なし・瞬間発生型。交番が予防を担う) ---
  function scheduleCrime() {
    const delay = 200000 + Math.random() * 220000; // 約3.3~7分
    setTimeout(() => {
      attemptCrime();
      scheduleCrime();
    }, delay);
  }
  let policeBuildingsCache = null;
  function policeBuildings() {
    if (!policeBuildingsCache) policeBuildingsCache = BUILDINGS.filter((b) => b.prevention && b.prevention.crime);
    return policeBuildingsCache;
  }
  function policePower() {
    return policeBuildings().reduce((sum, b) => sum + buildingCount(b.id) * b.prevention.crime, 0);
  }
  function crimePreventionChance() {
    return Math.min(0.95, policePower() * fameEffectMult('preventionMult'));
  }
  function attemptCrime() {
    const power = policePower();
    if (power > 0 && Math.random() < crimePreventionChance()) {
      state.crimePrevented = (state.crimePrevented || 0) + 1;
      emit('event', { type: 'crime-prevented' });
      return;
    }
    // 交番が多いほど、防がれなかった時の被害額も小さくなる
    const baseStealRate = 0.02 + Math.random() * 0.03; // 2~5%
    const stealRate = Math.max(0.005, baseStealRate * Math.max(0.2, 1 - power));
    const stolen = Math.round(state.money * stealRate);
    const info = CRIME_EVENTS[Math.floor(Math.random() * CRIME_EVENTS.length)];
    state.money = Math.max(0, state.money - stolen);
    state.crimeOccurred = (state.crimeOccurred || 0) + 1;
    state.crimeStolenTotal = (state.crimeStolenTotal || 0) + stolen;
    emit('event', { type: 'crime-occurred', name: info.name, icon: info.icon, stolen });
  }

  // --- 街並みレイアウト(ドラッグ配置) ---
  const MAX_LAYOUT_PER_BUILDING = 24;
  // 町役場(下部中央)の真下に建物が重なって掴めなくなるのを防ぐ「配置禁止ゾーン」
  const TOWN_HALL_ZONE = { xMin: 34, xMax: 66, yMin: 84 };
  // #buildings-layerは.scene全体(空も含む)にかぶさっているため、
  // yはこの範囲内に収めないと建物が空中に表示されてしまう。
  // レイヤーのローカル座標(0-100%)のうち、地面(.ground、下46%)に
  // 収まる範囲だけを許可する。
  const GROUND_Y_MIN = 56;
  const GROUND_Y_MAX = 96;
  function sanitizeLayoutPosition(x, y) {
    x = Math.min(97, Math.max(3, x));
    y = Math.min(GROUND_Y_MAX, Math.max(GROUND_Y_MIN, y));
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
    const y = GROUND_Y_MIN + Math.random() * (GROUND_Y_MAX - GROUND_Y_MIN);
    return sanitizeLayoutPosition(x, y);
  }
  // 施設タイプごとのレイアウト件数キャッシュ。「全部買う」で施設種類を大量に購入すると
  // state.layout(最大 施設数×24件)を毎回フルスキャンする箇所になり得るため、O(1)ルックアップにしておく。
  let layoutTypeCounts = null;
  function invalidateLayoutTypeCounts() { layoutTypeCounts = null; }
  function ensureLayoutTypeCounts() {
    if (layoutTypeCounts) return layoutTypeCounts;
    layoutTypeCounts = {};
    state.layout.forEach((e) => { layoutTypeCounts[e.type] = (layoutTypeCounts[e.type] || 0) + 1; });
    return layoutTypeCounts;
  }
  function addLayoutEntries(buildingId, qty) {
    const counts = ensureLayoutTypeCounts();
    const existing = counts[buildingId] || 0;
    const toAdd = Math.max(0, Math.min(qty, MAX_LAYOUT_PER_BUILDING - existing));
    for (let i = 0; i < toAdd; i++) {
      const idx = state.layout.length;
      const pos = defaultLayoutPosition();
      state.layout.push({ id: `b${idx}_${buildingId}_${Date.now().toString(36)}${i}`, type: buildingId, x: pos.x, y: pos.y });
    }
    counts[buildingId] = existing + toAdd;
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
      const reward = Math.max(m.tier === 2 ? 200 : 80, Math.round(income * (m.tier === 2 ? 60 : 25) * fameEffectMult('missionRewardMult')));
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

  // --- 恒久ミッション(QUESTS): デイリーと違いリセットされない、チュートリアル〜終盤目標の一覧 ---
  // 「〜タブを開いた」等、状態だけでは判定できない初回操作はuiFlagsに記録して条件に使う
  function markUiFlag(name) {
    state.uiFlags = state.uiFlags || {};
    if (state.uiFlags[name]) return false;
    state.uiFlags[name] = true;
    return true;
  }
  function isQuestClaimed(id) { return (state.questsClaimed || []).includes(id); }
  function isQuestStageUnlocked(stage) {
    if (stage <= 1) return true;
    const prevQuests = QUESTS.filter((q) => q.stage === stage - 1);
    if (prevQuests.length === 0) return true;
    const claimed = prevQuests.filter((q) => isQuestClaimed(q.id)).length;
    return isQuestStageUnlocked(stage - 1) && claimed >= Math.ceil(prevQuests.length * 0.7);
  }
  function questReward(stage) {
    const cfg = QUEST_STAGE_REWARD[Math.min(stage, QUEST_STAGE_REWARD.length) - 1];
    return Math.max(cfg.floor, Math.round(incomePerSec() * cfg.mult * fameEffectMult('missionRewardMult')));
  }
  // 実際の付与処理(単発受け取り・一括受け取りの共通部分)
  function applyQuestClaim(q, opts) {
    opts = opts || {};
    const reward = questReward(q.stage);
    state.money += reward;
    state.lifetimeMoney += reward;
    state.questsClaimed = state.questsClaimed || [];
    state.questsClaimed.push(q.id);
    if (!opts.silent) Effects.sound('buy');
    emit('event', { type: 'quest-claimed', quest: q, reward, silent: !!opts.silent });
    return reward;
  }
  function claimQuest(id) {
    const q = QUESTS_BY_ID.get(id);
    if (!q) return false;
    if (isQuestClaimed(id)) return false;
    if (!isQuestStageUnlocked(q.stage)) return false;
    if (!q.check(state)) return false;
    applyQuestClaim(q);
    return true;
  }
  // 「全部受け取る」: silentで連続付与し、個別のトースト・再描画は発生させない(呼び出し元が最後に1回だけ処理する)。
  // QUESTSはstage順に並んでいるため1パスで走査すれば、途中でstageが解放されてもそのまま連鎖して受け取れる。
  function claimAllQuests() {
    const claimed = [];
    let totalReward = 0;
    QUESTS.forEach((q) => {
      if (isQuestClaimed(q.id)) return;
      if (!isQuestStageUnlocked(q.stage)) return;
      if (!q.check(state)) return;
      const reward = applyQuestClaim(q, { silent: true });
      claimed.push({ quest: q, reward });
      totalReward += reward;
    });
    Effects.sound(claimed.length > 0 ? 'buy' : 'error');
    emit('event', { type: 'quest-claimed-all', claimed, totalReward });
    return { claimed, totalReward };
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

  // 街並みの建物表示: 施設が130種類まで増え、1種類あたり最大24個(合計最大3000超)の
  // アイコンが並びうるため、重く感じる場合に間引く/個別に隠す/完全に消す設定を用意する
  function getBuildingDisplayMode() { return state.buildingDisplayMode || 'all'; }
  function setBuildingDisplayMode(mode) {
    if (!['all', 'dedupe', 'none'].includes(mode)) return getBuildingDisplayMode();
    state.buildingDisplayMode = mode;
    return mode;
  }
  function isBuildingHidden(id) { return (state.hiddenBuildingIds || []).includes(id); }
  function toggleBuildingHidden(id) {
    state.hiddenBuildingIds = state.hiddenBuildingIds || [];
    const idx = state.hiddenBuildingIds.indexOf(id);
    if (idx >= 0) state.hiddenBuildingIds.splice(idx, 1);
    else state.hiddenBuildingIds.push(id);
    return isBuildingHidden(id);
  }

  // アップグレード購入時の「◯◯を取得!」系トースト。連続購入を邪魔しないようオフにできる
  function toggleBuyToasts() {
    state.showBuyToasts = !state.showBuyToasts;
    return state.showBuyToasts;
  }
  function getShowBuyToasts() { return state.showBuyToasts !== false; } // 未設定(旧セーブ)はON扱い

  // 演出(紙吹雪・花火・浮き出る数字)と画面シェイク。重く感じる場合に設定でオフにできる
  function toggleEffects() {
    state.showEffects = !state.showEffects;
    Effects.setParticlesEnabled(state.showEffects);
    return state.showEffects;
  }
  function getShowEffects() { return state.showEffects !== false; }
  function toggleScreenShake() {
    state.showScreenShake = !state.showScreenShake;
    Effects.setShakeEnabled(state.showScreenShake);
    return state.showScreenShake;
  }
  function getShowScreenShake() { return state.showScreenShake !== false; }

  // --- 実績 ---
  // 実績が数百件規模になったため、毎回ACHIEVEMENTS.length分 state.achievements.includes()
  // (これもO(n))を回すと二重ループで重くなる。所持済みIDをSetにキャッシュしO(1)判定にする。
  let achievementSet = null;
  function checkAchievements() {
    if (state.achievements.length >= ACHIEVEMENTS.length) return; // 全達成済みなら何もしない
    if (!achievementSet || achievementSet.size !== state.achievements.length) {
      achievementSet = new Set(state.achievements);
    }
    ACHIEVEMENTS.forEach((a) => {
      if (!achievementSet.has(a.id) && a.check(state)) {
        state.achievements.push(a.id);
        achievementSet.add(a.id);
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
    const item = FAME_SHOP_BY_ID.get(id);
    if (!item) return false;
    if (isFameUpgradeOwned(id)) return false;
    if (!isFameShopTierUnlocked(item.tier)) return false;
    if (fameAvailable() < item.cost) { Effects.sound('error'); return false; }
    state.fameSpent = (state.fameSpent || 0) + item.cost;
    state.fameShopUpgrades.push(id);
    invalidateFameCache();
    recomputeStats();
    Effects.sound('buy');
    emit('event', { type: 'fame-upgrade-bought', item });
    return true;
  }
  // 名声ショップは所持数が数十件規模でも、fameEffectMult等がtick中に何度も呼ばれるため
  // 同様にキャッシュする(所持アイテムが変化するのは購入時とリセット時のみ)。
  let fameOwnedCache = null;
  function invalidateFameCache() { fameOwnedCache = null; }
  function fameOwnedItems() {
    if (fameOwnedCache) return fameOwnedCache;
    fameOwnedCache = (state.fameShopUpgrades || []).map((id) => FAME_SHOP_BY_ID.get(id)).filter(Boolean);
    return fameOwnedCache;
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

  // --- 町の拡張(最大人口を引き上げる恒久アップグレード。資金で購入、都市合併でも失われない) ---
  let maxPopulationCache = null;
  function invalidateMaxPopulationCache() { maxPopulationCache = null; }
  function maxPopulation() {
    if (maxPopulationCache !== null) return maxPopulationCache;
    let total = BASE_MAX_POPULATION;
    (state.townExpansions || []).forEach((id) => {
      const e = TOWN_EXPANSIONS_BY_ID.get(id);
      if (e) total += e.popBonus;
    });
    maxPopulationCache = total;
    return total;
  }
  function isTownExpansionOwned(id) { return (state.townExpansions || []).includes(id); }
  function buyTownExpansion(id) {
    const e = TOWN_EXPANSIONS_BY_ID.get(id);
    if (!e) return false;
    if (isTownExpansionOwned(id)) return false;
    if (!canAfford(e.cost)) { Effects.sound('error'); return false; }
    state.money -= e.cost;
    state.townExpansions.push(id);
    invalidateMaxPopulationCache();
    recomputeStats();
    Effects.sound('buy');
    emit('event', { type: 'expansion-bought', expansion: e });
    return true;
  }

  // --- 幸福度政策(かつて固定150%だった幸福度の上限を引き上げる恒久アップグレード。町の拡張と同じ型) ---
  let maxHappinessCache = null;
  function invalidateMaxHappinessCache() { maxHappinessCache = null; }
  function maxHappiness() {
    if (maxHappinessCache !== null) return maxHappinessCache;
    let total = BASE_HAPPINESS_CAP;
    (state.happinessExpansions || []).forEach((id) => {
      const e = HAPPINESS_EXPANSIONS_BY_ID.get(id);
      if (e) total += e.capBonus;
    });
    maxHappinessCache = total;
    return total;
  }
  function isHappinessExpansionOwned(id) { return (state.happinessExpansions || []).includes(id); }
  function buyHappinessExpansion(id) {
    const e = HAPPINESS_EXPANSIONS_BY_ID.get(id);
    if (!e) return false;
    if (isHappinessExpansionOwned(id)) return false;
    if (!canAfford(e.cost)) { Effects.sound('error'); return false; }
    state.money -= e.cost;
    state.happinessExpansions.push(id);
    invalidateMaxHappinessCache();
    recomputeStats();
    Effects.sound('buy');
    emit('event', { type: 'happiness-expansion-bought', expansion: e });
    return true;
  }

  // --- 都市合併(プレステージ) ---
  function prestigeThreshold() { return 1000000 * fameEffectMult('prestigeThresholdMult'); }
  function potentialFame() {
    if (state.lifetimeMoney < prestigeThreshold()) return 0;
    return Math.floor(Math.sqrt(state.lifetimeMoney / 1000000) * fameEffectMult('fameGainMult'));
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
    invalidateUpgradeCaches();
    invalidateLayoutTypeCounts();
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
    invalidateUpgradeCaches();
    invalidateFameCache();
    invalidateMaxPopulationCache();
    invalidateMaxHappinessCache();
    invalidateLayoutTypeCounts();
    recomputeStats();
  }

  return {
    init, on,
    getState: () => state,
    buildingCount, buildingMultiplier, clickMultiplier, globalMultiplier, incomePerSec,
    buyBuilding, buyAllAffordable, buyUpgrade, buyAllUpgrades, isUpgradeUnlocked, manualClick,
    getGolden: () => goldenBuilding, clickGolden,
    getUfo: () => ufo, clickUfo,
    isRaining: () => Date.now() < rainUntil,
    getPetition: () => petition, resolvePetition, petitionCost, petitionPreventionChance,
    isSick: () => Date.now() < state.sicknessUntil, cureSickness, sicknessCureCost, sicknessPreventionChance,
    isFireActive, cureFire, fireCureCost, firePreventionChance,
    crimePreventionChance,
    getLayout: () => state.layout,
    getRank: () => RANK_TIERS[rankIndexFor(state.lifetimeMoney)],
    getDaily: () => state.daily, claimMission,
    markUiFlag, isQuestClaimed, isQuestStageUnlocked, questReward, claimQuest, claimAllQuests,
    getShowPedestrians: () => state.showPedestrians, togglePedestrians,
    getShowBuyToasts, toggleBuyToasts,
    getShowEffects, toggleEffects, getShowScreenShake, toggleScreenShake,
    getBuildingDisplayMode, setBuildingDisplayMode, isBuildingHidden, toggleBuildingHidden,
    potentialFame, canPrestige, doPrestige, prestigeThreshold,
    fameAvailable, isFameShopTierUnlocked, isFameUpgradeOwned, buyFameUpgrade,
    maxPopulation, isTownExpansionOwned, buyTownExpansion,
    maxHappiness, isHappinessExpansionOwned, buyHappinessExpansion,
    toggleMute, toggleBgmMute, setBgmVolume, buyBgmTrack, selectBgm, doReset, saveNow: () => saveGame(state)
  };
})();
