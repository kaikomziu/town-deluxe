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
  { id: 'hospital',   name: '病院',        emoji: '🏥', baseCost: 1400000,          baseIncome: 1400,       pop: 12,  happiness: 2,  desc: '住民の健康を守る安心施設。多いほど病気の流行を未然に防ぐ。' },
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

// 町民の声(陳情)定義: agree=応える(有償・幸福度up) / ignore=突っぱねる(無償・幸福度down)
const COMPLAINTS = [
  { id: 'tax',           icon: '💰', text: '税金が高すぎる…もう少し安くしてほしい',       agreeLabel: '減税する',       ignoreLabel: '突っぱねる',   agreeHappiness: 8, ignoreHappiness: -6 },
  { id: 'garbage',       icon: '🗑️', text: 'ゴミの回収が追いついていない…',             agreeLabel: '清掃を強化する', ignoreLabel: '放置する',     agreeHappiness: 6, ignoreHappiness: -7 },
  { id: 'noise',         icon: '🔊', text: '工場の騒音がうるさくて眠れない…',           agreeLabel: '防音対策をする', ignoreLabel: '我慢してもらう', agreeHappiness: 7, ignoreHappiness: -5 },
  { id: 'traffic',       icon: '🚦', text: '渋滞がひどくて通勤が大変…',                 agreeLabel: '道路を整備する', ignoreLabel: '放っておく',   agreeHappiness: 6, ignoreHappiness: -5 },
  { id: 'park',          icon: '🌳', text: 'もっと公園を増やしてほしい…',               agreeLabel: '増設を約束する', ignoreLabel: '我慢してもらう', agreeHappiness: 5, ignoreHappiness: -4 },
  { id: 'safety',        icon: '🚨', text: '最近物騒で治安が心配…',                     agreeLabel: '警備を強化する', ignoreLabel: '放置する',     agreeHappiness: 7, ignoreHappiness: -6 },
  { id: 'school',        icon: '📚', text: '学校が足りなくて子供の教育が心配…',         agreeLabel: '増設を検討する', ignoreLabel: '我慢してもらう', agreeHappiness: 6, ignoreHappiness: -5 },
  { id: 'entertainment', icon: '🎪', text: '町に娯楽が少なくてつまらない…',             agreeLabel: 'イベントを開催', ignoreLabel: '我慢してもらう', agreeHappiness: 8, ignoreHappiness: -6 },
  { id: 'rent',          icon: '🏠', text: '家賃が高くて生活が苦しい…',                 agreeLabel: '補助金を出す',   ignoreLabel: '放置する',     agreeHappiness: 7, ignoreHappiness: -6 },
  { id: 'water',         icon: '🚰', text: '水道の水圧が弱くて困っている…',             agreeLabel: '設備を整備する', ignoreLabel: '我慢してもらう', agreeHappiness: 6, ignoreHappiness: -5 },
  { id: 'animal',        icon: '🦝', text: '野生動物が畑を荒らしている…',               agreeLabel: '対策をする',     ignoreLabel: '放っておく',   agreeHappiness: 5, ignoreHappiness: -4 },
  { id: 'graffiti',      icon: '🎨', text: '落書きが増えて景観が悪い…',                 agreeLabel: '美化活動をする', ignoreLabel: '放置する',     agreeHappiness: 5, ignoreHappiness: -4 },
  { id: 'wifi',          icon: '📶', text: '町のネット回線が遅すぎる…',                 agreeLabel: '回線を増強する', ignoreLabel: '我慢してもらう', agreeHappiness: 6, ignoreHappiness: -5 },
  { id: 'streetlight',   icon: '💡', text: '夜道が暗くて危ない…',                       agreeLabel: '街灯を増やす',   ignoreLabel: '放っておく',   agreeHappiness: 6, ignoreHappiness: -5 }
];

// 季節限定の陳情(agree=設備を導入する / ignore=我慢してもらう)。通常の陳情プールに合流する
const SEASONAL_COMPLAINTS = [
  { id: 'cold', season: 'winter', icon: '🥶', text: '寒すぎて凍えそう…暖房が欲しい…', agreeLabel: '暖房設備を導入する', ignoreLabel: '厚着で我慢してもらう', agreeHappiness: 10, ignoreHappiness: -8 },
  { id: 'heat', season: 'summer', icon: '🥵', text: '暑すぎて倒れそう…冷房が欲しい…', agreeLabel: '冷房設備を導入する', ignoreLabel: '我慢してもらう',       agreeHappiness: 10, ignoreHappiness: -8 }
];

// 病気イベントのバリエーション(フレーバー用)
const SICKNESS_EVENTS = [
  { name: '風邪',           icon: '🤧' },
  { name: 'インフルエンザ', icon: '🤒' },
  { name: '食あたり',       icon: '🤢' },
  { name: '流行り病',       icon: '😷' },
  { name: '花粉症',         icon: '🌼' }
];

// BGMトラック一覧。price:0は最初から解放済み。それ以外は資金で購入して解放する
const BGM_TRACKS = [
  { id: 'hitoyasumi',     name: 'ひとやすみ',   file: 'audio/hitoyasumi.mp3',     price: 0,     credit: 'MusMus' },
  { id: 'heiwa-na-machi', name: '平和な町',     file: 'audio/heiwa-na-machi.mp3', price: 3000,  credit: 'Mureka AI' },
  { id: 'rain-on-rhodes', name: 'Rain on Rhodes', file: 'audio/rain-on-rhodes.mp3', price: 20000, credit: 'Mureka AI' }
];

// 現在の季節(実時間の月から判定)。UIの演出と陳情の抽選の両方で共用する
function currentSeason() {
  const m = new Date().getMonth() + 1; // 1-12
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

// 市長ランク(称号)。累計資金のしきい値で昇進
const RANK_TIERS = [
  { min: 0,               title: '村長',         emoji: '🌾' },
  { min: 50000,           title: '町長',         emoji: '🏘️' },
  { min: 5000000,         title: '市長',         emoji: '🏙️' },
  { min: 500000000,       title: '県知事',       emoji: '🏯' },
  { min: 50000000000,     title: '総理大臣',     emoji: '🎩' },
  { min: 5000000000000,   title: '伝説の指導者', emoji: '👑' }
];
function rankIndexFor(lifetimeMoney) {
  let idx = 0;
  RANK_TIERS.forEach((r, i) => { if (lifetimeMoney >= r.min) idx = i; });
  return idx;
}

// デイリーミッションの候補プール。tierで報酬倍率が変わる
const MISSION_POOL = [
  { id: 'buy_small',   metric: 'buildingsBoughtToday', target: 5,    icon: '🏗️', tier: 1, label: (t) => `施設を${t}個購入する` },
  { id: 'buy_big',     metric: 'buildingsBoughtToday', target: 20,   icon: '🏗️', tier: 2, label: (t) => `施設を${t}個購入する` },
  { id: 'click_small', metric: 'clicksToday',          target: 50,   icon: '👆', tier: 1, label: (t) => `町役場を${t}回クリックする` },
  { id: 'click_big',   metric: 'clicksToday',          target: 200,  icon: '👆', tier: 2, label: (t) => `町役場を${t}回クリックする` },
  { id: 'earn',        metric: 'moneyEarnedToday',     target: null, icon: '💰', tier: 2, dynamicTarget: true, label: (t) => `${formatNum(t)}円稼ぐ` },
  { id: 'petition',    metric: 'petitionsToday',       target: 2,    icon: '📢', tier: 1, label: (t) => `陳情に${t}回応える` },
  { id: 'golden',      metric: 'goldenToday',          target: 1,    icon: '✨', tier: 2, label: (t) => `ゴールデンビルを${t}回クリックする` },
  { id: 'upgrade',     metric: 'upgradesToday',        target: 1,    icon: '⚡', tier: 1, label: (t) => `アップグレードを${t}個購入する` }
];

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
    [1000000000000000, '町を超えた存在'], [1000000000000000000, '神話級の富豪']
  ];
  moneyMilestones.forEach(([v, name]) => {
    list.push({
      id: `ach_money_${v}`, name: `💰 ${name}`,
      desc: `累計資金 ${formatNum(v)}円を達成`,
      check: (s) => s.lifetimeMoney >= v
    });
  });

  BUILDINGS.forEach((b) => {
    [1, 10, 25, 50, 100, 200, 500].forEach((n) => {
      list.push({
        id: `ach_build_${b.id}_${n}`, name: `${b.emoji} ${b.name}コレクター Lv.${n}`,
        desc: `${b.name}を${n}個所有する`,
        check: (s) => (s.buildings[b.id] || 0) >= n
      });
    });
  });

  const popMilestones = [50, 200, 1000, 5000, 20000, 100000, 500000];
  popMilestones.forEach((v) => {
    list.push({
      id: `ach_pop_${v}`, name: `👥 人口${formatNum(v)}人突破`,
      desc: `町の人口が${formatNum(v)}人に到達`,
      check: (s) => s.population >= v
    });
  });

  [1, 5, 10, 25, 50, 100].forEach((v) => {
    list.push({
      id: `ach_prestige_${v}`, name: `🌟 都市合併 ${v}回目`,
      desc: `都市合併を${v}回行う`,
      check: (s) => s.prestigeCount >= v
    });
  });

  [100, 1000, 10000, 50000, 100000, 500000, 1000000].forEach((v) => {
    list.push({
      id: `ach_click_${v}`, name: `👆 クリック${formatNum(v)}回`,
      desc: `町役場を${formatNum(v)}回クリックする`,
      check: (s) => s.totalClicks >= v
    });
  });

  [1, 10, 50, 100].forEach((v) => {
    list.push({
      id: `ach_golden_${v}`, name: `✨ ゴールデンビル${v}回ゲット`,
      desc: `ゴールデンビルを${v}回クリックする`,
      check: (s) => s.goldenClicks >= v
    });
  });

  [1, 10, 50, 100, 500].forEach((v) => {
    list.push({
      id: `ach_petition_${v}`, name: `📢 町民の声に応えた${v}回`,
      desc: `陳情に${v}回応える`,
      check: (s) => (s.petitionsAnswered || 0) >= v
    });
  });
  [1, 5, 20, 50].forEach((v) => {
    list.push({
      id: `ach_sickness_survived_${v}`, name: `😷 疫病を乗り越えた${v}回`,
      desc: `病気の流行を${v}回乗り越える`,
      check: (s) => (s.sicknessSurvived || 0) >= v
    });
  });
  [1, 10, 30, 100].forEach((v) => {
    list.push({
      id: `ach_sickness_cured_${v}`, name: `💉 医療キャンペーン${v}回実施`,
      desc: `治療キャンペーンで疫病を${v}回早期収束させる`,
      check: (s) => (s.sicknessCured || 0) >= v
    });
  });
  [1, 10, 50, 200].forEach((v) => {
    list.push({
      id: `ach_sickness_prevented_${v}`, name: `🏥 病気を未然に防いだ${v}回`,
      desc: `病院の力で疫病の流行を${v}回未然に防ぐ`,
      check: (s) => (s.sicknessPrevented || 0) >= v
    });
  });

  [1, 10, 50, 100].forEach((v) => {
    list.push({
      id: `ach_daily_${v}`, name: `📅 デイリーミッション${v}回達成`,
      desc: `デイリーミッションを合計${v}回達成する`,
      check: (s) => (s.dailyMissionsClaimed || 0) >= v
    });
  });
  [3, 7, 14, 30, 100, 365].forEach((v) => {
    list.push({
      id: `ach_streak_${v}`, name: `🔥 連続ログイン${v}日`,
      desc: `${v}日連続でログインする`,
      check: (s) => (s.loginStreak || 0) >= v
    });
  });
  if (BGM_TRACKS.length > 1) {
    list.push({ id: 'ach_bgm_collector', name: '🎶 BGMコレクター', desc: '全てのBGMトラックを解放する', check: (s) => (s.bgmUnlocked || []).length >= BGM_TRACKS.length });
  }
  BGM_TRACKS.filter((t) => t.price > 0).forEach((t) => {
    list.push({ id: `ach_bgm_${t.id}`, name: `🎵 BGM『${t.name}』解放`, desc: `BGM『${t.name}』を購入して解放する`, check: (s) => (s.bgmUnlocked || []).includes(t.id) });
  });
  list.push({ id: 'ach_rank_top', name: `👑 ${RANK_TIERS[RANK_TIERS.length - 1].title}に到達`, desc: `最高位の称号「${RANK_TIERS[RANK_TIERS.length - 1].title}」を獲得する`, check: (s) => rankIndexFor(s.lifetimeMoney) >= RANK_TIERS.length - 1 });
  list.push({ id: 'ach_season_cold', name: '🥶 冬の備え', desc: '冬の陳情で「暖房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('cold') });
  list.push({ id: 'ach_season_heat', name: '🥵 夏の備え', desc: '夏の陳情で「冷房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('heat') });

  list.push({ id: 'ach_happiness_100', name: '😊 幸福な町', desc: '幸福度100%以上を達成', check: (s) => s.happiness >= 100 });
  list.push({ id: 'ach_happiness_150', name: '😆 楽園都市', desc: '幸福度150%(上限)を達成', check: (s) => s.happiness >= 150 });
  list.push({ id: 'ach_all_buildings', name: '🏙️ フルコンプ都市', desc: '全ての施設を1つ以上所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1) });
  list.push({ id: 'ach_balanced_10', name: '⚖️ バランス都市', desc: '全ての施設を10個以上ずつ所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 10) });
  list.push({ id: 'ach_balanced_50', name: '🌈 万能都市', desc: '全ての施設を50個以上ずつ所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 50) });
  [
    [3600, '1h', '1時間'], [10800, '3h', '3時間'], [36000, '10h', '10時間'],
    [86400, '24h', '24時間'], [360000, '100h', '100時間']
  ].forEach(([sec, id, label]) => {
    list.push({ id: `ach_playtime_${id}`, name: `⏱️ 滞在${label}`, desc: `合計プレイ時間${label}を達成`, check: (s) => s.playtime >= sec });
  });
  list.push({ id: 'ach_ufo', name: '🛸 未確認飛行物体', desc: 'UFOをクリックする', check: (s) => s.ufoClicks >= 1 });
  [10, 100].forEach((v) => {
    list.push({ id: `ach_ufo_${v}`, name: `🛸 UFOハンター${v}回`, desc: `UFOを${v}回クリックする`, check: (s) => s.ufoClicks >= v });
  });

  // 施設の合計所有数(種類を問わず町全体の建物数)
  [100, 500, 1000, 5000, 20000, 100000].forEach((v) => {
    list.push({
      id: `ach_total_buildings_${v}`, name: `🏘️ 町の施設数${formatNum(v)}突破`,
      desc: `所有する施設の合計が${formatNum(v)}個に到達`,
      check: (s) => Object.values(s.buildings || {}).reduce((a, b) => a + b, 0) >= v
    });
  });

  // アップグレード購入数
  const totalUpgrades = UPGRADES.length;
  [5, 20, 50, totalUpgrades].forEach((v, i, arr) => {
    // 重複除去(施設数が少ない環境でもtotalUpgradesが手前のマイルストーンと被らないように)
    if (i > 0 && v <= arr[i - 1]) return;
    const isAll = v === totalUpgrades;
    list.push({
      id: `ach_upgrades_${v}`, name: isAll ? '⚡ アップグレード完全制覇' : `⚡ アップグレード収集家 Lv.${i + 1}`,
      desc: isAll ? `全${totalUpgrades}種のアップグレードを購入する` : `アップグレードを合計${v}個購入する`,
      check: (s) => (s.upgrades || []).length >= v
    });
  });

  // 陳情を突っぱねた回数(強気の町政)
  [1, 10, 50, 200].forEach((v) => {
    list.push({
      id: `ach_petition_ignored_${v}`, name: `🙅 突っぱねる町政${v}回`,
      desc: `陳情を${v}回突っぱねる`,
      check: (s) => (s.petitionsIgnored || 0) >= v
    });
  });

  // 都市合併で得た累計名声ポイント
  [10, 50, 200, 1000, 5000, 20000].forEach((v) => {
    list.push({
      id: `ach_fame_${v}`, name: `🎖️ 名声ポイント${formatNum(v)}突破`,
      desc: `都市合併で得た名声ポイントが累計${formatNum(v)}に到達`,
      check: (s) => (s.famePoints || 0) >= v
    });
  });

  // 手元資金(使わずに貯めた現在の所持金)
  const cashMilestones = [
    [100000, '節約家'], [10000000, '貯蓄家'], [1000000000, '大富豪の懐'],
    [100000000000, '金庫番'], [10000000000000, '揺るぎない財力']
  ];
  cashMilestones.forEach(([v, name]) => {
    list.push({
      id: `ach_cash_${v}`, name: `💵 ${name}`,
      desc: `所持金${formatNum(v)}円を貯める(使わずに保持)`,
      check: (s) => s.money >= v
    });
  });

  // 冬夏どちらの季節陳情にも対応した町
  list.push({ id: 'ach_season_both', name: '🌦️ 全天候対応都市', desc: '冬と夏、両方の季節限定陳情に設備で対応する', check: (s) => (s.seasonalComplaintsResolved || []).includes('cold') && (s.seasonalComplaintsResolved || []).includes('heat') });

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
