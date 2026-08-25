// Cookieセーブ/ロード
const SAVE_KEY = 'town_deluxe_save_v1';
const SAVE_DAYS = 400;
// 実績・アップグレード・街並み配置・施設所持数など「種類が増えるほど際限なく
// 大きくなるデータ」は、Cookieの4KB上限で本体セーブごと静かに失敗しないよう
// 別途localStorageに保存する。施設が90種類に増えた際、buildingsオブジェクトだけで
// 初期状態(全て0個)でもCookie上限を超えて一切セーブできなくなる事故が実際に起きたため、
// 「施設の種類数に比例して大きくなるもの」は原則すべてこちら側に置くこと。
const LISTS_KEY = 'town_deluxe_lists_v1';

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function defaultState() {
  const buildings = {};
  BUILDINGS.forEach((b) => (buildings[b.id] = 0));
  return {
    money: 0,
    lifetimeMoney: 0,
    buildings,
    upgrades: [],
    achievements: [],
    famePoints: 0,
    fameSpent: 0,
    fameShopUpgrades: [],
    prestigeCount: 0,
    totalClicks: 0,
    goldenClicks: 0,
    ufoClicks: 0,
    playtime: 0,
    population: 0,
    happiness: 50,
    happinessBonus: 0,
    petitionsAnswered: 0,
    petitionsIgnored: 0,
    sicknessUntil: 0,
    sicknessSeverity: 0,
    sicknessName: '',
    sicknessIcon: '😷',
    sicknessSurvived: 0,
    sicknessCured: 0,
    sicknessPrevented: 0,
    layout: [],
    muted: false,
    bgmMuted: false,
    bgmVolume: 0.35,
    bgmUnlocked: ['hitoyasumi'],
    currentBgm: 'hitoyasumi',
    showPedestrians: true,
    districtBonusEverActive: false,
    seasonalComplaintsResolved: [],
    dailyMissionsClaimed: 0,
    loginStreak: 0,
    lastLoginDate: '',
    daily: {
      date: '',
      missions: [],
      progress: { buildingsBoughtToday: 0, moneyEarnedToday: 0, clicksToday: 0, petitionsToday: 0, goldenToday: 0, upgradesToday: 0 }
    },
    lastSave: Date.now(),
    firstPlay: Date.now()
  };
}

// 種類数に応じて際限なく大きくなりうるフィールド。ここに載っているものはCookieに入れず、
// LISTS_KEY(localStorage)側に保存する。新しく「〜のリスト」「〜ごとの状態を持つオブジェクト」
// を追加するときは、ここに足すことを忘れないこと。
const GROWING_FIELDS = ['achievements', 'upgrades', 'layout', 'fameShopUpgrades', 'buildings', 'bgmUnlocked', 'seasonalComplaintsResolved', 'daily'];

function saveGame(state) {
  state.lastSave = Date.now();
  const core = {};
  const lists = {};
  Object.keys(state).forEach((key) => {
    if (GROWING_FIELDS.includes(key)) lists[key] = state[key];
    else core[key] = state[key];
  });
  // 本体(資金など、サイズが増えない小さなフィールドのみ)はCookieへ
  try {
    const json = JSON.stringify(core);
    setCookie(SAVE_KEY, btoa(encodeURIComponent(json)), SAVE_DAYS);
  } catch (e) {
    console.warn('セーブに失敗しました', e);
  }
  // 増え続けるフィールド類はlocalStorageへ(容量が大きく上限を気にしなくてよい)
  try {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  } catch (e) {
    console.warn('施設/実績/アップグレード/街並み配置/名声ショップの保存に失敗しました', e);
  }
}

function loadGame() {
  const raw = getCookie(SAVE_KEY);
  if (!raw) return null;
  try {
    const json = decodeURIComponent(atob(raw));
    const core = JSON.parse(json);
    const def = defaultState();
    const merged = Object.assign(def, core);
    try {
      const listsRaw = localStorage.getItem(LISTS_KEY);
      if (listsRaw) {
        const lists = JSON.parse(listsRaw);
        GROWING_FIELDS.forEach((key) => {
          if (lists[key] !== undefined) merged[key] = lists[key];
        });
      }
    } catch (e) {
      console.warn('施設/実績/アップグレード/街並み配置/名声ショップの読み込みに失敗しました', e);
    }
    // 欠損フィールドを補完(将来のアップデートで施設が増えた場合など)
    merged.buildings = Object.assign(def.buildings, merged.buildings || {});
    return merged;
  } catch (e) {
    console.warn('セーブデータの読み込みに失敗しました', e);
    return null;
  }
}

function resetGame() {
  deleteCookie(SAVE_KEY);
  try { localStorage.removeItem(LISTS_KEY); } catch (e) { /* noop */ }
}
