// Cookieセーブ/ロード
const SAVE_KEY = 'town_deluxe_save_v1';
const SAVE_DAYS = 400;
// 実績・アップグレード・街並み配置は数が際限なく増えるため、Cookieの4KB上限で
// 本体セーブごと静かに失敗しないよう別途localStorageに保存する。
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
    layout: [],
    muted: false,
    bgmMuted: false,
    bgmVolume: 0.35,
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

function saveGame(state) {
  state.lastSave = Date.now();
  // 本体(資金・施設数など、サイズが増えないフィールド)はCookieへ
  const { achievements, upgrades, layout, ...core } = state;
  try {
    const json = JSON.stringify(core);
    setCookie(SAVE_KEY, btoa(encodeURIComponent(json)), SAVE_DAYS);
  } catch (e) {
    console.warn('セーブに失敗しました', e);
  }
  // 増え続けるリスト類はlocalStorageへ(容量が大きく上限を気にしなくてよい)
  try {
    localStorage.setItem(LISTS_KEY, JSON.stringify({ achievements, upgrades, layout }));
  } catch (e) {
    console.warn('実績/アップグレード/街並み配置の保存に失敗しました', e);
  }
}

function loadGame() {
  const raw = getCookie(SAVE_KEY);
  if (!raw) return null;
  try {
    const json = decodeURIComponent(atob(raw));
    const core = JSON.parse(json);
    const def = defaultState();
    // 欠損フィールドを補完(将来のアップデート対応)
    const merged = Object.assign(def, core, { buildings: Object.assign(def.buildings, core.buildings || {}) });
    try {
      const listsRaw = localStorage.getItem(LISTS_KEY);
      if (listsRaw) {
        const lists = JSON.parse(listsRaw);
        merged.achievements = lists.achievements || [];
        merged.upgrades = lists.upgrades || [];
        merged.layout = lists.layout || [];
      }
    } catch (e) {
      console.warn('実績/アップグレード/街並み配置の読み込みに失敗しました', e);
    }
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
