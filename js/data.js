// タウンDELUXE ゲームデータ定義

const COST_MULT = 1.15;

// 施設定義: id, 名前, 絵文字, 基礎コスト, 基礎収入/秒, 人口寄与, 幸福度寄与, 説明
const BUILDINGS = [
  { id: 'house',          name: '家',            emoji: '🏠', baseCost: 15,                  baseIncome: 0.1,        pop: 2,    happiness: 0,   desc: '町の住民が暮らす家。少しずつ資金を稼ぐ。' },
  { id: 'yatai',          name: '屋台',          emoji: '🍢', baseCost: 45,                  baseIncome: 0.37,       pop: 1,    happiness: 1,   desc: '香ばしい匂いで人を集める屋台グルメ。手軽に稼げる。' },
  { id: 'farm',           name: '畑',            emoji: '🌾', baseCost: 100,                 baseIncome: 1,          pop: 1,    happiness: 0,   desc: '作物を育てて売る。雨の日は収穫アップ。' },
  { id: 'bakery',         name: 'パン屋',        emoji: '🥐', baseCost: 300,                 baseIncome: 1.7,        pop: 2,    happiness: 1,   desc: '焼きたてパンの香りが漂う人気店。住民の朝を彩る。' },
  { id: 'park',           name: '公園',          emoji: '🌳', baseCost: 600,                 baseIncome: 2,          pop: 0,    happiness: 3,   desc: '住民の幸福度がアップする憩いの場。' },
  { id: 'shop',           name: '商店',          emoji: '🏪', baseCost: 1100,                baseIncome: 8,          pop: 3,    happiness: 0,   desc: '住民に商品を売って稼ぐ。' },
  { id: 'library',        name: '図書館',        emoji: '📚', baseCost: 4000,                baseIncome: 8,          pop: 2,    happiness: 5,   desc: '静かに知識を育む図書館。幸福度をじっくり底上げ。' },
  { id: 'school',         name: '学校',          emoji: '🏫', baseCost: 12000,               baseIncome: 47,         pop: 6,    happiness: 2,   desc: '教育で幸福度も少しアップ。' },
  { id: 'cafe',           name: 'カフェ',        emoji: '☕', baseCost: 40000,               baseIncome: 114,        pop: 4,    happiness: 2,   desc: '香り高いコーヒーで一息つける憩いの場所。' },
  { id: 'factory',        name: '工場',          emoji: '🏭', baseCost: 130000,               baseIncome: 260,        pop: 9,    happiness: -1,  desc: '大量生産できるがちょっとうるさい。' },
  { id: 'power_plant',    name: '発電所',        emoji: '⚡', baseCost: 450000,               baseIncome: 643,        pop: 6,    happiness: -2,  desc: '町の電力をまかなう大型施設。稼ぐが少し環境に負担。' },
  { id: 'hospital',       name: '病院',          emoji: '🏥', baseCost: 1400000,              baseIncome: 1400,       pop: 12,   happiness: 2,   desc: '住民の健康を守る安心施設。多いほど病気の流行を未然に防ぐ。' },
  { id: 'fire_station',   name: '消防署',        emoji: '🚒', baseCost: 5000000,              baseIncome: 3125,       pop: 9,    happiness: 3,   desc: '火事や事故から町を守る。住民の安心感がアップ。' },
  { id: 'station',        name: '駅',            emoji: '🚉', baseCost: 20000000,             baseIncome: 7800,       pop: 18,   happiness: 1,   desc: '人の流れを生み出す交通の要。' },
  { id: 'bank',           name: '銀行',          emoji: '🏦', baseCost: 70000000,             baseIncome: 16000,      pop: 14,   happiness: 0,   desc: '町のお金を管理する金融機関。着実に利益を生む。' },
  { id: 'amusement',      name: '遊園地',        emoji: '🎡', baseCost: 330000000,            baseIncome: 44000,      pop: 30,   happiness: 6,   desc: '町いちばんの人気スポット。' },
  { id: 'museum',         name: '美術館',        emoji: '🖼️', baseCost: 1200000000,           baseIncome: 99000,      pop: 22,   happiness: 8,   desc: '名画が並ぶ文化の殿堂。町の品格と幸福度が上がる。' },
  { id: 'office',         name: 'オフィスビル',   emoji: '🏢', baseCost: 5100000000,           baseIncome: 260000,     pop: 55,   happiness: 0,   desc: '高層ビルで一気にビジネス拡大。' },
  { id: 'university',     name: '大学',          emoji: '🎓', baseCost: 18000000000,          baseIncome: 594000,     pop: 38,   happiness: 3,   desc: '最先端の研究が進む高等学府。町の未来を切り拓く。' },
  { id: 'stadium',        name: 'スタジアム',     emoji: '🏟️', baseCost: 75000000000,          baseIncome: 1600000,    pop: 90,   happiness: 4,   desc: '大きなイベントで町が盛り上がる。' },
  { id: 'airport',        name: '空港',          emoji: '✈️', baseCost: 260000000000,         baseIncome: 3800000,    pop: 65,   happiness: 1,   desc: '世界中から人と物を呼び込む国際的な玄関口。' },
  { id: 'skyscraper',     name: '摩天楼',        emoji: '🌆', baseCost: 1000000000000,        baseIncome: 10000000,   pop: 160,  happiness: 2,   desc: '町のシンボルとなる超高層タワー。' },
  { id: 'aquarium',       name: '水族館',        emoji: '🐬', baseCost: 3600000000000,        baseIncome: 24500000,   pop: 110,  happiness: 9,   desc: '幻想的な海の世界。家族連れに大人気の癒やしスポット。' },
  { id: 'castle',         name: '城',            emoji: '🏰', baseCost: 14000000000000,       baseIncome: 65000000,   pop: 400,  happiness: 10,  desc: '伝説の城。首都の証。' },
  { id: 'space_center',   name: '宇宙基地',      emoji: '🚀', baseCost: 50000000000000,       baseIncome: 122000000,  pop: 700,  happiness: 5,   desc: 'ロケットが飛び立つ町の誇り。宇宙時代の幕開け。' },
  { id: 'future_dome',    name: '未来都市ドーム', emoji: '🔮', baseCost: 180000000000000,      baseIncome: 231500000,  pop: 1300, happiness: 8,   desc: 'テクノロジーの結晶。ドームの中に理想郷が広がる。' },
  { id: 'lunar_city',     name: '月面都市',      emoji: '🌕', baseCost: 650000000000000,      baseIncome: 440000000,  pop: 2400, happiness: 12,  desc: '地球を離れ月に築いた入植都市。人類の新たな一歩。' },
  { id: 'galaxy_station',  name: '銀河ステーション', emoji: '🌌', baseCost: 2400000000000000,   baseIncome: 855000000,  pop: 4500, happiness: 15,  desc: '銀河の彼方まで町の名を轟かせる究極の到達点。' }
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

// 名声ショップ: 都市合併で得た名声ポイントを使って買う恒久アップグレード(合併しても失われない)。
// tierは解放に必要な累計都市合併回数(FAME_SHOP_TIER_REQUIREMENTのインデックスに対応)で、
// 周回(都市合併)を重ねるほど新しいティアが開放されていくエンドコンテンツ。
const FAME_SHOP_TIER_REQUIREMENT = [0, 3, 7, 15];
const FAME_SHOP = [
  // Tier 1: いつでも購入可(名声ポイントさえあれば)
  { id: 'fame_income_1',  tier: 0, cost: 5,   name: '💹 効率化都市計画 I',   desc: '全施設の収入が永久に+10%される。',                       effect: { type: 'incomeMult', value: 1.10 } },
  { id: 'fame_click_1',   tier: 0, cost: 5,   name: '👆 熟練の握手',         desc: '町役場クリックの獲得資金が永久に+20%される。',             effect: { type: 'clickMult', value: 1.20 } },
  { id: 'fame_petition_1',tier: 0, cost: 8,   name: '😊 御用聞きの心得',     desc: '陳情に応えた時の幸福度上昇が永久に+20%される。',           effect: { type: 'petitionAgreeMult', value: 1.20 } },
  { id: 'fame_rain_1',    tier: 0, cost: 8,   name: '☀️ 気象予報士常駐',     desc: '恵みの雨イベントが永久に約25%発生しやすくなる。',           effect: { type: 'rainFreqMult', value: 0.75 } },
  // Tier 2: 都市合併3回で解放
  { id: 'fame_income_2',  tier: 1, cost: 20,  name: '💹 効率化都市計画 II',  desc: '全施設の収入が永久にさらに+15%される。',                   effect: { type: 'incomeMult', value: 1.15 } },
  { id: 'fame_offline_1', tier: 1, cost: 25,  name: '🌙 越境オフライン協定', desc: 'オフライン収益の上限が8時間→16時間に延長される。',           effect: { type: 'offlineCapHours', value: 16 } },
  { id: 'fame_hospital_1',tier: 1, cost: 25,  name: '🛡️ 医療ネットワーク強化', desc: '病院による病気予防の効果が永久に+30%される。',            effect: { type: 'preventionMult', value: 1.30 } },
  { id: 'fame_golden_1',  tier: 1, cost: 20,  name: '✨ ゴールデンタイム延長', desc: 'ゴールデンビルの出現時間が永久に+50%延長される。',         effect: { type: 'goldenDurationMult', value: 1.5 } },
  // Tier 3: 都市合併7回で解放
  { id: 'fame_income_3',  tier: 2, cost: 60,  name: '💹 効率化都市計画 III', desc: '全施設の収入が永久にさらに+20%される。',                   effect: { type: 'incomeMult', value: 1.20 } },
  { id: 'fame_autobuy',   tier: 2, cost: 80,  name: '🤖 執事の自動購入',     desc: '買える中で最も安い施設を自動で購入してくれる執事を雇う。',   effect: { type: 'autoBuy', value: true } },
  { id: 'fame_offline_2', tier: 2, cost: 60,  name: '🌙 越境オフライン協定 II', desc: 'オフライン収益の上限が16時間→24時間に延長される。',      effect: { type: 'offlineCapHours', value: 24 } },
  { id: 'fame_golden_2',  tier: 2, cost: 50,  name: '✨ ゴールデンビル頻発', desc: 'ゴールデンビルが永久に約20%出現しやすくなる。',            effect: { type: 'goldenFreqMult', value: 0.8 } },
  // Tier 4: 都市合併15回で解放(真のエンドコンテンツ)
  { id: 'fame_income_4',  tier: 3, cost: 200, name: '💹 効率化都市計画 IV',  desc: '全施設の収入が永久にさらに+30%される。',                   effect: { type: 'incomeMult', value: 1.30 } },
  { id: 'fame_happiness_1',tier: 3, cost: 250, name: '🌌 銀河評議会の椅子', desc: '町の幸福度基準値が永久に+15される。',                     effect: { type: 'happinessBonusFlat', value: 15 } },
  { id: 'fame_prestige_th',tier: 3, cost: 300, name: '👑 伝説の統治',       desc: '都市合併に必要な累計資金がずっと10%引き下げられる。',       effect: { type: 'prestigeThresholdMult', value: 0.9 } }
];
function fameShopTierUnlocked(tier, prestigeCount) {
  return prestigeCount >= FAME_SHOP_TIER_REQUIREMENT[tier];
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

  [1, 10, 50, 100].forEach((v) => {
    list.push({
      id: `ach_petition_${v}`, name: `📢 町民の声に応えた${v}回`,
      desc: `陳情に${v}回応える`,
      check: (s) => (s.petitionsAnswered || 0) >= v
    });
  });
  [1, 5, 20].forEach((v) => {
    list.push({
      id: `ach_sickness_survived_${v}`, name: `😷 疫病を乗り越えた${v}回`,
      desc: `病気の流行を${v}回乗り越える`,
      check: (s) => (s.sicknessSurvived || 0) >= v
    });
  });
  [1, 10, 30].forEach((v) => {
    list.push({
      id: `ach_sickness_cured_${v}`, name: `💉 医療キャンペーン${v}回実施`,
      desc: `治療キャンペーンで疫病を${v}回早期収束させる`,
      check: (s) => (s.sicknessCured || 0) >= v
    });
  });
  [1, 10, 50].forEach((v) => {
    list.push({
      id: `ach_sickness_prevented_${v}`, name: `🏥 病気を未然に防いだ${v}回`,
      desc: `病院の力で疫病の流行を${v}回未然に防ぐ`,
      check: (s) => (s.sicknessPrevented || 0) >= v
    });
  });

  [1, 10, 50].forEach((v) => {
    list.push({
      id: `ach_daily_${v}`, name: `📅 デイリーミッション${v}回達成`,
      desc: `デイリーミッションを合計${v}回達成する`,
      check: (s) => (s.dailyMissionsClaimed || 0) >= v
    });
  });
  [3, 7, 14, 30, 100].forEach((v) => {
    list.push({
      id: `ach_streak_${v}`, name: `🔥 連続ログイン${v}日`,
      desc: `${v}日連続でログインする`,
      check: (s) => (s.loginStreak || 0) >= v
    });
  });
  if (BGM_TRACKS.length > 1) {
    list.push({ id: 'ach_bgm_collector', name: '🎶 BGMコレクター', desc: '全てのBGMトラックを解放する', check: (s) => (s.bgmUnlocked || []).length >= BGM_TRACKS.length });
  }
  list.push({ id: 'ach_fame_shop_complete', name: '💎 名声の頂点', desc: '名声ショップの全アップグレードを取得する', check: (s) => (s.fameShopUpgrades || []).length >= FAME_SHOP.length });
  list.push({ id: 'ach_rank_top', name: `👑 ${RANK_TIERS[RANK_TIERS.length - 1].title}に到達`, desc: `最高位の称号「${RANK_TIERS[RANK_TIERS.length - 1].title}」を獲得する`, check: (s) => rankIndexFor(s.lifetimeMoney) >= RANK_TIERS.length - 1 });
  list.push({ id: 'ach_season_cold', name: '🥶 冬の備え', desc: '冬の陳情で「暖房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('cold') });
  list.push({ id: 'ach_season_heat', name: '🥵 夏の備え', desc: '夏の陳情で「冷房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('heat') });

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
