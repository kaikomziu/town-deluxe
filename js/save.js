// Cookieセーブ/ロード
const SAVE_KEY = 'town_deluxe_save_v1';
const SAVE_DAYS = 400;

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
    muted: false,
    lastSave: Date.now(),
    firstPlay: Date.now()
  };
}

function saveGame(state) {
  state.lastSave = Date.now();
  try {
    const json = JSON.stringify(state);
    setCookie(SAVE_KEY, btoa(encodeURIComponent(json)), SAVE_DAYS);
  } catch (e) {
    console.warn('セーブに失敗しました', e);
  }
}

function loadGame() {
  const raw = getCookie(SAVE_KEY);
  if (!raw) return null;
  try {
    const json = decodeURIComponent(atob(raw));
    const parsed = JSON.parse(json);
    const def = defaultState();
    // 欠損フィールドを補完(将来のアップデート対応)
    return Object.assign(def, parsed, { buildings: Object.assign(def.buildings, parsed.buildings || {}) });
  } catch (e) {
    console.warn('セーブデータの読み込みに失敗しました', e);
    return null;
  }
}

function resetGame() {
  deleteCookie(SAVE_KEY);
}
