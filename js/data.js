// タウンDELUXE ゲームデータ定義

const COST_MULT = 1.15;

// 施設定義: id, 名前, 絵文字, 基礎コスト, 基礎収入/秒, 人口寄与, 幸福度寄与, 説明
const BUILDINGS = [
  { id: 'house',      name: '家',          emoji: '🏠', baseCost: 15,               baseIncome: 0.1,        pop: 2,   happiness: 0,  desc: '町の住民が暮らす家。少しずつ資金を稼ぐ。' },
  { id: 'farm',       name: '畑',          emoji: '🌾', baseCost: 100,              baseIncome: 1,          pop: 1,   happiness: 0,  desc: '作物を育てて売る。雨の日は収穫アップ。' },
  { id: 'park',       name: '公園',        emoji: '🌳', baseCost: 600,              baseIncome: 2,          pop: 0,   happiness: 3,  desc: '住民の幸福度がアップする憩いの場。' },
  { id: 'shop',       name: '商店',        emoji: '🏪', baseCost: 1100,             baseIncome: 8,          pop: 3,   happiness: 0,  desc: '住民に商品を売って稼ぐ。' },
  { id: 'school',     name: '学校',        emoji: '🏫', baseCost: 12000,            baseIncome: 47,         pop: 6,   happiness: 2,  desc: '教育で幸福度も少しアップ。' },
  { id: 'factory',    name: '工場',        emoji: '🏭', baseCost: 130000,           baseIncome: 260,        pop: 9,   happiness: -1, desc: '大量生産できるがちょっとうるさい。' },
  { id: 'hospital',   name: '病院',        emoji: '🏥', baseCost: 1400000,          baseIncome: 1400,       pop: 12,  happiness: 2,  desc: '住民の健康を守る安心施設。' },
  { id: 'station',    name: '駅',          emoji: '🚉', baseCost: 20000000,         baseIncome: 7800,       pop: 18,  happiness: 1,  desc: '人の流れを生み出す交通の要。' },
  { id: 'amusement',  name: '遊園地',      emoji: '🎡', baseCost: 330000000,        baseIncome: 44000,      pop: 30,  happiness: 6,  desc: '町いちばんの人気スポット。' },
  { id: 'office',     name: 'オフィスビル', emoji: '🏢', baseCost: 5100000000,       baseIncome: 260000,     pop: 55,  happiness: 0,  desc: '高層ビルで一気にビジネス拡大。' },
  { id: 'stadium',    name: 'スタジアム',   emoji: '🏟️', baseCost: 75000000000,      baseIncome: 1600000,    pop: 90,  happiness: 4,  desc: '大きなイベントで町が盛り上がる。' },
  { id: 'skyscraper', name: '摩天楼',      emoji: '🌆', baseCost: 1000000000000,    baseIncome: 10000000,   pop: 160, happiness: 2,  desc: '町のシンボルとなる超高層タワー。' },
  { id: 'castle',     name: '城',          emoji: '🏰', baseCost: 14000000000000,   baseIncome: 65000000,   pop: 400, happiness: 10, desc: '伝説の城。首都の証。' }
];

function buildingCost(building, currentCount, qty) {
  qty = qty || 1;
  const b = building.baseCost;
  const r = COST_MULT;
  // sum_{i=0}^{qty-1} b * r^(currentCount+i) = b * r^currentCount * (r^qty - 1)/(r-1)
  return b * Math.pow(r, currentCount) * (Math.pow(r, qty) - 1) / (r - 1);
}

function maxAffordable(building, currentCount, money) {
  // find max n such that buildingCost(building,currentCount,n) <= money
  let lo = 0, hi = 1;
  while (buildingCost(building, currentCount, hi) <= money && hi < 100000) hi *= 2;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (buildingCost(building, currentCount, mid) <= money) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// アップグレード自動生成: 各施設ごとに所持数マイルストーンで収入2倍
const UPGRADE_MILESTONES = [10, 25, 50, 100, 150, 200];
function generateUpgrades() {
  const list = [];
  BUILDINGS.forEach((b, bi) => {
    UPGRADE_MILESTONES.forEach((m, mi) => {
      list.push({
        id: `up_${b.id}_${m}`,
        buildingId: b.id,
        require: m,
        cost: b.baseCost * m * 6,
        name: `${b.emoji} ${b.name}の効率化 Lv.${mi + 1}`,
        desc: `${b.name}を${m}個所有すると解放。${b.name}の収入が2倍になる。`,
        effect: { type: 'mult', buildingId: b.id, value: 2 }
      });
    });
  });
  // グローバルアップグレード(クリック強化)
  const clickMilestones = [
    { at: 1000, cost: 500, name: '👆 元気な握手 Lv.1', mult: 2 },
    { at: 50000, cost: 25000, name: '👆 元気な握手 Lv.2', mult: 2 },
    { at: 1000000, cost: 600000, name: '👆 元気な握手 Lv.3', mult: 2 },
    { at: 100000000, cost: 60000000, name: '👆 元気な握手 Lv.4', mult: 2 },
    { at: 10000000000, cost: 6000000000, name: '👆 元気な握手 Lv.5', mult: 2 }
  ];
  clickMilestones.forEach((c, i) => {
    list.push({
      id: `up_click_${i}`,
      buildingId: null,
      require: 0,
      requireLifetime: c.at,
      cost: c.cost,
      name: c.name,
      desc: `累計${formatNum(c.at)}円稼ぐと解放。町役場クリックの獲得資金が2倍になる。`,
      effect: { type: 'click', value: c.mult }
    });
  });
  return list;
}

// 実績自動生成
function generateAchievements() {
  const list = [];

  const moneyMilestones = [
    [1000, '小遣い稼ぎ'], [10000, '町内で評判'], [100000, '商才あり'],
    [1000000, '百万長者'], [10000000, '千万長者'], [100000000, '億万長者'],
    [1000000000, '十億長者'], [10000000000, '百億長者'], [1000000000000, '兆越えの資産家'],
    [1000000000000000, '町を超えた存在']
  ];
  moneyMilestones.forEach(([v, name]) => {
    list.push({
      id: `ach_money_${v}`, name: `💰 ${name}`,
      desc: `累計資金 ${formatNum(v)}円を達成`,
      check: (s) => s.lifetimeMoney >= v
    });
  });

  BUILDINGS.forEach((b) => {
    [1, 10, 25, 50, 100, 200].forEach((n) => {
      list.push({
        id: `ach_build_${b.id}_${n}`, name: `${b.emoji} ${b.name}コレクター Lv.${n}`,
        desc: `${b.name}を${n}個所有する`,
        check: (s) => (s.buildings[b.id] || 0) >= n
      });
    });
  });

  const popMilestones = [50, 200, 1000, 5000, 20000, 100000];
  popMilestones.forEach((v) => {
    list.push({
      id: `ach_pop_${v}`, name: `👥 人口${formatNum(v)}人突破`,
      desc: `町の人口が${formatNum(v)}人に到達`,
      check: (s) => s.population >= v
    });
  });

  [1, 5, 10, 25, 50].forEach((v) => {
    list.push({
      id: `ach_prestige_${v}`, name: `🌟 都市合併 ${v}回目`,
      desc: `都市合併を${v}回行う`,
      check: (s) => s.prestigeCount >= v
    });
  });

  [100, 1000, 10000, 50000].forEach((v) => {
    list.push({
      id: `ach_click_${v}`, name: `👆 クリック${formatNum(v)}回`,
      desc: `町役場を${formatNum(v)}回クリックする`,
      check: (s) => s.totalClicks >= v
    });
  });

  [1, 10, 50].forEach((v) => {
    list.push({
      id: `ach_golden_${v}`, name: `✨ ゴールデンビル${v}回ゲット`,
      desc: `ゴールデンビルを${v}回クリックする`,
      check: (s) => s.goldenClicks >= v
    });
  });

  list.push({ id: 'ach_happiness_100', name: '😊 幸福な町', desc: '幸福度100%以上を達成', check: (s) => s.happiness >= 100 });
  list.push({ id: 'ach_happiness_150', name: '😆 楽園都市', desc: '幸福度150%(上限)を達成', check: (s) => s.happiness >= 150 });
  list.push({ id: 'ach_all_buildings', name: '🏙️ フルコンプ都市', desc: '全ての施設を1つ以上所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1) });
  list.push({ id: 'ach_playtime_1h', name: '⏱️ 滞在1時間', desc: '合計プレイ時間1時間を達成', check: (s) => s.playtime >= 3600 });
  list.push({ id: 'ach_playtime_10h', name: '⏱️ 滞在10時間', desc: '合計プレイ時間10時間を達成', check: (s) => s.playtime >= 36000 });
  list.push({ id: 'ach_ufo', name: '🛸 未確認飛行物体', desc: 'UFOをクリックする', check: (s) => s.ufoClicks >= 1 });

  return list;
}

const UPGRADES = generateUpgrades();
const ACHIEVEMENTS = generateAchievements();

function formatNum(n) {
  n = Math.floor(n * 100) / 100;
  if (n < 0) return '-' + formatNum(-n);
  if (n < 1000) return (Math.round(n * 100) / 100).toLocaleString('ja-JP');
  const units = [
    { v: 1e16, s: '京' }, { v: 1e12, s: '兆' }, { v: 1e8, s: '億' }, { v: 1e4, s: '万' }
  ];
  for (const u of units) {
    if (n >= u.v) {
      const val = n / u.v;
      return (Math.round(val * 100) / 100).toLocaleString('ja-JP') + u.s;
    }
  }
  return Math.round(n).toLocaleString('ja-JP');
}
