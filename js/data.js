// タウンDELUXE ゲームデータ定義

const COST_MULT = 1.15;

// 施設定義: id, 名前, 絵文字, 基礎コスト, 基礎収入/秒, 人口寄与, 幸福度寄与, 説明
const BUILDINGS = [
  { id: 'house',          name: '家',            emoji: '🏠', baseCost: 15,                  baseIncome: 0.1,        pop: 2,    happiness: 0,   desc: '町の住民が暮らす家。少しずつ資金を稼ぐ。' },
  { id: 'post_office',    name: '郵便局',        emoji: '📮', baseCost: 26,                  baseIncome: 0.19,       pop: 1,    happiness: 1,   desc: '手紙や小包を町中に届ける郵便局。住民の声も早めに拾い上げ、陳情の発生を少し抑える。', prevention: { petition: 0.02 } },
  { id: 'yatai',          name: '屋台',          emoji: '🍢', baseCost: 45,                  baseIncome: 0.37,       pop: 1,    happiness: 1,   desc: '香ばしい匂いで人を集める屋台グルメ。手軽に稼げる。' },
  { id: 'dagashiya',      name: '駄菓子屋',      emoji: '🍬', baseCost: 67,                  baseIncome: 0.6,        pop: 1,    happiness: 2,   desc: '懐かしい駄菓子が並ぶ子供たちの楽園。' },
  { id: 'farm',           name: '畑',            emoji: '🌾', baseCost: 100,                 baseIncome: 1,          pop: 1,    happiness: 0,   desc: '作物を育てて売る。雨の日は収穫アップ。' },
  { id: 'public_toilet',  name: '公衆トイレ',    emoji: '🚻', baseCost: 130,                 baseIncome: 1.14,       pop: 0,    happiness: 2,   desc: '町の至る所にある公衆トイレ。清潔さが住民の満足度を支える。' },
  { id: 'liquor_shop',    name: '酒屋',          emoji: '🍶', baseCost: 170,                 baseIncome: 1.3,        pop: 1,    happiness: 0,   desc: '地元で愛される酒屋。夜の町に賑わいを添える。' },
  { id: 'taiyaki',        name: 'たい焼き屋',    emoji: '🐟', baseCost: 230,                 baseIncome: 1.49,       pop: 1,    happiness: 2,   desc: 'あつあつのたい焼きが評判の屋台。行列ができることも。' },
  { id: 'bakery',         name: 'パン屋',        emoji: '🥐', baseCost: 300,                 baseIncome: 1.7,        pop: 2,    happiness: 1,   desc: '焼きたてパンの香りが漂う人気店。住民の朝を彩る。' },
  { id: 'flower_shop',    name: '花屋',          emoji: '💐', baseCost: 420,                 baseIncome: 1.8,        pop: 1,    happiness: 2,   desc: '色とりどりの花が並ぶ花屋。町に彩りを添える。' },
  { id: 'park',           name: '公園',          emoji: '🌳', baseCost: 600,                 baseIncome: 2,          pop: 0,    happiness: 3,   desc: '住民の幸福度がアップする憩いの場。' },
  { id: 'bathhouse',      name: '銭湯',          emoji: '♨️', baseCost: 810,                 baseIncome: 4,          pop: 2,    happiness: 3,   desc: '疲れを癒す昔ながらの銭湯。住民の憩いの場。' },
  { id: 'shop',           name: '商店',          emoji: '🏪', baseCost: 1100,                baseIncome: 8,          pop: 3,    happiness: 0,   desc: '住民に商品を売って稼ぐ。' },
  { id: 'antique_shop',   name: '骨董品店',      emoji: '🏺', baseCost: 1500,                baseIncome: 7.75,       pop: 2,    happiness: 1,   desc: '掘り出し物が見つかるかもしれない骨董品店。' },
  { id: 'bookstore',      name: '書店',          emoji: '📖', baseCost: 2100,                baseIncome: 7.5,        pop: 2,    happiness: 1,   desc: '本の香りに包まれる町の書店。知的好奇心を満たす。' },
  { id: 'music_shop',     name: '楽器店',        emoji: '🎸', baseCost: 2900,                baseIncome: 7.75,       pop: 2,    happiness: 2,   desc: '音楽好きが集う楽器店。町に音色を響かせる。' },
  { id: 'library',        name: '図書館',        emoji: '📚', baseCost: 4000,                baseIncome: 8,          pop: 2,    happiness: 5,   desc: '静かに知識を育む図書館。幸福度をじっくり底上げ。' },
  { id: 'fire_brigade',   name: '消防団詰所',    emoji: '🧯', baseCost: 5300,                baseIncome: 12.3,       pop: 2,    happiness: 2,   desc: '地域の消防団が待機する詰所。初期消火で火事の被害を抑える。', prevention: { fire: 0.03 } },
  { id: 'police_box',     name: '交番',          emoji: '🚓', baseCost: 6900,                baseIncome: 19,         pop: 2,    happiness: 2,   desc: '町の安全を見守る交番。空き巣などの犯罪を未然に防ぐ。', prevention: { crime: 0.08 } },
  { id: 'kids_center',    name: '児童館',        emoji: '🧸', baseCost: 9100,                baseIncome: 29.9,       pop: 3,    happiness: 3,   desc: '子供たちが安心して遊べる児童館。' },
  { id: 'school',         name: '学校',          emoji: '🏫', baseCost: 12000,               baseIncome: 47,         pop: 6,    happiness: 2,   desc: '教育で幸福度も少しアップ。' },
  { id: 'cram_school',    name: '学習塾',        emoji: '✏️', baseCost: 16000,               baseIncome: 58.6,       pop: 3,    happiness: 1,   desc: '受験勉強に励む子供たちが通う学習塾。' },
  { id: 'salon',          name: '美容院',        emoji: '💇', baseCost: 22000,               baseIncome: 73,         pop: 3,    happiness: 1,   desc: 'おしゃれを楽しむ美容院。住民の気分も明るくなる。' },
  { id: 'sweets_shop',    name: 'スイーツ専門店', emoji: '🍰', baseCost: 30000,               baseIncome: 91.2,       pop: 3,    happiness: 3,   desc: '色とりどりのスイーツが並ぶ専門店。町に甘い誘惑を。' },
  { id: 'cafe',           name: 'カフェ',        emoji: '☕', baseCost: 40000,               baseIncome: 114,        pop: 4,    happiness: 2,   desc: '香り高いコーヒーで一息つける憩いの場所。' },
  { id: 'record_shop',    name: 'レコード店',    emoji: '💿', baseCost: 54000,               baseIncome: 140,        pop: 3,    happiness: 2,   desc: '懐かしい音楽が流れるレコード店。' },
  { id: 'cinema',         name: '映画館',        emoji: '🎬', baseCost: 72000,               baseIncome: 172,        pop: 4,    happiness: 3,   desc: '大画面で物語に浸れる映画館。週末の人気スポット。' },
  { id: 'printing_plant', name: '印刷工場',      emoji: '🖨️', baseCost: 97000,               baseIncome: 212,        pop: 6,    happiness: 0,   desc: '町の広報物やチラシを刷る印刷工場。' },
  { id: 'factory',        name: '工場',          emoji: '🏭', baseCost: 130000,               baseIncome: 260,        pop: 9,    happiness: -1,  desc: '大量生産できるがちょっとうるさい。' },
  { id: 'brewery',        name: '醸造所',        emoji: '🍺', baseCost: 180000,               baseIncome: 326,        pop: 5,    happiness: 1,   desc: '地ビールを醸造する工房。地元で人気の一杯。' },
  { id: 'bowling',        name: 'ボウリング場',  emoji: '🎳', baseCost: 240000,               baseIncome: 409,        pop: 5,    happiness: 2,   desc: 'ピンが弾ける音が響くボウリング場。家族連れに人気。' },
  { id: 'tennis_club',    name: 'テニスクラブ',  emoji: '🎾', baseCost: 330000,               baseIncome: 513,        pop: 6,    happiness: 3,   desc: '爽やかな汗を流せるテニスクラブ。' },
  { id: 'power_plant',    name: '発電所',        emoji: '⚡', baseCost: 450000,               baseIncome: 643,        pop: 6,    happiness: -2,  desc: '町の電力をまかなう大型施設。稼ぐが少し環境に負担。' },
  { id: 'vet_clinic',     name: '動物病院',      emoji: '🐾', baseCost: 790000,               baseIncome: 949,        pop: 4,    happiness: 2,   desc: 'ペットたちの健康を守る動物病院。地域の衛生意識も高め、疫病予防に少し貢献する。', prevention: { sickness: 0.03 } },
  { id: 'rehab_center',   name: 'リハビリセンター', emoji: '🦽', baseCost: 1100000,           baseIncome: 1153,       pop: 6,    happiness: 2,   desc: '怪我や病気からの社会復帰を支えるリハビリセンター。', prevention: { sickness: 0.02 } },
  { id: 'hospital',       name: '病院',          emoji: '🏥', baseCost: 1400000,              baseIncome: 1400,       pop: 12,   happiness: 2,   desc: '住民の健康を守る安心施設。多いほど病気の流行を未然に防ぐ。', prevention: { sickness: 0.12 } },
  { id: 'health_center',  name: '保健所',        emoji: '🩺', baseCost: 2100000,              baseIncome: 1830,       pop: 5,    happiness: 1,   desc: '住民の健康相談や予防接種を行う保健所。疫病の予防に力を発揮する。', prevention: { sickness: 0.06 } },
  { id: 'blood_center',   name: '献血センター',  emoji: '🩸', baseCost: 2600000,              baseIncome: 2091,       pop: 5,    happiness: 1,   desc: '住民の善意が集まる献血センター。医療を静かに支える。', prevention: { sickness: 0.02 } },
  { id: 'arcade',         name: 'ゲームセンター', emoji: '🕹️', baseCost: 3300000,              baseIncome: 2390,       pop: 6,    happiness: 3,   desc: '光と音が溢れるゲームセンター。若者たちの溜まり場。' },
  { id: 'karaoke',        name: 'カラオケボックス', emoji: '🎤', baseCost: 4100000,            baseIncome: 2733,       pop: 6,    happiness: 3,   desc: '大声で歌ってストレス発散できるカラオケボックス。' },
  { id: 'fire_station',   name: '消防署',        emoji: '🚒', baseCost: 5000000,              baseIncome: 3125,       pop: 9,    happiness: 3,   desc: '火事や事故から町を守る。住民の安心感がアップ。', prevention: { fire: 0.10 } },
  { id: 'recycling_plant',name: '清掃工場',      emoji: '♻️', baseCost: 10000000,             baseIncome: 4930,       pop: 8,    happiness: 1,   desc: '町のゴミを処理してきれいな環境を保つ。' },
  { id: 'station',        name: '駅',            emoji: '🚉', baseCost: 20000000,             baseIncome: 7800,       pop: 18,   happiness: 1,   desc: '人の流れを生み出す交通の要。' },
  { id: 'bus_terminal',   name: 'バスターミナル', emoji: '🚌', baseCost: 27000000,             baseIncome: 9347,       pop: 20,   happiness: 1,   desc: '町中を結ぶバス路線の拠点。' },
  { id: 'mall',           name: 'ショッピングモール', emoji: '🛍️', baseCost: 37000000,        baseIncome: 11200,      pop: 16,   happiness: 3,   desc: '何でも揃う大型商業施設。町の消費を一手に担う。' },
  { id: 'accounting_firm',name: '会計事務所',    emoji: '🧾', baseCost: 51000000,             baseIncome: 13390,      pop: 15,   happiness: 0,   desc: '町の経理や税務を支える会計事務所。財政相談に応じ、陳情の発生を抑える。', prevention: { petition: 0.05 } },
  { id: 'bank',           name: '銀行',          emoji: '🏦', baseCost: 70000000,             baseIncome: 16000,      pop: 14,   happiness: 0,   desc: '町のお金を管理する金融機関。着実に利益を生む。' },
  { id: 'gym',            name: 'フィットネスジム', emoji: '💪', baseCost: 150000000,          baseIncome: 26500,      pop: 12,   happiness: 2,   desc: '汗を流して心身を鍛えるジム。住民の健康を支える。' },
  { id: 'spa_resort',     name: 'スパリゾート',  emoji: '🧖', baseCost: 220000000,            baseIncome: 34150,      pop: 18,   happiness: 4,   desc: '心と体を癒すスパリゾート。' },
  { id: 'amusement',      name: '遊園地',        emoji: '🎡', baseCost: 330000000,            baseIncome: 44000,      pop: 30,   happiness: 6,   desc: '町いちばんの人気スポット。' },
  { id: 'planetarium',    name: 'プラネタリウム', emoji: '🔭', baseCost: 460000000,            baseIncome: 53890,      pop: 16,   happiness: 5,   desc: '満天の星を映し出すプラネタリウム。' },
  { id: 'waterworks',     name: '水道局',        emoji: '🚰', baseCost: 630000000,            baseIncome: 66000,      pop: 14,   happiness: 0,   desc: '町の水道インフラを管理する重要拠点。' },
  { id: 'museum',         name: '美術館',        emoji: '🖼️', baseCost: 1200000000,           baseIncome: 99000,      pop: 22,   happiness: 8,   desc: '名画が並ぶ文化の殿堂。町の品格と幸福度が上がる。' },
  { id: 'theater',        name: '劇場',          emoji: '🎭', baseCost: 1700000000,           baseIncome: 125900,     pop: 24,   happiness: 6,   desc: '舞台役者たちの熱演が観られる劇場。' },
  { id: 'concert_hall',   name: 'コンサートホール', emoji: '🎻', baseCost: 2500000000,        baseIncome: 160000,     pop: 25,   happiness: 5,   desc: '美しい音楽が響き渡るホール。文化の香り高い施設。' },
  { id: 'office',         name: 'オフィスビル',   emoji: '🏢', baseCost: 5100000000,           baseIncome: 260000,     pop: 55,   happiness: 0,   desc: '高層ビルで一気にビジネス拡大。' },
  { id: 'redevelopment',  name: '再開発地区',    emoji: '📐', baseCost: 7000000000,           baseIncome: 319700,     pop: 45,   happiness: 1,   desc: '古い街並みを一新する再開発地区。ビジネスの新拠点に。' },
  { id: 'highway',        name: '高速道路インター', emoji: '🛣️', baseCost: 9600000000,        baseIncome: 393000,     pop: 30,   happiness: 0,   desc: '町と外の世界を繋ぐ高速道路の玄関口。' },
  { id: 'university',     name: '大学',          emoji: '🎓', baseCost: 18000000000,          baseIncome: 594000,     pop: 38,   happiness: 3,   desc: '最先端の研究が進む高等学府。町の未来を切り拓く。' },
  { id: 'research_city',  name: '研究学園都市',  emoji: '🧪', baseCost: 26000000000,          baseIncome: 761000,     pop: 40,   happiness: 2,   desc: '最先端の研究機関が集う学園都市。' },
  { id: 'data_center',    name: 'データセンター', emoji: '💾', baseCost: 37000000000,          baseIncome: 975000,     pop: 35,   happiness: 0,   desc: '膨大なデータを処理する町のデジタル中枢。' },
  { id: 'stadium',        name: 'スタジアム',     emoji: '🏟️', baseCost: 75000000000,          baseIncome: 1600000,    pop: 90,   happiness: 4,   desc: '大きなイベントで町が盛り上がる。' },
  { id: 'esports_arena',  name: 'eスポーツアリーナ', emoji: '🎮', baseCost: 100000000000,      baseIncome: 1984000,    pop: 70,   happiness: 5,   desc: '世界大会も開かれるeスポーツの聖地。' },
  { id: 'port',           name: '港湾ターミナル', emoji: '⚓', baseCost: 140000000000,         baseIncome: 2460000,    pop: 45,   happiness: 2,   desc: '船が行き交う港。貿易で町を潤す。' },
  { id: 'airport',        name: '空港',          emoji: '✈️', baseCost: 260000000000,         baseIncome: 3800000,    pop: 65,   happiness: 1,   desc: '世界中から人と物を呼び込む国際的な玄関口。' },
  { id: 'logistics_hub',  name: '物流センター',  emoji: '📦', baseCost: 360000000000,         baseIncome: 4838000,    pop: 50,   happiness: 0,   desc: '世界中の物資が行き交う巨大物流拠点。' },
  { id: 'stock_exchange', name: '証券取引所',    emoji: '📈', baseCost: 510000000000,         baseIncome: 6160000,    pop: 55,   happiness: 0,   desc: '資本が動く証券取引所。町の経済の中心。' },
  { id: 'skyscraper',     name: '摩天楼',        emoji: '🌆', baseCost: 1000000000000,        baseIncome: 10000000,   pop: 160,  happiness: 2,   desc: '町のシンボルとなる超高層タワー。' },
  { id: 'tower_condo',    name: 'タワーマンション', emoji: '🏙️', baseCost: 1400000000000,     baseIncome: 12490000,   pop: 220,  happiness: 1,   desc: '空へ伸びる超高層マンション。多くの住民が暮らす。' },
  { id: 'monorail',       name: 'モノレール',    emoji: '🚝', baseCost: 1900000000000,        baseIncome: 15600000,   pop: 75,   happiness: 3,   desc: '空中を走るモノレール。町の新しい足として活躍。' },
  { id: 'aquarium',       name: '水族館',        emoji: '🐬', baseCost: 3600000000000,        baseIncome: 24500000,   pop: 110,  happiness: 9,   desc: '幻想的な海の世界。家族連れに大人気の癒やしスポット。' },
  { id: 'cruise_terminal',name: '遊覧船ターミナル', emoji: '🛳️', baseCost: 5100000000000,     baseIncome: 31270000,   pop: 95,   happiness: 4,   desc: '海をゆく豪華な遊覧船が発着するターミナル。' },
  { id: 'subway',         name: '地下鉄網',      emoji: '🚇', baseCost: 7100000000000,        baseIncome: 39900000,   pop: 130,  happiness: 2,   desc: '地下に張り巡らされた鉄道網。大量輸送を支える。' },
  { id: 'castle',         name: '城',            emoji: '🏰', baseCost: 14000000000000,       baseIncome: 65000000,   pop: 400,  happiness: 10,  desc: '伝説の城。首都の証。' },
  { id: 'guest_house',    name: '迎賓館',        emoji: '🏵️', baseCost: 19000000000000,       baseIncome: 76060000,   pop: 280,  happiness: 7,   desc: '国内外の要人をもてなす格式高い迎賓館。' },
  { id: 'convention',     name: '国際会議場',    emoji: '🏛️', baseCost: 26000000000000,       baseIncome: 89000000,   pop: 220,  happiness: 6,   desc: '世界中から要人が集う国際会議場。町の名を世界へ。' },
  { id: 'space_center',   name: '宇宙基地',      emoji: '🚀', baseCost: 50000000000000,       baseIncome: 122000000,  pop: 700,  happiness: 5,   desc: 'ロケットが飛び立つ町の誇り。宇宙時代の幕開け。' },
  { id: 'exploration_fleet', name: '惑星探査船団', emoji: '☄️', baseCost: 69000000000000,     baseIncome: 143200000,  pop: 550,  happiness: 4,   desc: '太陽系の彼方へ旅立つ探査船団の母港。' },
  { id: 'space_elevator', name: '軌道エレベーター', emoji: '🛰️', baseCost: 95000000000000,    baseIncome: 168000000,  pop: 450,  happiness: 4,   desc: '宇宙まで一直線に伸びる夢の設備。' },
  { id: 'future_dome',    name: '未来都市ドーム', emoji: '🔮', baseCost: 180000000000000,      baseIncome: 231500000,  pop: 1300, happiness: 8,   desc: 'テクノロジーの結晶。ドームの中に理想郷が広がる。' },
  { id: 'mars_colony',    name: '火星コロニー',  emoji: '🪐', baseCost: 340000000000000,      baseIncome: 319000000,  pop: 950,  happiness: 7,   desc: '赤い惑星に築かれた入植地。人類のフロンティア。' },
  { id: 'lunar_city',     name: '月面都市',      emoji: '🌕', baseCost: 650000000000000,      baseIncome: 440000000,  pop: 2400, happiness: 12,  desc: '地球を離れ月に築いた入植都市。人類の新たな一歩。' },
  { id: 'solar_array',    name: '太陽光発電衛星群', emoji: '🔆', baseCost: 880000000000000,   baseIncome: 519300000,  pop: 1500, happiness: 6,   desc: '軌道上で太陽光を集め、無尽蔵のエネルギーを町に送る。' },
  { id: 'quantum_lab',    name: '量子研究所',    emoji: '⚛️', baseCost: 1200000000000000,     baseIncome: 613000000,  pop: 1900, happiness: 5,   desc: '量子の力で未来を切り拓く最先端研究所。' },
  { id: 'galaxy_station',  name: '銀河ステーション', emoji: '🌌', baseCost: 2400000000000000,   baseIncome: 855000000,  pop: 4500, happiness: 15,  desc: '銀河の彼方まで町の名を轟かせる究極の到達点。' },
  { id: 'spacetime_observatory', name: '時空観測所', emoji: '🕳️', baseCost: 4600000000000000, baseIncome: 1188000000, pop: 6000, happiness: 10, desc: '時空の歪みを観測する神秘の施設。' },
  { id: 'dimension_gate',  name: '次元転送ポータル', emoji: '🌀', baseCost: 8800000000000000,  baseIncome: 1650000000, pop: 8000, happiness: 18, desc: '異次元と繋がるゲート。想像を超えた収益をもたらす。' },
  { id: 'multiverse_hall', name: '多元宇宙庁舎',  emoji: '🌠', baseCost: 32000000000000000,   baseIncome: 3158000000, pop: 15000, happiness: 22, desc: '無数の並行世界を統べる庁舎。' },
  { id: 'creator_shrine',  name: '創造主の神殿',  emoji: '🔱', baseCost: 120000000000000000,  baseIncome: 6232000000, pop: 30000, happiness: 30, desc: '全てを生み出した存在を祀る、町の終着点。' },
  { id: 'eternal_archive',  name: '永劫の書庫',   emoji: '📜', baseCost: 450000000000000000, baseIncome: 12300000000, pop: 60000, happiness: 40, desc: '全ての知識と歴史が刻まれる、時を超えた書庫。町の物語はここに終わらない。' },
  // --- 第二部: 永劫の書庫の先、意識・数理・虚構・因果律・概念そのものへと広がる町の続き ---
  { id: 'dream_archive', name: '夢想収集庁', emoji: '🌙', baseCost: 1500000000000000000, baseIncome: 25000000000, pop: 100000, happiness: 43, desc: '人々の夢を収集し記録する不思議な庁舎。眠りの中の町がここに生まれる。世界の輪郭を保つことにも一役買う。', prevention: { collapse: 0.01 } },
  { id: 'subconscious_temple', name: '深層意識神殿', emoji: '🧠', baseCost: 5000000000000000000, baseIncome: 50000000000, pop: 180000, happiness: 46, desc: '心の奥底にアクセスする神殿。潜在意識が新たな資源を生み出す。' },
  { id: 'memory_palace', name: '記憶の宮殿', emoji: '🏛️', baseCost: 17000000000000000000, baseIncome: 100000000000, pop: 320000, happiness: 49, desc: 'あらゆる記憶が保存される壮麗な宮殿。' },
  { id: 'lucid_garden', name: '明晰夢の庭園', emoji: '🌌', baseCost: 55000000000000000000, baseIncome: 200000000000, pop: 560000, happiness: 52, desc: '夢と知りながら見る夢の庭園。自在に姿を変える幻想の景色。' },
  { id: 'mindscape_metropolis', name: '意識界大都市', emoji: '🧿', baseCost: 180000000000000000000, baseIncome: 400000000000, pop: 980000, happiness: 58, desc: '無数の意識が織りなす大都市。目覚めても消えない不思議な繁栄。' },
  { id: 'axiom_hall', name: '公理の殿堂', emoji: '📐', baseCost: 600000000000000000000, baseIncome: 800000000000, pop: 1700000, happiness: 61, desc: '証明不要の真理が並ぶ殿堂。数学の礎から富が湧き出る。' },
  { id: 'fractal_forest', name: 'フラクタルの森', emoji: '🌀', baseCost: 2000000000000000000000, baseIncome: 1700000000000, pop: 3000000, happiness: 64, desc: 'どこまでも自己相似する不思議な森。歩けど歩けど終わらない。' },
  { id: 'prime_citadel', name: '素数の城塞', emoji: '🔢', baseCost: 6500000000000000000000, baseIncome: 3500000000000, pop: 5300000, happiness: 67, desc: '割り切れない孤高の数だけが築く難攻不落の城塞。' },
  { id: 'infinity_bridge', name: '無限橋', emoji: '♾️', baseCost: 22000000000000000000000, baseIncome: 7000000000000, pop: 9200000, happiness: 70, desc: '渡っても渡っても対岸に着かない橋。それでも町は栄え続ける。' },
  { id: 'paradox_plaza', name: '逆説の広場', emoji: '🌗', baseCost: 70000000000000000000000, baseIncome: 15000000000000, pop: 16000000, happiness: 76, desc: '矛盾のはずなのに成立してしまう、逆説だらけの広場。' },
  { id: 'novel_kingdom', name: '物語王国', emoji: '📖', baseCost: 230000000000000000000000, baseIncome: 30000000000000, pop: 28000000, happiness: 79, desc: '語られることで実在する、物語だけでできた王国。' },
  { id: 'myth_foundry', name: '神話鋳造所', emoji: '⚒️', baseCost: 760000000000000000000000, baseIncome: 60000000000000, pop: 49000000, happiness: 82, desc: '英雄と怪物の神話を鋳造する工房。伝承が経済を動かす。' },
  { id: 'legend_archive', name: '伝説保管庫', emoji: '📜', baseCost: 2500000000000000000000000, baseIncome: 130000000000000, pop: 86000000, happiness: 85, desc: '語り継がれるべき伝説だけを厳選して保管する書庫。' },
  { id: 'fable_theater', name: '寓話劇場', emoji: '🎭', baseCost: 8300000000000000000000000, baseIncome: 270000000000000, pop: 150000000, happiness: 88, desc: '教訓めいた寓話が上演され続ける不思議な劇場。' },
  { id: 'epic_spire', name: '叙事詩の尖塔', emoji: '🗼', baseCost: 27000000000000000000000000, baseIncome: 550000000000000, pop: 260000000, happiness: 94, desc: '幾千の叙事詩が刻まれた天を衝く尖塔。' },
  { id: 'causality_engine', name: '因果律機関', emoji: '⚙️', baseCost: 90000000000000000000000000, baseIncome: 1100000000000000, pop: 460000000, happiness: 97, desc: '原因と結果を意のままに操る機関。町の発展速度そのものを加速させ、概念が崩れることも防ぐ。', prevention: { collapse: 0.04 } },
  { id: 'timeline_weave', name: '時間軸織物工房', emoji: '🕸️', baseCost: 300000000000000000000000000, baseIncome: 2300000000000000, pop: 810000000, happiness: 100, desc: '幾筋もの時間軸を織り上げる工房。歴史そのものが資源になる。' },
  { id: 'butterfly_dome', name: '蝶の羽ばたきドーム', emoji: '🦋', baseCost: 1000000000000000000000000000, baseIncome: 4700000000000000, pop: 1400000000, happiness: 103, desc: '小さな羽ばたきが大きな結果を生む様を観測するドーム。' },
  { id: 'destiny_court', name: '運命裁定所', emoji: '⚖️', baseCost: 3300000000000000000000000000, baseIncome: 9600000000000000, pop: 2500000000, happiness: 106, desc: '町の運命そのものを裁定する法廷。判決は常に繁栄。' },
  { id: 'omniscience_tower', name: '全知の塔', emoji: '👁️', baseCost: 11000000000000000000000000000, baseIncome: 20000000000000000, pop: 4300000000, happiness: 112, desc: '町の過去も未来も見通す全知の塔。' },
  { id: 'recursive_labyrinth', name: '再帰迷宮', emoji: '🌀', baseCost: 36000000000000000000000000000, baseIncome: 41000000000000000, pop: 7600000000, happiness: 115, desc: '自分自身を内包する迷宮。入口がそのまま出口でもある。' },
  { id: 'fractal_spire', name: 'フラクタル尖塔', emoji: '🔺', baseCost: 120000000000000000000000000000, baseIncome: 84000000000000000, pop: 13000000000, happiness: 118, desc: '拡大しても縮小しても同じ形が現れる尖塔。' },
  { id: 'mirror_dimension', name: '鏡合わせ次元', emoji: '🪞', baseCost: 400000000000000000000000000000, baseIncome: 170000000000000000, pop: 23000000000, happiness: 121, desc: '町丸ごとを映し出す鏡の次元。もう一つの町が資源を分けてくれる。' },
  { id: 'echo_chamber_cosmos', name: '木霊する宇宙', emoji: '📡', baseCost: 1300000000000000000000000000000, baseIncome: 350000000000000000, pop: 41000000000, happiness: 124, desc: '町の営みがこだまし続ける宇宙。過去の繁栄も今なお響く。' },
  { id: 'infinite_corridor', name: '無限回廊', emoji: '🚪', baseCost: 4300000000000000000000000000000, baseIncome: 720000000000000000, pop: 71000000000, happiness: 130, desc: '扉を開けてもまた同じ扉。それでも町は着実に富み続ける。' },
  { id: 'eternity_clock', name: '永遠の時計塔', emoji: '⏳', baseCost: 14000000000000000000000000000000, baseIncome: 1500000000000000000, pop: 130000000000, happiness: 133, desc: '針が進んでも針が進んでも、永遠に時を刻み続ける塔。' },
  { id: 'entropy_reversal_lab', name: 'エントロピー逆転研究所', emoji: '🔄', baseCost: 46000000000000000000000000000000, baseIncome: 3100000000000000000, pop: 220000000000, happiness: 136, desc: '秩序が失われていく宇宙の法則すら逆転させる研究所。' },
  { id: 'timeless_sanctuary', name: '時なき聖域', emoji: '🕊️', baseCost: 150000000000000000000000000000000, baseIncome: 6400000000000000000, pop: 380000000000, happiness: 139, desc: '時間という概念そのものが存在しない静謐な聖域。' },
  { id: 'chronosphere', name: 'クロノスフィア', emoji: '🌐', baseCost: 500000000000000000000000000000000, baseIncome: 13000000000000000000, pop: 670000000000, happiness: 142, desc: 'あらゆる時代が同時に存在する球体。町は全ての時を生きる。' },
  { id: 'beyond_time_observatory', name: '時の彼方の観測所', emoji: '🔭', baseCost: 1600000000000000000000000000000000, baseIncome: 27000000000000000000, pop: 1170000000000, happiness: 148, desc: '時間の果て、その先にあるものを観測する施設。' },
  { id: 'concept_incubator', name: '概念孵化器', emoji: '🥚', baseCost: 5300000000000000000000000000000000, baseIncome: 55000000000000000000, pop: 2050000000000, happiness: 151, desc: 'まだ名前のない概念を孵化させる装置。新しい思想が富を生む。' },
  { id: 'living_idea_garden', name: '生きる観念の庭', emoji: '🌱', baseCost: 17000000000000000000000000000000000, baseIncome: 110000000000000000000, pop: 3600000000000, happiness: 154, desc: '観念そのものが生命を持ち、庭園として花開く。' },
  { id: 'archetype_sanctum', name: '元型の聖域', emoji: '🗿', baseCost: 56000000000000000000000000000000000, baseIncome: 230000000000000000000, pop: 6300000000000, happiness: 157, desc: 'あらゆる存在の原型が眠る聖域。' },
  { id: 'platonic_academy', name: 'イデア論の学院', emoji: '🏫', baseCost: 180000000000000000000000000000000000, baseIncome: 470000000000000000000, pop: 11000000000000, happiness: 160, desc: '完全なる理想の形(イデア)を学ぶ学院。' },
  { id: 'thoughtform_metropolis', name: '思念体大都市', emoji: '👻', baseCost: 590000000000000000000000000000000000, baseIncome: 960000000000000000000, pop: 19000000000000, happiness: 166, desc: '強い思念が実体化してできた、住民全員が思念体の大都市。' },
  { id: 'void_gate', name: '虚無の門', emoji: '⚫', baseCost: 1900000000000000000000000000000000000, baseIncome: 2000000000000000000000, pop: 34000000000000, happiness: 169, desc: '何もないはずの虚無へと通じる門。それでも町の富は増え続ける。' },
  { id: 'singularity_core', name: '特異点の核', emoji: '🕳️', baseCost: 6300000000000000000000000000000000000, baseIncome: 4100000000000000000000, pop: 59000000000000, happiness: 172, desc: 'あらゆる法則が意味を失う特異点。その核から力を引き出す。' },
  { id: 'reset_sanctuary', name: '再創造の聖域', emoji: '♻️', baseCost: 21000000000000000000000000000000000000, baseIncome: 8400000000000000000000, pop: 103000000000000, happiness: 175, desc: '全てが終わり、また始まる場所。町の物語はここで生まれ変わる。' },
  { id: 'genesis_loop', name: '創世のループ', emoji: '🔄', baseCost: 69000000000000000000000000000000000000, baseIncome: 17000000000000000000000, pop: 180000000000000, happiness: 178, desc: '創世と終焉が絶えず繰り返されるループ。' },
  { id: 'next_universe_seed', name: '次なる宇宙の種', emoji: '🌌', baseCost: 230000000000000000000000000000000000000, baseIncome: 35000000000000000000000, pop: 316000000000000, happiness: 184, desc: '次の宇宙を芽吹かせる種。この町の物語は、まだ終わらない。' },
  // --- 第三部: 芽吹いた次なる宇宙で、恒星の誕生から生命・文明・そして自分自身の物語へと続く町の続き ---
  { id: 'star_nursery', name: '星の産室', emoji: '⭐', baseCost: 300000000000000000000000000000000000000, baseIncome: 70000000000000000000000, pop: 600000000000000000, happiness: 187, desc: '新たに生まれた宇宙で、最初の恒星が生まれる場所。' },
  { id: 'nebula_garden', name: '星雲の庭', emoji: '🌸', baseCost: 1000000000000000000000000000000000000000, baseIncome: 140000000000000000000000, pop: 1100000000000000000, happiness: 190, desc: '色とりどりの星雲が花のように咲き誇る庭。' },
  { id: 'planet_forge', name: '惑星鍛造所', emoji: '🪐', baseCost: 3300000000000000000000000000000000000000, baseIncome: 290000000000000000000000, pop: 1900000000000000000, happiness: 193, desc: 'ガスと塵から新たな惑星を鍛え上げる工房。' },
  { id: 'comet_way', name: '彗星の通り道', emoji: '☄️', baseCost: 11000000000000000000000000000000000000000, baseIncome: 600000000000000000000000, pop: 3300000000000000000, happiness: 196, desc: '幾多の彗星が行き交う、新生宇宙の目抜き通り。' },
  { id: 'first_life_pond', name: '原初生命の池', emoji: '🦠', baseCost: 36000000000000000000000000000000000000000, baseIncome: 1200000000000000000000000, pop: 5800000000000000000, happiness: 202, desc: '新宇宙で最初の生命が芽吹いた、小さな池。' },
  { id: 'photosynthesis_field', name: '光合成の野', emoji: '🌿', baseCost: 120000000000000000000000000000000000000000, baseIncome: 2500000000000000000000000, pop: 10000000000000000000, happiness: 205, desc: '緑が世界を覆い始めた、酸素豊かな大地。' },
  { id: 'reef_of_origin', name: '起源の礁', emoji: '🐚', baseCost: 400000000000000000000000000000000000000000, baseIncome: 5100000000000000000000000, pop: 18000000000000000000, happiness: 208, desc: 'あらゆる生物の祖先が集った、始まりの珊瑚礁。' },
  { id: 'dawn_of_mind', name: '心の夜明け', emoji: '🧬', baseCost: 1300000000000000000000000000000000000000000, baseIncome: 10500000000000000000000000, pop: 31000000000000000000, happiness: 211, desc: '初めて「考える」ことを覚えた生命が現れた。' },
  { id: 'tribal_hearth', name: '原始の炉端', emoji: '🔥', baseCost: 4400000000000000000000000000000000000000000, baseIncome: 22000000000000000000000000, pop: 54000000000000000000, happiness: 214, desc: '火を囲み、初めて言葉を交わした一族の炉端。' },
  { id: 'stone_settlement', name: '石器の集落', emoji: '🪨', baseCost: 14000000000000000000000000000000000000000000, baseIncome: 45000000000000000000000000, pop: 95000000000000000000, happiness: 220, desc: '石器を手にした人々が根を下ろした最初の集落。' },
  { id: 'first_writing_hall', name: '文字誕生の間', emoji: '📝', baseCost: 49000000000000000000000000000000000000000000, baseIncome: 92000000000000000000000000, pop: 170000000000000000000, happiness: 223, desc: '初めて思考が文字として刻まれた記録の間。' },
  { id: 'bronze_workshop', name: '青銅の工房', emoji: '🔔', baseCost: 160000000000000000000000000000000000000000000, baseIncome: 190000000000000000000000000, pop: 290000000000000000000, happiness: 226, desc: '金属を操る技術が花開いた工房。' },
  { id: 'irrigation_canal', name: '灌漑の水路', emoji: '💧', baseCost: 540000000000000000000000000000000000000000000, baseIncome: 390000000000000000000000000, pop: 510000000000000000000, happiness: 229, desc: '砂漠に緑をもたらす、文明を支える水路。' },
  { id: 'great_library_ii', name: '再生の大図書館', emoji: '📚', baseCost: 1800000000000000000000000000000000000000000000, baseIncome: 800000000000000000000000000, pop: 900000000000000000000, happiness: 235, desc: '失われた第一の書庫の記憶を継ぐ、新たな大図書館。' },
  { id: 'philosopher_agora', name: '哲人たちの広場', emoji: '🏺', baseCost: 6000000000000000000000000000000000000000000000, baseIncome: 1650000000000000000000000000, pop: 1600000000000000000000, happiness: 238, desc: '新たな賢者たちが真理を語り合う広場。' },
  { id: 'star_chart_observatory', name: '星図の天文台', emoji: '🔭', baseCost: 20000000000000000000000000000000000000000000000, baseIncome: 3400000000000000000000000000, pop: 2800000000000000000000, happiness: 241, desc: '再び宇宙を見上げ、星々の地図を描き始めた天文台。' },
  { id: 'printing_guild', name: '印刷ギルド', emoji: '🖨️', baseCost: 67000000000000000000000000000000000000000000000, baseIncome: 7000000000000000000000000000, pop: 4900000000000000000000, happiness: 244, desc: '知識を大量に複製し、世界へ広めるギルド。' },
  { id: 'steam_foundry', name: '蒸気鋳造所', emoji: '⚙️', baseCost: 220000000000000000000000000000000000000000000000, baseIncome: 14500000000000000000000000000, pop: 8600000000000000000000, happiness: 247, desc: '蒸気の力で新たな産業革命を起こす鋳造所。' },
  { id: 'electric_dawn', name: '電気の夜明け', emoji: '💡', baseCost: 740000000000000000000000000000000000000000000000, baseIncome: 30000000000000000000000000000, pop: 15000000000000000000000, happiness: 250, desc: '闇を照らす電気の光が世界を変え始めた。' },
  { id: 'radio_tower_ii', name: '再生の電波塔', emoji: '📡', baseCost: 2500000000000000000000000000000000000000000000000, baseIncome: 62000000000000000000000000000, pop: 27000000000000000000000, happiness: 256, desc: '新宇宙初の電波が空へ放たれた塔。' },
  { id: 'first_flight_field', name: '初飛行の滑走路', emoji: '✈️', baseCost: 8100000000000000000000000000000000000000000000000, baseIncome: 130000000000000000000000000000, pop: 47000000000000000000000, happiness: 259, desc: '新たな文明が初めて空へ羽ばたいた滑走路。' },
  { id: 'orbital_dock', name: '軌道ドック', emoji: '🛰️', baseCost: 27000000000000000000000000000000000000000000000000, baseIncome: 260000000000000000000000000000, pop: 83000000000000000000000, happiness: 262, desc: '再び宇宙へ進出するための軌道上のドック。' },
  { id: 'second_moon_base', name: '第二の月面基地', emoji: '🌕', baseCost: 90000000000000000000000000000000000000000000000000, baseIncome: 540000000000000000000000000000, pop: 150000000000000000000000, happiness: 265, desc: '新たな月に築かれた入植基地。' },
  { id: 'exo_colony', name: '系外植民地', emoji: '🪐', baseCost: 300000000000000000000000000000000000000000000000000, baseIncome: 1100000000000000000000000000000, pop: 260000000000000000000000, happiness: 271, desc: '太陽系の外へ広がった最初の植民地。' },
  { id: 'galactic_senate', name: '銀河元老院', emoji: '🏛️', baseCost: 990000000000000000000000000000000000000000000000000, baseIncome: 2300000000000000000000000000000, pop: 450000000000000000000000, happiness: 274, desc: '新生銀河文明をまとめる合議の場。' },
  { id: 'warp_relay', name: 'ワープ中継基地', emoji: '🌀', baseCost: 3300000000000000000000000000000000000000000000000000, baseIncome: 4700000000000000000000000000000, pop: 800000000000000000000000, happiness: 277, desc: '瞬時に星々を結ぶワープ航路の中継地点。' },
  { id: 'dyson_ring', name: 'ダイソンリング', emoji: '☀️', baseCost: 11000000000000000000000000000000000000000000000000000, baseIncome: 9700000000000000000000000000000, pop: 1400000000000000000000000, happiness: 280, desc: '恒星を丸ごと覆い、無尽蔵のエネルギーを得る巨大構造物。' },
  { id: 'mind_upload_center', name: '意識転写センター', emoji: '🧠', baseCost: 37000000000000000000000000000000000000000000000000000, baseIncome: 20000000000000000000000000000000, pop: 2500000000000000000000000, happiness: 286, desc: '生命の意識をデータへと転写する施設。' },
  { id: 'digital_civilization', name: 'デジタル文明圏', emoji: '💻', baseCost: 120000000000000000000000000000000000000000000000000000, baseIncome: 41000000000000000000000000000000, pop: 4400000000000000000000000, happiness: 289, desc: '肉体を離れ、情報として存続する文明。' },
  { id: 'quantum_senate', name: '量子元老院', emoji: '⚛️', baseCost: 410000000000000000000000000000000000000000000000000000, baseIncome: 85000000000000000000000000000000, pop: 7700000000000000000000000, happiness: 292, desc: '量子の重ね合わせの中で議論を続ける元老院。' },
  { id: 'hyperverse_gate', name: '超宇宙への門', emoji: '🌌', baseCost: 1400000000000000000000000000000000000000000000000000000, baseIncome: 175000000000000000000000000000000, pop: 14000000000000000000000000, happiness: 295, desc: 'この宇宙のさらに外側、超宇宙へ通じる門。' },
  { id: 'reality_loom', name: '現実の織機', emoji: '🕸️', baseCost: 4600000000000000000000000000000000000000000000000000000, baseIncome: 360000000000000000000000000000000, pop: 24000000000000000000000000, happiness: 298, desc: '現実そのものを織り上げる、神話的な織機。' },
  { id: 'omega_point', name: 'オメガポイント', emoji: 'Ω', baseCost: 15000000000000000000000000000000000000000000000000000000, baseIncome: 740000000000000000000000000000000, pop: 42000000000000000000000000, happiness: 304, desc: '全ての情報と意識が収束する究極の一点。' },
  { id: 'second_creator_shrine', name: '二代目・創造主の神殿', emoji: '🔱', baseCost: 52000000000000000000000000000000000000000000000000000000, baseIncome: 1500000000000000000000000000000000, pop: 74000000000000000000000000, happiness: 307, desc: 'かつての神殿の記憶を受け継ぐ、新たな聖域。' },
  { id: 'infinite_recursion_hall', name: '無限再帰の間', emoji: '♾️', baseCost: 170000000000000000000000000000000000000000000000000000000, baseIncome: 3200000000000000000000000000000000, pop: 130000000000000000000000000, happiness: 310, desc: 'この町の物語自体が、また新しい町を生み出し始める間。' },
  { id: 'author_of_worlds', name: '世界の著者の座', emoji: '✍️', baseCost: 590000000000000000000000000000000000000000000000000000000, baseIncome: 6500000000000000000000000000000000, pop: 230000000000000000000000000, happiness: 313, desc: '幾多の宇宙を書き綴ってきた「著者」が座す場所。' },
  { id: 'final_question_hall', name: '最後の問いの間', emoji: '❓', baseCost: 2000000000000000000000000000000000000000000000000000000000, baseIncome: 13500000000000000000000000000000000, pop: 400000000000000000000000000, happiness: 319, desc: '「なぜ町は続くのか」という問いだけが残された間。' },
  { id: 'unwritten_epilogue', name: 'まだ書かれていないあとがき', emoji: '📖', baseCost: 6900000000000000000000000000000000000000000000000000000000, baseIncome: 28000000000000000000000000000000000, pop: 700000000000000000000000000, happiness: 322, desc: 'この町の物語には、まだ続きがある。' },
  { id: 'town_deluxe_prime', name: 'タウンDELUXE・プライム', emoji: '🏙️', baseCost: 24000000000000000000000000000000000000000000000000000000000, baseIncome: 57000000000000000000000000000000000, pop: 1200000000000000000000000000, happiness: 328, desc: '全ての町の頂点に立つ、究極の町。ここから先は、あなた次第。' },
  { id: 'beyond_the_game', name: 'ゲームの向こう側', emoji: '🌟', baseCost: 80000000000000000000000000000000000000000000000000000000000, baseIncome: 120000000000000000000000000000000000, pop: 2200000000000000000000000000, happiness: 335, desc: '画面の外にも、きっと町は続いている。' }
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

// 火事イベントのバリエーション(フレーバー用)。消防団詰所・消防署が予防・軽減を担う
const FIRE_EVENTS = [
  { name: 'ボヤ騒ぎ',     icon: '🔥' },
  { name: '倉庫火災',     icon: '🏭' },
  { name: '住宅火災',     icon: '🏠' },
  { name: '大規模火災',   icon: '🚒' }
];

// 空き巣・犯罪イベントのバリエーション(フレーバー用)。交番が予防を担う瞬間発生型イベント
const CRIME_EVENTS = [
  { name: '空き巣',       icon: '🕵️' },
  { name: 'スリ被害',     icon: '👛' },
  { name: '詐欺被害',     icon: '📞' },
  { name: '強盗',         icon: '🦹' }
];

// 概念崩壊イベントのバリエーション(フレーバー用)。夢想収集庁・因果律機関が予防を担う第二部専用ハザード。
// 病気・火事と同じ「予防→軽減→早期鎮圧」の型を踏襲する。
const COLLAPSE_EVENTS = [
  { name: '因果のほつれ',   icon: '🌀' },
  { name: '記憶の逆流',     icon: '🧠' },
  { name: '論理矛盾',       icon: '❓' },
  { name: '現実のノイズ',   icon: '📺' },
  { name: '次元の裂け目',   icon: '🕳️' }
];

// BGMトラック一覧。price:0は最初から解放済み。それ以外は資金で購入して解放する
const BGM_TRACKS = [
  { id: 'hitoyasumi',            name: 'ひとやすみ',         file: 'audio/hitoyasumi.mp3',            price: 0,    credit: 'MusMus' },
  { id: 'heiwa-na-machi',        name: '平和な町',           file: 'audio/heiwa-na-machi.mp3',        price: 3000, credit: 'Suno' },
  { id: 'ohirusugi',             name: 'おひるすぎ',         file: 'audio/ohirusugi.mp3',             price: 2000, credit: 'ふぁいの音楽置き場' },
  { id: 'nandakke',              name: 'なんだっけ?',        file: 'audio/nandakke.mp3',              price: 2000, credit: 'ふぁいの音楽置き場' },
  { id: 'hokkori-hitotoki',      name: 'ほっこりひととき',   file: 'audio/hokkori-hitotoki.mp3',      price: 4000, credit: 'ふぁいの音楽置き場' },
  { id: 'shizukana-toshoshitsu', name: '静かな図書室で',     file: 'audio/shizukana-toshoshitsu.mp3', price: 6000, credit: 'ふぁいの音楽置き場' },
  { id: 'yuuutsu-amemoyou',      name: 'ゆううつ雨模様',     file: 'audio/yuuutsu-amemoyou.mp3',      price: 8000, credit: 'ふぁいの音楽置き場' },
  { id: 'tasogare-mellow-note',  name: '黄昏メロウノート',   file: 'audio/tasogare-mellow-note.mp3',  price: 9000, credit: 'ふぁいの音楽置き場' }
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

// 最大人口の基礎値。施設で増える人口はこの上限まで(超えた分は幸福度に軽いペナルティ)。
// 「町の拡張」を買うことで上限そのものを引き上げていく。
const BASE_MAX_POPULATION = 500;
const TOWN_EXPANSIONS = [
  { id: 'expand_1',  cost: 500,              popBonus: 100,     name: '🏘️ 区画整理 I',     desc: '新しい住宅区画を整備し、最大人口が+100人される。' },
  { id: 'expand_2',  cost: 5000,             popBonus: 300,     name: '🏘️ 区画整理 II',    desc: '最大人口がさらに+300人される。' },
  { id: 'expand_3',  cost: 50000,            popBonus: 800,     name: '🏘️ 区画整理 III',   desc: '最大人口がさらに+800人される。' },
  { id: 'expand_4',  cost: 500000,           popBonus: 2000,    name: '🌆 都市計画 I',      desc: '道路網を整備し、最大人口が+2,000人される。' },
  { id: 'expand_5',  cost: 5000000,          popBonus: 5000,    name: '🌆 都市計画 II',     desc: '最大人口がさらに+5,000人される。' },
  { id: 'expand_6',  cost: 50000000,         popBonus: 12000,   name: '🌆 都市計画 III',    desc: '最大人口がさらに+12,000人される。' },
  { id: 'expand_7',  cost: 500000000,        popBonus: 30000,   name: '🏙️ 広域開発 I',     desc: '近隣エリアを開発し、最大人口が+30,000人される。' },
  { id: 'expand_8',  cost: 5000000000,       popBonus: 70000,   name: '🏙️ 広域開発 II',    desc: '最大人口がさらに+70,000人される。' },
  { id: 'expand_9',  cost: 50000000000,      popBonus: 150000,  name: '🌍 大都市圏構想',    desc: '広域交通網を整備し、最大人口が+150,000人される。' },
  { id: 'expand_10', cost: 500000000000,     popBonus: 350000,  name: '🌌 メガシティ計画',  desc: '最大人口が+350,000人される。' },
  { id: 'expand_11', cost: 5000000000000,    popBonus: 800000,  name: '🚀 軌道都市構想',    desc: '軌道上にも生活圏を広げ、最大人口が+800,000人される。' },
  { id: 'expand_12', cost: 50000000000000,   popBonus: 2000000, name: '🌠 星間都市連邦',    desc: '最大人口が+2,000,000人される。' },
  { id: 'expand_13', cost: 500000000000000,             popBonus: 4800000,     name: '🌃 惑星都市連合',      desc: '惑星規模の都市連合を築き、最大人口が+4,800,000人される。' },
  { id: 'expand_14', cost: 5000000000000000,            popBonus: 11500000,    name: '🌃 恒星系開発計画',    desc: '最大人口がさらに+11,500,000人される。' },
  { id: 'expand_15', cost: 50000000000000000,           popBonus: 27000000,    name: '🌌 銀河都市網 I',      desc: '最大人口がさらに+27,000,000人される。' },
  { id: 'expand_16', cost: 500000000000000000,          popBonus: 65000000,    name: '🌌 銀河都市網 II',     desc: '最大人口がさらに+65,000,000人される。' },
  { id: 'expand_17', cost: 5000000000000000000,         popBonus: 155000000,   name: '🧠 意識共同体構想',    desc: '意識でつながる共同体を築き、最大人口が+155,000,000人される。' },
  { id: 'expand_18', cost: 50000000000000000000,        popBonus: 370000000,   name: '🔢 数理都市 I',        desc: '最大人口がさらに+370,000,000人される。' },
  { id: 'expand_19', cost: 500000000000000000000,       popBonus: 890000000,   name: '🔢 数理都市 II',       desc: '最大人口がさらに+890,000,000人される。' },
  { id: 'expand_20', cost: 5000000000000000000000,      popBonus: 2100000000,  name: '♾️ 無限都市計画 I',    desc: '最大人口がさらに+2,100,000,000人される。' },
  { id: 'expand_21', cost: 50000000000000000000000,     popBonus: 5100000000,  name: '♾️ 無限都市計画 II',   desc: '最大人口がさらに+5,100,000,000人される。' },
  { id: 'expand_22', cost: 500000000000000000000000,    popBonus: 12000000000, name: '🌠 全存在都市連邦',    desc: 'あらゆる存在を受け入れる、最大人口が+12,000,000,000人される。' },
  { id: 'expand_23', cost: 5000000000000000000000000,        popBonus: 29000000000,    name: '🌟 恒星系都市網 I',   desc: '最大人口がさらに+29,000,000,000人される。' },
  { id: 'expand_24', cost: 50000000000000000000000000,       popBonus: 70000000000,    name: '🌟 恒星系都市網 II',  desc: '最大人口がさらに+70,000,000,000人される。' },
  { id: 'expand_25', cost: 500000000000000000000000000,      popBonus: 170000000000,   name: '🧬 生命圏都市 I',     desc: '生命の萌える星々を取り込み、最大人口が+170,000,000,000人される。' },
  { id: 'expand_26', cost: 5000000000000000000000000000,     popBonus: 410000000000,   name: '🧬 生命圏都市 II',    desc: '最大人口がさらに+410,000,000,000人される。' },
  { id: 'expand_27', cost: 50000000000000000000000000000,    popBonus: 980000000000,   name: '🏛️ 文明圏都市 I',     desc: '幾多の文明を束ねる圏域を築き、最大人口が+980,000,000,000人される。' },
  { id: 'expand_28', cost: 500000000000000000000000000000,   popBonus: 2400000000000,  name: '🏛️ 文明圏都市 II',    desc: '最大人口がさらに+2,400,000,000,000人される。' },
  { id: 'expand_29', cost: 5000000000000000000000000000000,  popBonus: 5800000000000,  name: '🌌 超宇宙都市網 I',   desc: 'この宇宙の外へも広がり、最大人口が+5,800,000,000,000人される。' },
  { id: 'expand_30', cost: 50000000000000000000000000000000, popBonus: 14000000000000, name: '🌌 超宇宙都市網 II',  desc: '最大人口がさらに+14,000,000,000,000人される。' },
  { id: 'expand_31', cost: 500000000000000000000000000000000, popBonus: 34000000000000, name: '✍️ 物語世界都市 I',   desc: '物語そのものの中に築かれた都市。最大人口が+34,000,000,000,000人される。' },
  { id: 'expand_32', cost: 5000000000000000000000000000000000, popBonus: 82000000000000, name: '✍️ 物語世界都市 II', desc: '最大人口がさらに+82,000,000,000,000人される。' }
];
const TOWN_EXPANSIONS_BY_ID = new Map(TOWN_EXPANSIONS.map((e) => [e.id, e]));

// 幸福度の基礎上限(かつては固定150%だった)。「幸福度政策」を買うことで
// 町の拡張(最大人口)と同じ要領で、上限そのものを恒久的に引き上げていく。
const BASE_HAPPINESS_CAP = 150;
const HAPPINESS_EXPANSIONS = [
  { id: 'happy_1',  cost: 500,              capBonus: 10,  name: '😊 町民相談窓口',        desc: '住民の声を汲み取る窓口を新設し、幸福度の上限が永久に+10される。' },
  { id: 'happy_2',  cost: 5000,             capBonus: 15,  name: '🎉 福祉政策 I',          desc: '幸福度の上限が永久にさらに+15される。' },
  { id: 'happy_3',  cost: 50000,            capBonus: 20,  name: '🎊 文化振興策 I',        desc: '幸福度の上限が永久にさらに+20される。' },
  { id: 'happy_4',  cost: 500000,           capBonus: 30,  name: '🏵️ 幸福都市計画 I',      desc: '幸福度の上限が永久にさらに+30される。' },
  { id: 'happy_5',  cost: 5000000,          capBonus: 40,  name: '🏵️ 幸福都市計画 II',     desc: '幸福度の上限が永久にさらに+40される。' },
  { id: 'happy_6',  cost: 50000000,         capBonus: 55,  name: '🌟 理想郷プロジェクト I', desc: '幸福度の上限が永久にさらに+55される。' },
  { id: 'happy_7',  cost: 500000000,        capBonus: 70,  name: '🌟 理想郷プロジェクト II', desc: '幸福度の上限が永久にさらに+70される。' },
  { id: 'happy_8',  cost: 5000000000,       capBonus: 90,  name: '🌈 桃源郷計画 I',        desc: '幸福度の上限が永久にさらに+90される。' },
  { id: 'happy_9',  cost: 50000000000,      capBonus: 115, name: '🌈 桃源郷計画 II',       desc: '幸福度の上限が永久にさらに+115される。' },
  { id: 'happy_10', cost: 500000000000,     capBonus: 140, name: '👑 至福の都 I',          desc: '幸福度の上限が永久にさらに+140される。' },
  { id: 'happy_11', cost: 5000000000000,    capBonus: 170, name: '👑 至福の都 II',         desc: '幸福度の上限が永久にさらに+170される。' },
  { id: 'happy_12', cost: 50000000000000,   capBonus: 200, name: '✨ 永遠の楽園',           desc: '幸福度の上限が永久にさらに+200され、町は名実ともに理想郷となる。' },
  { id: 'happy_13', cost: 500000000000000,             capBonus: 250,  name: '🕊️ 至福の都 III',      desc: '幸福度の上限が永久にさらに+250される。' },
  { id: 'happy_14', cost: 5000000000000000,            capBonus: 320,  name: '🌸 悟りの郷 I',        desc: '幸福度の上限が永久にさらに+320される。' },
  { id: 'happy_15', cost: 50000000000000000,           capBonus: 400,  name: '🌸 悟りの郷 II',       desc: '幸福度の上限が永久にさらに+400される。' },
  { id: 'happy_16', cost: 500000000000000000,          capBonus: 500,  name: '🌈 理想郷の彼方 I',     desc: '幸福度の上限が永久にさらに+500される。' },
  { id: 'happy_17', cost: 5000000000000000000,         capBonus: 650,  name: '🌈 理想郷の彼方 II',    desc: '幸福度の上限が永久にさらに+650される。' },
  { id: 'happy_18', cost: 50000000000000000000,        capBonus: 850,  name: '💫 幸福の特異点 I',     desc: '幸福度の上限が永久にさらに+850される。' },
  { id: 'happy_19', cost: 500000000000000000000,       capBonus: 1100, name: '💫 幸福の特異点 II',    desc: '幸福度の上限が永久にさらに+1,100される。' },
  { id: 'happy_20', cost: 5000000000000000000000,      capBonus: 1450, name: '🕉️ 無上の悦楽郷 I',    desc: '幸福度の上限が永久にさらに+1,450される。' },
  { id: 'happy_21', cost: 50000000000000000000000,     capBonus: 1900, name: '🕉️ 無上の悦楽郷 II',   desc: '幸福度の上限が永久にさらに+1,900される。' },
  { id: 'happy_22', cost: 500000000000000000000000,    capBonus: 2500, name: '♾️ 幸福度、無限大',     desc: '幸福度の上限が永久にさらに+2,500され、もはや上限という概念が意味を失う。' },
  { id: 'happy_23', cost: 5000000000000000000000000,        capBonus: 3300,  name: '🕊️ 悟りの郷 III',      desc: '幸福度の上限が永久にさらに+3,300される。' },
  { id: 'happy_24', cost: 50000000000000000000000000,       capBonus: 4360,  name: '🌸 涅槃の境地 I',       desc: '幸福度の上限が永久にさらに+4,360される。' },
  { id: 'happy_25', cost: 500000000000000000000000000,      capBonus: 5760,  name: '🌸 涅槃の境地 II',      desc: '幸福度の上限が永久にさらに+5,760される。' },
  { id: 'happy_26', cost: 5000000000000000000000000000,     capBonus: 7600,  name: '🌈 至福の彼方 I',       desc: '幸福度の上限が永久にさらに+7,600される。' },
  { id: 'happy_27', cost: 50000000000000000000000000000,    capBonus: 10030, name: '🌈 至福の彼方 II',      desc: '幸福度の上限が永久にさらに+10,030される。' },
  { id: 'happy_28', cost: 500000000000000000000000000000,   capBonus: 13240, name: '💫 幸福の特異点 III',   desc: '幸福度の上限が永久にさらに+13,240される。' },
  { id: 'happy_29', cost: 5000000000000000000000000000000,  capBonus: 17480, name: '💫 幸福の特異点 IV',    desc: '幸福度の上限が永久にさらに+17,480される。' },
  { id: 'happy_30', cost: 50000000000000000000000000000000, capBonus: 23070, name: '🕉️ 無上の悦楽郷 III',  desc: '幸福度の上限が永久にさらに+23,070される。' },
  { id: 'happy_31', cost: 500000000000000000000000000000000, capBonus: 30450, name: '🕉️ 無上の悦楽郷 IV',  desc: '幸福度の上限が永久にさらに+30,450される。' },
  { id: 'happy_32', cost: 5000000000000000000000000000000000, capBonus: 40190, name: '♾️ 幸福、そのものへ', desc: '幸福度の上限が永久にさらに+40,190される。幸福はもはや度合いですらない。' }
];
const HAPPINESS_EXPANSIONS_BY_ID = new Map(HAPPINESS_EXPANSIONS.map((e) => [e.id, e]));

// 名声ショップ: 都市合併で得た名声ポイントを使って買う恒久アップグレード(合併しても失われない)。
// tierは解放に必要な累計名声ポイント(famePoints。都市合併のたびに更新される、使っても減らない
// 生涯到達値。FAME_SHOP_TIER_REQUIREMENTのインデックスに対応)で、稼いだ名声そのものが
// 大きくなるほど新しいティアが開放されていくエンドコンテンツ(かつては都市合併の「回数」で
// 解放していたが、周回数だけ稼ぐ空合併が有利になってしまうため、稼いだ名声の大きさで見るよう変更)。
const FAME_SHOP_TIER_REQUIREMENT = [0, 15, 50, 150, 400, 800, 1500, 3000, 6000, 12000, 25000];
const FAME_SHOP = [
  // Tier 1: いつでも購入可(名声ポイントさえあれば)
  { id: 'fame_income_1',  tier: 0, cost: 5,   name: '💹 効率化都市計画 I',   desc: '全施設の収入が永久に+10%される。',                       effect: { type: 'incomeMult', value: 1.10 } },
  { id: 'fame_click_1',   tier: 0, cost: 5,   name: '👆 熟練の握手',         desc: '町役場クリックの獲得資金が永久に+20%される。',             effect: { type: 'clickMult', value: 1.20 } },
  { id: 'fame_petition_1',tier: 0, cost: 8,   name: '😊 御用聞きの心得',     desc: '陳情に応えた時の幸福度上昇が永久に+20%される。',           effect: { type: 'petitionAgreeMult', value: 1.20 } },
  { id: 'fame_rain_1',    tier: 0, cost: 8,   name: '☀️ 気象予報士常駐',     desc: '恵みの雨イベントが永久に約25%発生しやすくなる。',           effect: { type: 'rainFreqMult', value: 0.75 } },
  { id: 'fame_ufo_1',     tier: 0, cost: 8,   name: '🛸 電波観測所 I',       desc: 'UFOが永久に約20%出現しやすくなる。',                       effect: { type: 'ufoFreqMult', value: 0.8 } },
  { id: 'fame_petition_time_1', tier: 0, cost: 6, name: '⏳ 陳情猶予延長 I',  desc: '陳情に答えられる制限時間が永久に+20%延長される。',           effect: { type: 'petitionTimeMult', value: 1.2 } },
  // Tier 2: 名声ポイント15到達で解放
  { id: 'fame_income_2',  tier: 1, cost: 20,  name: '💹 効率化都市計画 II',  desc: '全施設の収入が永久にさらに+15%される。',                   effect: { type: 'incomeMult', value: 1.15 } },
  { id: 'fame_offline_1', tier: 1, cost: 25,  name: '🌙 越境オフライン協定', desc: 'オフライン収益の上限が8時間→16時間に延長される。',           effect: { type: 'offlineCapHours', value: 16 } },
  { id: 'fame_hospital_1',tier: 1, cost: 25,  name: '🛡️ 医療ネットワーク強化', desc: '医療系施設による病気予防の効果が永久に+30%される。',        effect: { type: 'preventionMult', value: 1.30 } },
  { id: 'fame_golden_1',  tier: 1, cost: 20,  name: '✨ ゴールデンタイム延長', desc: 'ゴールデンビルの出現時間が永久に+50%延長される。',         effect: { type: 'goldenDurationMult', value: 1.5 } },
  { id: 'fame_petition_2',tier: 1, cost: 22,  name: '😊 御用聞きの心得 II',   desc: '陳情に応えた時の幸福度上昇が永久にさらに+20%される。',       effect: { type: 'petitionAgreeMult', value: 1.20 } },
  { id: 'fame_happiness_0',tier: 1, cost: 18, name: '🎗️ 町政運営基盤',      desc: '町の幸福度基準値が永久に+8される。',                       effect: { type: 'happinessBonusFlat', value: 8 } },
  { id: 'fame_sickness_severity_1', tier: 1, cost: 22, name: '💊 公衆衛生キャンペーン I', desc: '病気イベントの深刻度が永久に約20%軽減される。',    effect: { type: 'sicknessSeverityMult', value: 0.8 } },
  { id: 'fame_mission_1', tier: 1, cost: 20,  name: '🎯 ミッション報奨金 I',  desc: 'デイリーミッションの報酬が永久に+20%される。',             effect: { type: 'missionRewardMult', value: 1.2 } },
  // Tier 3: 名声ポイント50到達で解放
  { id: 'fame_income_3',  tier: 2, cost: 60,  name: '💹 効率化都市計画 III', desc: '全施設の収入が永久にさらに+20%される。',                   effect: { type: 'incomeMult', value: 1.20 } },
  { id: 'fame_autobuy',   tier: 2, cost: 80,  name: '🤖 執事の自動購入',     desc: '買える中で最も安い施設を自動で購入してくれる執事を雇う。',   effect: { type: 'autoBuy', value: true } },
  { id: 'fame_offline_2', tier: 2, cost: 60,  name: '🌙 越境オフライン協定 II', desc: 'オフライン収益の上限が16時間→24時間に延長される。',      effect: { type: 'offlineCapHours', value: 24 } },
  { id: 'fame_golden_2',  tier: 2, cost: 50,  name: '✨ ゴールデンビル頻発', desc: 'ゴールデンビルが永久に約20%出現しやすくなる。',            effect: { type: 'goldenFreqMult', value: 0.8 } },
  { id: 'fame_click_2',   tier: 2, cost: 55,  name: '👆 熟練の握手 II',      desc: '町役場クリックの獲得資金が永久にさらに+25%される。',       effect: { type: 'clickMult', value: 1.25 } },
  { id: 'fame_rain_2',    tier: 2, cost: 50,  name: '☀️ 気象予報士常駐 II',  desc: '恵みの雨イベントが永久にさらに約15%発生しやすくなる。',     effect: { type: 'rainFreqMult', value: 0.85 } },
  { id: 'fame_prevention_2', tier: 2, cost: 55, name: '🛡️ 医療ネットワーク強化 II', desc: '医療系施設による病気予防の効果が永久にさらに+20%される。', effect: { type: 'preventionMult', value: 1.20 } },
  { id: 'fame_sickness_duration_1', tier: 2, cost: 55, name: '⏱️ 早期収束プロトコル I', desc: '病気イベントの流行期間が永久に約20%短縮される。',  effect: { type: 'sicknessDurationMult', value: 0.8 } },
  { id: 'fame_petition_time_2', tier: 2, cost: 50, name: '⏳ 陳情猶予延長 II', desc: '陳情に答えられる制限時間が永久にさらに+20%延長される。',   effect: { type: 'petitionTimeMult', value: 1.2 } },
  // Tier 4: 名声ポイント150到達で解放(真のエンドコンテンツ)
  { id: 'fame_income_4',  tier: 3, cost: 200, name: '💹 効率化都市計画 IV',  desc: '全施設の収入が永久にさらに+30%される。',                   effect: { type: 'incomeMult', value: 1.30 } },
  { id: 'fame_happiness_1',tier: 3, cost: 250, name: '🌌 銀河評議会の椅子', desc: '町の幸福度基準値が永久に+15される。',                     effect: { type: 'happinessBonusFlat', value: 15 } },
  { id: 'fame_prestige_th',tier: 3, cost: 300, name: '👑 伝説の統治',       desc: '都市合併に必要な累計資金がずっと10%引き下げられる。',       effect: { type: 'prestigeThresholdMult', value: 0.9 } },
  { id: 'fame_petition_3',tier: 3, cost: 220, name: '😊 御用聞きの心得 III', desc: '陳情に応えた時の幸福度上昇が永久にさらに+25%される。',      effect: { type: 'petitionAgreeMult', value: 1.25 } },
  { id: 'fame_golden_3',  tier: 3, cost: 210, name: '✨ ゴールデンタイム延長 II', desc: 'ゴールデンビルの出現時間が永久にさらに+30%延長される。', effect: { type: 'goldenDurationMult', value: 1.3 } },
  { id: 'fame_ufo_2',     tier: 3, cost: 200, name: '🛸 電波観測所 II',      desc: 'UFOが永久にさらに約25%出現しやすくなる。',                 effect: { type: 'ufoFreqMult', value: 0.75 } },
  { id: 'fame_mission_2', tier: 3, cost: 220, name: '🎯 ミッション報奨金 II', desc: 'デイリーミッションの報酬が永久にさらに+20%される。',       effect: { type: 'missionRewardMult', value: 1.2 } },
  { id: 'fame_gain_1',    tier: 3, cost: 280, name: '🎖️ 名声増幅回路 I',    desc: '都市合併で得られる名声ポイントが永久に+10%される。',        effect: { type: 'fameGainMult', value: 1.10 } },
  // Tier 5: 名声ポイント400到達で解放(周回を重ねた者だけが辿り着く最終ティア)
  { id: 'fame_income_5',  tier: 4, cost: 500, name: '💹 効率化都市計画 V',   desc: '全施設の収入が永久にさらに+40%される。',                   effect: { type: 'incomeMult', value: 1.40 } },
  { id: 'fame_click_3',   tier: 4, cost: 450, name: '👆 熟練の握手 III',     desc: '町役場クリックの獲得資金が永久にさらに+35%される。',       effect: { type: 'clickMult', value: 1.35 } },
  { id: 'fame_prevention_3', tier: 4, cost: 480, name: '🛡️ 医療ネットワーク強化 III', desc: '医療系施設による病気予防の効果が永久にさらに+25%される。', effect: { type: 'preventionMult', value: 1.25 } },
  { id: 'fame_offline_3', tier: 4, cost: 400, name: '🌙 越境オフライン協定 III', desc: 'オフライン収益の上限が24時間→36時間に延長される。',      effect: { type: 'offlineCapHours', value: 36 } },
  { id: 'fame_offline_4', tier: 4, cost: 550, name: '🌙 越境オフライン協定 IV', desc: 'オフライン収益の上限が36時間→48時間に延長される。',       effect: { type: 'offlineCapHours', value: 48 } },
  { id: 'fame_happiness_2',tier: 4, cost: 500, name: '🌌 銀河評議会の椅子 II', desc: '町の幸福度基準値が永久にさらに+20される。',               effect: { type: 'happinessBonusFlat', value: 20 } },
  { id: 'fame_prestige_th_2', tier: 4, cost: 600, name: '👑 伝説の統治 II',  desc: '都市合併に必要な累計資金がずっとさらに10%引き下げられる。',  effect: { type: 'prestigeThresholdMult', value: 0.9 } },
  { id: 'fame_sickness_severity_2', tier: 4, cost: 450, name: '💊 公衆衛生キャンペーン II', desc: '病気イベントの深刻度が永久にさらに約25%軽減される。', effect: { type: 'sicknessSeverityMult', value: 0.75 } },
  { id: 'fame_sickness_duration_2', tier: 4, cost: 450, name: '⏱️ 早期収束プロトコル II', desc: '病気イベントの流行期間が永久にさらに約20%短縮される。', effect: { type: 'sicknessDurationMult', value: 0.8 } },
  { id: 'fame_gain_2',    tier: 4, cost: 700, name: '🎖️ 名声増幅回路 II',   desc: '都市合併で得られる名声ポイントが永久にさらに+15%される。',   effect: { type: 'fameGainMult', value: 1.15 } },
  { id: 'fame_autobuy_upgrades', tier: 4, cost: 350, name: '🤖 執事のアップグレード購入', desc: '執事が解放済みのアップグレードも自動で購入してくれるようになる。', effect: { type: 'autoBuyUpgrades', value: true } },
  { id: 'fame_autobuy_speed', tier: 4, cost: 400, name: '🤖 執事の増員',        desc: '自動購入の執事が増員され、購入間隔が半分(4秒→2秒)になる。',      effect: { type: 'autoBuyIntervalMult', value: 0.5 } },
  // Tier 6: 名声ポイント800到達で解放
  { id: 'fame_income_6',  tier: 5, cost: 900,  name: '💹 効率化都市計画 VI',   desc: '全施設の収入が永久にさらに+45%される。',                   effect: { type: 'incomeMult', value: 1.45 } },
  { id: 'fame_click_4',   tier: 5, cost: 800,  name: '👆 熟練の握手 IV',       desc: '町役場クリックの獲得資金が永久にさらに+40%される。',       effect: { type: 'clickMult', value: 1.40 } },
  { id: 'fame_petition_4',tier: 5, cost: 850,  name: '😊 御用聞きの心得 IV',   desc: '陳情に応えた時の幸福度上昇が永久にさらに+30%される。',      effect: { type: 'petitionAgreeMult', value: 1.30 } },
  { id: 'fame_prevention_4', tier: 5, cost: 850, name: '🛡️ 医療ネットワーク強化 IV', desc: '医療系施設による病気予防の効果が永久にさらに+20%される。', effect: { type: 'preventionMult', value: 1.20 } },
  { id: 'fame_offline_5', tier: 5, cost: 700,  name: '🌙 越境オフライン協定 V', desc: 'オフライン収益の上限が48時間→60時間に延長される。',       effect: { type: 'offlineCapHours', value: 60 } },
  { id: 'fame_happiness_3',tier: 5, cost: 850, name: '🌌 銀河評議会の椅子 III', desc: '町の幸福度基準値が永久にさらに+25される。',               effect: { type: 'happinessBonusFlat', value: 25 } },
  { id: 'fame_golden_4',  tier: 5, cost: 750,  name: '✨ ゴールデンタイム延長 III', desc: 'ゴールデンビルの出現時間が永久にさらに+25%延長される。', effect: { type: 'goldenDurationMult', value: 1.25 } },
  { id: 'fame_rain_3',    tier: 5, cost: 700,  name: '☀️ 気象予報士常駐 III',  desc: '恵みの雨イベントが永久にさらに約10%発生しやすくなる。',     effect: { type: 'rainFreqMult', value: 0.9 } },
  { id: 'fame_mission_3', tier: 5, cost: 800,  name: '🎯 ミッション報奨金 III', desc: 'デイリーミッションの報酬が永久にさらに+25%される。',       effect: { type: 'missionRewardMult', value: 1.25 } },
  { id: 'fame_gain_3',    tier: 5, cost: 1000, name: '🎖️ 名声増幅回路 III',   desc: '都市合併で得られる名声ポイントが永久にさらに+12%される。',   effect: { type: 'fameGainMult', value: 1.12 } },
  // Tier 7: 名声ポイント1,500到達で解放
  { id: 'fame_income_7',  tier: 6, cost: 1800, name: '💹 効率化都市計画 VII',  desc: '全施設の収入が永久にさらに+50%される。',                   effect: { type: 'incomeMult', value: 1.50 } },
  { id: 'fame_click_5',   tier: 6, cost: 1600, name: '👆 熟練の握手 V',        desc: '町役場クリックの獲得資金が永久にさらに+45%される。',       effect: { type: 'clickMult', value: 1.45 } },
  { id: 'fame_ufo_3',     tier: 6, cost: 1500, name: '🛸 電波観測所 III',      desc: 'UFOが永久にさらに約30%出現しやすくなる。',                 effect: { type: 'ufoFreqMult', value: 0.7 } },
  { id: 'fame_sickness_severity_3', tier: 6, cost: 1600, name: '💊 公衆衛生キャンペーン III', desc: '病気イベントの深刻度が永久にさらに約30%軽減される。', effect: { type: 'sicknessSeverityMult', value: 0.7 } },
  { id: 'fame_sickness_duration_3', tier: 6, cost: 1600, name: '⏱️ 早期収束プロトコル III', desc: '病気イベントの流行期間が永久にさらに約25%短縮される。', effect: { type: 'sicknessDurationMult', value: 0.75 } },
  { id: 'fame_petition_time_3', tier: 6, cost: 1400, name: '⏳ 陳情猶予延長 III', desc: '陳情に答えられる制限時間が永久にさらに+15%延長される。',  effect: { type: 'petitionTimeMult', value: 1.15 } },
  { id: 'fame_prestige_th_3', tier: 6, cost: 2000, name: '👑 伝説の統治 III',  desc: '都市合併に必要な累計資金がずっとさらに8%引き下げられる。',   effect: { type: 'prestigeThresholdMult', value: 0.92 } },
  { id: 'fame_offline_6', tier: 6, cost: 1500, name: '🌙 越境オフライン協定 VI', desc: 'オフライン収益の上限が60時間→72時間に延長される。',      effect: { type: 'offlineCapHours', value: 72 } },
  { id: 'fame_happiness_4',tier: 6, cost: 1700, name: '🌌 銀河評議会の椅子 IV', desc: '町の幸福度基準値が永久にさらに+30される。',               effect: { type: 'happinessBonusFlat', value: 30 } },
  { id: 'fame_gain_4',    tier: 6, cost: 2200, name: '🎖️ 名声増幅回路 IV',    desc: '都市合併で得られる名声ポイントが永久にさらに+15%される。',   effect: { type: 'fameGainMult', value: 1.15 } },
  // Tier 8: 名声ポイント3,000到達で解放
  { id: 'fame_income_8',  tier: 7, cost: 3500, name: '💹 効率化都市計画 VIII', desc: '全施設の収入が永久にさらに+55%される。',                   effect: { type: 'incomeMult', value: 1.55 } },
  { id: 'fame_click_6',   tier: 7, cost: 3200, name: '👆 熟練の握手 VI',       desc: '町役場クリックの獲得資金が永久にさらに+50%される。',       effect: { type: 'clickMult', value: 1.50 } },
  { id: 'fame_petition_5',tier: 7, cost: 3300, name: '😊 御用聞きの心得 V',    desc: '陳情に応えた時の幸福度上昇が永久にさらに+35%される。',      effect: { type: 'petitionAgreeMult', value: 1.35 } },
  { id: 'fame_prevention_5', tier: 7, cost: 3300, name: '🛡️ 医療ネットワーク強化 V', desc: '医療系施設による病気予防の効果が永久にさらに+25%される。', effect: { type: 'preventionMult', value: 1.25 } },
  { id: 'fame_golden_5',  tier: 7, cost: 3000, name: '✨ ゴールデンビル頻発 II', desc: 'ゴールデンビルが永久にさらに約25%出現しやすくなる。',     effect: { type: 'goldenFreqMult', value: 0.75 } },
  { id: 'fame_rain_4',    tier: 7, cost: 2800, name: '☀️ 気象予報士常駐 IV',   desc: '恵みの雨イベントが永久にさらに約15%発生しやすくなる。',     effect: { type: 'rainFreqMult', value: 0.85 } },
  { id: 'fame_mission_4', tier: 7, cost: 3200, name: '🎯 ミッション報奨金 IV', desc: 'デイリーミッションの報酬が永久にさらに+30%される。',       effect: { type: 'missionRewardMult', value: 1.3 } },
  { id: 'fame_offline_7', tier: 7, cost: 3000, name: '🌙 越境オフライン協定 VII', desc: 'オフライン収益の上限が72時間→84時間に延長される。',     effect: { type: 'offlineCapHours', value: 84 } },
  { id: 'fame_happiness_5',tier: 7, cost: 3400, name: '🌌 銀河評議会の椅子 V', desc: '町の幸福度基準値が永久にさらに+35される。',               effect: { type: 'happinessBonusFlat', value: 35 } },
  { id: 'fame_gain_5',    tier: 7, cost: 4200, name: '🎖️ 名声増幅回路 V',     desc: '都市合併で得られる名声ポイントが永久にさらに+18%される。',   effect: { type: 'fameGainMult', value: 1.18 } },
  // Tier 9: 名声ポイント6,000到達で解放
  { id: 'fame_income_9',  tier: 8, cost: 7000, name: '💹 効率化都市計画 IX',   desc: '全施設の収入が永久にさらに+60%される。',                   effect: { type: 'incomeMult', value: 1.60 } },
  { id: 'fame_click_7',   tier: 8, cost: 6500, name: '👆 熟練の握手 VII',      desc: '町役場クリックの獲得資金が永久にさらに+55%される。',       effect: { type: 'clickMult', value: 1.55 } },
  { id: 'fame_ufo_4',     tier: 8, cost: 6000, name: '🛸 電波観測所 IV',       desc: 'UFOが永久にさらに約35%出現しやすくなる。',                 effect: { type: 'ufoFreqMult', value: 0.65 } },
  { id: 'fame_sickness_severity_4', tier: 8, cost: 6500, name: '💊 公衆衛生キャンペーン IV', desc: '病気イベントの深刻度が永久にさらに約35%軽減される。', effect: { type: 'sicknessSeverityMult', value: 0.65 } },
  { id: 'fame_sickness_duration_4', tier: 8, cost: 6500, name: '⏱️ 早期収束プロトコル IV', desc: '病気イベントの流行期間が永久にさらに約30%短縮される。', effect: { type: 'sicknessDurationMult', value: 0.7 } },
  { id: 'fame_petition_time_4', tier: 8, cost: 5500, name: '⏳ 陳情猶予延長 IV', desc: '陳情に答えられる制限時間が永久にさらに+10%延長される。',  effect: { type: 'petitionTimeMult', value: 1.1 } },
  { id: 'fame_prestige_th_4', tier: 8, cost: 8000, name: '👑 伝説の統治 IV',   desc: '都市合併に必要な累計資金がずっとさらに6%引き下げられる。',   effect: { type: 'prestigeThresholdMult', value: 0.94 } },
  { id: 'fame_offline_8', tier: 8, cost: 6000, name: '🌙 越境オフライン協定 VIII', desc: 'オフライン収益の上限が84時間→96時間に延長される。',     effect: { type: 'offlineCapHours', value: 96 } },
  { id: 'fame_happiness_6',tier: 8, cost: 7000, name: '🌌 銀河評議会の椅子 VI', desc: '町の幸福度基準値が永久にさらに+40される。',               effect: { type: 'happinessBonusFlat', value: 40 } },
  { id: 'fame_gain_6',    tier: 8, cost: 9000, name: '🎖️ 名声増幅回路 VI',     desc: '都市合併で得られる名声ポイントが永久にさらに+20%される。',   effect: { type: 'fameGainMult', value: 1.20 } },
  // Tier 10: 名声ポイント12,000到達で解放
  { id: 'fame_income_10', tier: 9, cost: 15000, name: '💹 効率化都市計画 X',   desc: '全施設の収入が永久にさらに+65%される。',                   effect: { type: 'incomeMult', value: 1.65 } },
  { id: 'fame_click_8',   tier: 9, cost: 14000, name: '👆 熟練の握手 VIII',    desc: '町役場クリックの獲得資金が永久にさらに+60%される。',       effect: { type: 'clickMult', value: 1.60 } },
  { id: 'fame_petition_6',tier: 9, cost: 14000, name: '😊 御用聞きの心得 VI',  desc: '陳情に応えた時の幸福度上昇が永久にさらに+40%される。',      effect: { type: 'petitionAgreeMult', value: 1.40 } },
  { id: 'fame_prevention_6', tier: 9, cost: 14000, name: '🛡️ 医療ネットワーク強化 VI', desc: '医療系施設による病気予防の効果が永久にさらに+30%される。', effect: { type: 'preventionMult', value: 1.30 } },
  { id: 'fame_golden_6',  tier: 9, cost: 12000, name: '✨ ゴールデンタイム延長 IV', desc: 'ゴールデンビルの出現時間が永久にさらに+20%延長される。', effect: { type: 'goldenDurationMult', value: 1.2 } },
  { id: 'fame_rain_5',    tier: 9, cost: 12000, name: '☀️ 気象予報士常駐 V',   desc: '恵みの雨イベントが永久にさらに約20%発生しやすくなる。',     effect: { type: 'rainFreqMult', value: 0.8 } },
  { id: 'fame_mission_5', tier: 9, cost: 13000, name: '🎯 ミッション報奨金 V', desc: 'デイリーミッションの報酬が永久にさらに+35%される。',       effect: { type: 'missionRewardMult', value: 1.35 } },
  { id: 'fame_offline_9', tier: 9, cost: 13000, name: '🌙 越境オフライン協定 IX', desc: 'オフライン収益の上限が96時間→108時間に延長される。',     effect: { type: 'offlineCapHours', value: 108 } },
  { id: 'fame_happiness_7',tier: 9, cost: 15000, name: '🌌 銀河評議会の椅子 VII', desc: '町の幸福度基準値が永久にさらに+50される。',             effect: { type: 'happinessBonusFlat', value: 50 } },
  { id: 'fame_gain_7',    tier: 9, cost: 19000, name: '🎖️ 名声増幅回路 VII',   desc: '都市合併で得られる名声ポイントが永久にさらに+22%される。',   effect: { type: 'fameGainMult', value: 1.22 } },
  // Tier 11: 名声ポイント25,000到達で解放(周回の果てに辿り着く真の最終ティア)
  { id: 'fame_income_11', tier: 10, cost: 30000, name: '💹 効率化都市計画 XI', desc: '全施設の収入が永久にさらに+70%される。',                   effect: { type: 'incomeMult', value: 1.70 } },
  { id: 'fame_click_9',   tier: 10, cost: 28000, name: '👆 熟練の握手 IX',     desc: '町役場クリックの獲得資金が永久にさらに+65%される。',       effect: { type: 'clickMult', value: 1.65 } },
  { id: 'fame_ufo_5',     tier: 10, cost: 26000, name: '🛸 電波観測所 V',      desc: 'UFOが永久にさらに約40%出現しやすくなる。',                 effect: { type: 'ufoFreqMult', value: 0.6 } },
  { id: 'fame_sickness_severity_5', tier: 10, cost: 28000, name: '💊 公衆衛生キャンペーン V', desc: '病気イベントの深刻度が永久にさらに約40%軽減される。', effect: { type: 'sicknessSeverityMult', value: 0.6 } },
  { id: 'fame_sickness_duration_5', tier: 10, cost: 28000, name: '⏱️ 早期収束プロトコル V', desc: '病気イベントの流行期間が永久にさらに約35%短縮される。', effect: { type: 'sicknessDurationMult', value: 0.65 } },
  { id: 'fame_petition_time_5', tier: 10, cost: 24000, name: '⏳ 陳情猶予延長 V', desc: '陳情に答えられる制限時間が永久にさらに+8%延長される。',   effect: { type: 'petitionTimeMult', value: 1.08 } },
  { id: 'fame_prestige_th_5', tier: 10, cost: 35000, name: '👑 伝説の統治 V',  desc: '都市合併に必要な累計資金がずっとさらに5%引き下げられる。',   effect: { type: 'prestigeThresholdMult', value: 0.95 } },
  { id: 'fame_offline_10', tier: 10, cost: 26000, name: '🌙 越境オフライン協定 X', desc: 'オフライン収益の上限が108時間→120時間に延長される。',   effect: { type: 'offlineCapHours', value: 120 } },
  { id: 'fame_happiness_8',tier: 10, cost: 32000, name: '🌌 銀河評議会の椅子 VIII', desc: '町の幸福度基準値が永久にさらに+60される。',           effect: { type: 'happinessBonusFlat', value: 60 } },
  { id: 'fame_gain_8',    tier: 10, cost: 40000, name: '🎖️ 名声増幅回路 VIII', desc: '都市合併で得られる名声ポイントが永久にさらに+25%される。',   effect: { type: 'fameGainMult', value: 1.25 } },
  { id: 'fame_autobuy_speed_2', tier: 10, cost: 25000, name: '🤖 執事の大増員', desc: '自動購入の執事がさらに増員され、購入間隔が半分(2秒→1秒)になる。', effect: { type: 'autoBuyIntervalMult', value: 0.5 } }
];
function fameShopTierUnlocked(tier, famePoints) {
  return famePoints >= FAME_SHOP_TIER_REQUIREMENT[tier];
}

// --- 次元融合(第2のプレステージ層): 都市合併をさらに周回した末に解放される、恒久を超えた「恒久」層。 ---
// 累計獲得資金(lifetimeMoneyは都市合併でも消えない)を元手に「次元結晶」を得て、その場で都市合併の
// 現在の周(資金・施設・名声ポイント・未購入の名声ショップ進捗)を再構築する代わりに、名声ショップの
// 効果とは別枠でずっと乗り続ける強力な恒久強化を購入できるようになる。
// effectの型はFAME_SHOPと共通(fameOwnedItems()で合算される)なので、消費側のコードは触らなくてよい。
const DIMENSION_FUSION_DIVISOR = 1e30; // この額のlifetimeMoneyごとに次元結晶1個分の実力を得る目安(立方根で緩やかに増える)
const DIMENSION_SHOP = [
  { id: 'dim_income_1',  cost: 3,  name: '💠 次元経済学 I',   desc: '全施設の収入が永久に2倍になる。名声ショップの効果とは別に乗算される。', effect: { type: 'incomeMult', value: 2.0 } },
  { id: 'dim_income_2',  cost: 8,  name: '💠 次元経済学 II',  desc: '全施設の収入が永久にさらに2倍になる。', effect: { type: 'incomeMult', value: 2.0 } },
  { id: 'dim_click_1',   cost: 4,  name: '💠 次元の一撃',     desc: '町役場クリックの獲得資金が永久に2.5倍になる。', effect: { type: 'clickMult', value: 2.5 } },
  { id: 'dim_prestige_th',cost: 6, name: '💠 次元の加護',     desc: '都市合併に必要な累計資金がずっと半分になる。', effect: { type: 'prestigeThresholdMult', value: 0.5 } },
  { id: 'dim_fame_gain',  cost: 5, name: '💠 次元の共鳴',     desc: '都市合併で得られる名声ポイントが永久に+50%される。', effect: { type: 'fameGainMult', value: 1.5 } },
  { id: 'dim_offline',    cost: 9, name: '💠 次元の静寂',     desc: 'オフライン収益の上限が事実上無制限になる。', effect: { type: 'offlineCapHours', value: 999999 } },
  { id: 'dim_happiness',  cost: 7, name: '💠 次元の幸福',     desc: '町の幸福度基準値が永久に+100される。', effect: { type: 'happinessBonusFlat', value: 100 } },
  { id: 'dim_prevention', cost: 5, name: '💠 次元の守護',     desc: '病気・火事・空き巣・陳情の予防効果が永久に2倍になる。', effect: { type: 'preventionMult', value: 2.0 } },
  { id: 'dim_mission',    cost: 5, name: '💠 次元の使命',     desc: 'デイリーミッション・恒久ミッションの報酬が永久に2倍になる。', effect: { type: 'missionRewardMult', value: 2.0 } },
  { id: 'dim_golden',     cost: 6, name: '💠 次元の黄金',     desc: 'ゴールデンビルが永久に約2倍出現しやすくなる。', effect: { type: 'goldenFreqMult', value: 0.5 } },
  { id: 'dim_ufo',        cost: 6, name: '💠 次元の来訪者',   desc: 'UFOが永久に約2倍出現しやすくなる。', effect: { type: 'ufoFreqMult', value: 0.5 } },
  { id: 'dim_rain',       cost: 6, name: '💠 次元の恵み',     desc: '恵みの雨イベントが永久に約2倍発生しやすくなる。', effect: { type: 'rainFreqMult', value: 0.5 } },
  { id: 'dim_petition',   cost: 6, name: '💠 次元の対話',     desc: '陳情に応えた時の幸福度上昇が永久に2倍になる。', effect: { type: 'petitionAgreeMult', value: 2.0 } },
  { id: 'dim_autobuy',    cost: 8, name: '💠 次元の執事',     desc: '自動購入の執事の購入間隔が永久に半分になる。', effect: { type: 'autoBuyIntervalMult', value: 0.5 } }
];
const DIMENSION_SHOP_BY_ID = new Map(DIMENSION_SHOP.map((d) => [d.id, d]));

// --- レリックショップ: 全実績・全名声ショップを完全制覇した者だけに解放される、真の最終コンテンツ。 ---
// 通貨は次元結晶を流用するが、解放条件そのものが「完全制覇」なので事実上ここに辿り着くだけでも一仕事になる。
const RELIC_SHOP = [
  { id: 'relic_income',    cost: 50, name: '🏺 万物の秘宝',   desc: '全施設の収入が永久にさらに3倍になる。', effect: { type: 'incomeMult', value: 3.0 } },
  { id: 'relic_click',     cost: 30, name: '🏺 神の一撃',     desc: '町役場クリックの獲得資金が永久にさらに5倍になる。', effect: { type: 'clickMult', value: 5.0 } },
  { id: 'relic_prestige',  cost: 60, name: '🏺 悠久の理',     desc: '都市合併に必要な累計資金がずっとさらに半分になる。', effect: { type: 'prestigeThresholdMult', value: 0.5 } },
  { id: 'relic_happiness', cost: 40, name: '🏺 永遠の幸福',   desc: '町の幸福度基準値が永久にさらに+500される。', effect: { type: 'happinessBonusFlat', value: 500 } },
  { id: 'relic_prevention',cost: 40, name: '🏺 絶対の守護',   desc: '病気・火事・空き巣・陳情・概念崩壊の予防効果が永久にさらに3倍になる。', effect: { type: 'preventionMult', value: 3.0 } },
  { id: 'relic_fame_gain', cost: 50, name: '🏺 名声の秘宝',   desc: '都市合併で得られる名声ポイントが永久にさらに2倍になる。', effect: { type: 'fameGainMult', value: 2.0 } },
  { id: 'relic_mission',   cost: 35, name: '🏺 使命の証',     desc: 'デイリーミッション・恒久ミッションの報酬が永久にさらに3倍になる。', effect: { type: 'missionRewardMult', value: 3.0 } },
  { id: 'relic_golden',    cost: 35, name: '🏺 黄金の秘宝',   desc: 'ゴールデンビルが永久にさらに約2倍出現しやすくなる。', effect: { type: 'goldenFreqMult', value: 0.5 } }
];
const RELIC_SHOP_BY_ID = new Map(RELIC_SHOP.map((r) => [r.id, r]));

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

// --- ミッション(チュートリアル〜マイルストーン、デイリーとは別枠の恒久クエスト) ---
// デイリーミッションと違いリセットされない。段階(stage)ごとに区切られ、各stageのミッションを
// 70%以上クリアすると次のstageが解放される(序盤の操作案内→中盤〜終盤の到達目標、と難度が上がる)。
function totalBuildingsOwned(s) {
  return Object.values(s.buildings || {}).reduce((a, b) => a + b, 0);
}
function distinctBuildingsOwned(s) {
  return Object.values(s.buildings || {}).filter((n) => n >= 1).length;
}
function happinessCapFromState(s) {
  let total = BASE_HAPPINESS_CAP;
  (s.happinessExpansions || []).forEach((id) => {
    const e = HAPPINESS_EXPANSIONS_BY_ID.get(id);
    if (e) total += e.capBonus;
  });
  return total;
}
const QUESTS = [
  // Stage 1: はじめの一歩(基本操作のチュートリアル)
  { id: 'm1_click', stage: 1, icon: '👆', name: '町役場をクリックしよう', desc: '町役場をクリックして最初の資金を稼ぐ', check: (s) => (s.totalClicks || 0) >= 1 },
  { id: 'm1_house', stage: 1, icon: '🏠', name: '最初の家を建てよう', desc: '施設タブで「家」を1つ購入する', check: (s) => (s.buildings.house || 0) >= 1 },
  { id: 'm1_petition', stage: 1, icon: '😊', name: '陳情に応えてみよう', desc: '町民の声(陳情)に1回応える', check: (s) => (s.petitionsAnswered || 0) >= 1 },
  { id: 'm1_upgrade_tab', stage: 1, icon: '⚡', name: '強化タブを開いてみよう', desc: '「強化」タブを開いて中身を見る', check: (s) => !!(s.uiFlags && s.uiFlags.opened_tab_upgrade) },
  { id: 'm1_ach_tab', stage: 1, icon: '🏆', name: '実績タブを開いてみよう', desc: '「実績」タブを開いて中身を見る', check: (s) => !!(s.uiFlags && s.uiFlags.opened_tab_achievement) },
  { id: 'm1_stats_tab', stage: 1, icon: '📊', name: '統計タブを開いてみよう', desc: '「統計」タブを開いて中身を見る', check: (s) => !!(s.uiFlags && s.uiFlags.opened_tab_stats) },
  { id: 'm1_daily_tab', stage: 1, icon: '📅', name: 'デイリータブを開いてみよう', desc: '「デイリー」タブを開いて中身を見る', check: (s) => !!(s.uiFlags && s.uiFlags.opened_tab_daily) },
  { id: 'm1_bgm', stage: 1, icon: '🎼', name: 'BGMを選んでみよう', desc: 'フッターの「BGM選択」を開く', check: (s) => !!(s.uiFlags && s.uiFlags.opened_bgm_modal) },
  // Stage 2: 町の基盤づくり
  { id: 'm2_buildings10', stage: 2, icon: '🏘️', name: '施設を合計10個所有しよう', desc: '種類を問わず施設を合計10個所有する', check: (s) => totalBuildingsOwned(s) >= 10 },
  { id: 'm2_types5', stage: 2, icon: '🏪', name: '5種類の施設を所有しよう', desc: '異なる施設を5種類以上所有する', check: (s) => distinctBuildingsOwned(s) >= 5 },
  { id: 'm2_money1000', stage: 2, icon: '💰', name: '累計1,000円稼ごう', desc: '累計獲得資金が1,000円に到達する', check: (s) => s.lifetimeMoney >= 1000 },
  { id: 'm2_upgrade1', stage: 2, icon: '⚡', name: '初めてのアップグレードを購入しよう', desc: '施設アップグレードを1個購入する', check: (s) => (s.upgrades || []).length >= 1 },
  { id: 'm2_golden', stage: 2, icon: '✨', name: 'ゴールデンビルをクリックしよう', desc: '出現するゴールデンビルを1回クリックする', check: (s) => (s.goldenClicks || 0) >= 1 },
  { id: 'm2_ufo', stage: 2, icon: '🛸', name: 'UFOをクリックしよう', desc: '出現するUFOを1回クリックする', check: (s) => (s.ufoClicks || 0) >= 1 },
  { id: 'm2_prestige_tab', stage: 2, icon: '🌟', name: '合併タブを見てみよう', desc: '「合併」タブを開いて中身を見る', check: (s) => !!(s.uiFlags && s.uiFlags.opened_tab_prestige) },
  { id: 'm2_buyall', stage: 2, icon: '🛒', name: '「全部買う」を使ってみよう', desc: '施設タブの「全部買う」ボタンを使う', check: (s) => !!(s.uiFlags && s.uiFlags.used_buy_all) },
  // Stage 3: 経済成長
  { id: 'm3_money1e5', stage: 3, icon: '💰', name: '累計10万円稼ごう', desc: '累計獲得資金が10万円に到達する', check: (s) => s.lifetimeMoney >= 100000 },
  { id: 'm3_buildings50', stage: 3, icon: '🏘️', name: '施設を合計50個所有しよう', desc: '種類を問わず施設を合計50個所有する', check: (s) => totalBuildingsOwned(s) >= 50 },
  { id: 'm3_types20', stage: 3, icon: '🏪', name: '20種類の施設を所有しよう', desc: '異なる施設を20種類以上所有する', check: (s) => distinctBuildingsOwned(s) >= 20 },
  { id: 'm3_upgrade5', stage: 3, icon: '⚡', name: 'アップグレードを5個購入しよう', desc: '施設アップグレードを合計5個購入する', check: (s) => (s.upgrades || []).length >= 5 },
  { id: 'm3_dailymission', stage: 3, icon: '🎯', name: 'デイリーミッションを達成しよう', desc: 'デイリーミッションを1つ達成して受け取る', check: (s) => (s.dailyMissionsClaimed || 0) >= 1 },
  { id: 'm3_sickness', stage: 3, icon: '🏥', name: '病気を乗り越えよう', desc: '疫病の流行を1回乗り越える(自然収束・治療どちらでも可)', check: (s) => (s.sicknessSurvived || 0) + (s.sicknessCured || 0) >= 1 },
  { id: 'm3_fire', stage: 3, icon: '🚒', name: '火事を乗り越えよう', desc: '火事を1回乗り越える(自然鎮火・消防隊どちらでも可)', check: (s) => ((s.hazards && s.hazards.fire && s.hazards.fire.survived) || 0) + ((s.hazards && s.hazards.fire && s.hazards.fire.cured) || 0) >= 1 },
  { id: 'm3_crime', stage: 3, icon: '🚓', name: '空き巣を経験しよう', desc: '空き巣・犯罪イベントを1回経験する(未然に防いだ場合も可)', check: (s) => (s.crimeOccurred || 0) + (s.crimePrevented || 0) >= 1 },
  // Stage 4: 拡張と発展
  { id: 'm4_townexp', stage: 4, icon: '🏘️', name: '町の拡張を行おう', desc: '強化タブで「町の拡張」を1回購入する', check: (s) => (s.townExpansions || []).length >= 1 },
  { id: 'm4_happyexp', stage: 4, icon: '😊', name: '幸福度政策を行おう', desc: '強化タブで「幸福度政策」を1回購入する', check: (s) => (s.happinessExpansions || []).length >= 1 },
  { id: 'm4_money1e6', stage: 4, icon: '💰', name: '累計100万円稼ごう', desc: '累計獲得資金が100万円に到達する', check: (s) => s.lifetimeMoney >= 1000000 },
  { id: 'm4_prestige1', stage: 4, icon: '🌟', name: '初めて都市合併しよう', desc: '都市合併を1回行う', check: (s) => (s.prestigeCount || 0) >= 1 },
  { id: 'm4_fameshop1', stage: 4, icon: '💎', name: '名声ショップでアイテムを買おう', desc: '名声ショップでアップグレードを1個購入する', check: (s) => (s.fameShopUpgrades || []).length >= 1 },
  { id: 'm4_buildings200', stage: 4, icon: '🏘️', name: '施設を合計200個所有しよう', desc: '種類を問わず施設を合計200個所有する', check: (s) => totalBuildingsOwned(s) >= 200 },
  { id: 'm4_allbuildings', stage: 4, icon: '🏙️', name: '全ての施設を1つ以上所有しよう', desc: 'BUILDINGS全種類をコンプリートする', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1) },
  { id: 'm4_login3', stage: 4, icon: '📅', name: '連続ログイン3日を達成しよう', desc: '3日連続でプレイする', check: (s) => (s.loginStreak || 0) >= 3 },
  // Stage 5: 更なる高み
  { id: 'm5_money1e8', stage: 5, icon: '💰', name: '累計1億円稼ごう', desc: '累計獲得資金が1億円に到達する', check: (s) => s.lifetimeMoney >= 100000000 },
  { id: 'm5_prestige5', stage: 5, icon: '🌟', name: '都市合併を5回行おう', desc: '都市合併の累計回数が5回に到達する', check: (s) => (s.prestigeCount || 0) >= 5 },
  { id: 'm5_autobuy', stage: 5, icon: '🤖', name: '執事の自動購入を解放しよう', desc: '名声ショップ「執事の自動購入」を取得する', check: (s) => (s.fameShopUpgrades || []).includes('fame_autobuy') },
  { id: 'm5_offline', stage: 5, icon: '🌙', name: 'オフライン収益を延長しよう', desc: '名声ショップ「越境オフライン協定」を取得する', check: (s) => (s.fameShopUpgrades || []).includes('fame_offline_1') },
  { id: 'm5_buildings1000', stage: 5, icon: '🏘️', name: '施設を合計1,000個所有しよう', desc: '種類を問わず施設を合計1,000個所有する', check: (s) => totalBuildingsOwned(s) >= 1000 },
  { id: 'm5_happy100', stage: 5, icon: '😊', name: '幸福度100%を達成しよう', desc: '幸福度を100%以上にする', check: (s) => s.happiness >= 100 },
  { id: 'm5_types50', stage: 5, icon: '🏪', name: '50種類の施設を所有しよう', desc: '異なる施設を50種類以上所有する', check: (s) => distinctBuildingsOwned(s) >= 50 },
  { id: 'm5_settings', stage: 5, icon: '⚙️', name: '設定を開いてみよう', desc: 'フッターの「設定」を開く', check: (s) => !!(s.uiFlags && s.uiFlags.opened_settings) },
  // Stage 6: 名声への道
  { id: 'm6_money1e10', stage: 6, icon: '💰', name: '累計100億円稼ごう', desc: '累計獲得資金が100億円に到達する', check: (s) => s.lifetimeMoney >= 10000000000 },
  { id: 'm6_prestige15', stage: 6, icon: '🌟', name: '名声ポイントを150貯めよう', desc: '名声ポイントが150に到達する(名声ショップTier4解放)', check: (s) => (s.famePoints || 0) >= 150 },
  { id: 'm6_fameshop10', stage: 6, icon: '💎', name: '名声ショップを10個購入しよう', desc: '名声ショップのアップグレードを合計10個購入する', check: (s) => (s.fameShopUpgrades || []).length >= 10 },
  { id: 'm6_buildings2000', stage: 6, icon: '🏘️', name: '施設を合計2,000個所有しよう', desc: '種類を問わず施設を合計2,000個所有する', check: (s) => totalBuildingsOwned(s) >= 2000 },
  { id: 'm6_expansion_all', stage: 6, icon: '🏘️', name: '町の拡張を全て行おう', desc: '町の拡張(全22段階)をコンプリートする', check: (s) => (s.townExpansions || []).length >= TOWN_EXPANSIONS.length },
  { id: 'm6_happyexp_all', stage: 6, icon: '😊', name: '幸福度政策を全て行おう', desc: '幸福度政策(全22段階)をコンプリートする', check: (s) => (s.happinessExpansions || []).length >= HAPPINESS_EXPANSIONS.length },
  { id: 'm6_ach50', stage: 6, icon: '🏆', name: '実績を50個達成しよう', desc: '実績の達成数が50個に到達する', check: (s) => (s.achievements || []).length >= 50 },
  { id: 'm6_types90', stage: 6, icon: '🏪', name: '90種類の施設を所有しよう', desc: '異なる施設を90種類以上所有する', check: (s) => distinctBuildingsOwned(s) >= 90 },
  // Stage 7: 銀河評議会
  { id: 'm7_money1e14', stage: 7, icon: '💰', name: '累計100兆円稼ごう', desc: '累計獲得資金が100兆円に到達する', check: (s) => s.lifetimeMoney >= 100000000000000 },
  { id: 'm7_prestige30', stage: 7, icon: '🌟', name: '名声ポイントを400貯めよう', desc: '名声ポイントが400に到達する(名声ショップTier5解放)', check: (s) => (s.famePoints || 0) >= 400 },
  { id: 'm7_types_all', stage: 7, icon: '🏪', name: '全ての施設を所有しよう', desc: `全${BUILDINGS.length}種類の施設をコンプリートする`, check: (s) => distinctBuildingsOwned(s) >= BUILDINGS.length },
  { id: 'm7_ach200', stage: 7, icon: '🏆', name: '実績を200個達成しよう', desc: '実績の達成数が200個に到達する', check: (s) => (s.achievements || []).length >= 200 },
  { id: 'm7_buildings10000', stage: 7, icon: '🏘️', name: '施設を合計10,000個所有しよう', desc: '種類を問わず施設を合計10,000個所有する', check: (s) => totalBuildingsOwned(s) >= 10000 },
  { id: 'm7_balanced10', stage: 7, icon: '⚖️', name: '全ての施設を10個以上ずつ所有しよう', desc: 'バランスよく全施設を育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 10) },
  { id: 'm7_fameshop25', stage: 7, icon: '💎', name: '名声ショップを25個購入しよう', desc: '名声ショップのアップグレードを合計25個購入する', check: (s) => (s.fameShopUpgrades || []).length >= 25 },
  { id: 'm7_money_archive', stage: 7, icon: '📜', name: '永劫の書庫を超える資金を稼ごう', desc: '累計獲得資金が45京円(4.5×10^17)に到達する', check: (s) => s.lifetimeMoney >= 450000000000000000 },
  // Stage 8: 第二部の入口
  { id: 'm8_dream', stage: 8, icon: '🌙', name: '「夢想収集庁」を建てよう', desc: '第二部最初の施設を1つ所有する', check: (s) => (s.buildings.dream_archive || 0) >= 1 },
  { id: 'm8_money1e20', stage: 8, icon: '💰', name: '累計1垓円を突破しよう', desc: '累計獲得資金が1垓円(10^20)に到達する', check: (s) => s.lifetimeMoney >= 1e20 },
  { id: 'm8_prestige50', stage: 8, icon: '🌟', name: '名声ポイントを800貯めよう', desc: '名声ポイントが800に到達する(名声ショップTier6解放)', check: (s) => (s.famePoints || 0) >= 800 },
  { id: 'm8_fameshop40', stage: 8, icon: '💎', name: '名声ショップを40個購入しよう', desc: '名声ショップのアップグレードを合計40個購入する', check: (s) => (s.fameShopUpgrades || []).length >= 40 },
  { id: 'm8_balanced50', stage: 8, icon: '🌈', name: '全ての施設を50個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 50) },
  { id: 'm8_ach500', stage: 8, icon: '🏆', name: '実績を500個達成しよう', desc: '実績の達成数が500個に到達する', check: (s) => (s.achievements || []).length >= 500 },
  { id: 'm8_buildings50000', stage: 8, icon: '🏘️', name: '施設を合計50,000個所有しよう', desc: '種類を問わず施設を合計50,000個所有する', check: (s) => totalBuildingsOwned(s) >= 50000 },
  { id: 'm8_displaymode', stage: 8, icon: '🚫', name: '街並みの表示設定を試してみよう', desc: '設定から街並みの建物表示モードを切り替える', check: (s) => !!(s.uiFlags && s.uiFlags.used_building_display_mode) },
  // Stage 9: 無限への挑戦
  { id: 'm9_next_universe', stage: 9, icon: '🌌', name: '「次なる宇宙の種」を建てよう', desc: '現時点で最も新しい施設を1つ所有する', check: (s) => (s.buildings.next_universe_seed || 0) >= 1 },
  { id: 'm9_money1e28', stage: 9, icon: '💰', name: '累計1穣円を突破しよう', desc: '累計獲得資金が1穣円(10^28)に到達する', check: (s) => s.lifetimeMoney >= 1e28 },
  { id: 'm9_prestige110', stage: 9, icon: '🌟', name: '名声ポイントを3,000貯めよう', desc: '名声ポイントが3,000に到達する(名声ショップTier8解放)', check: (s) => (s.famePoints || 0) >= 3000 },
  { id: 'm9_balanced200', stage: 9, icon: '🌟', name: '全ての施設を200個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 200) },
  { id: 'm9_ach1000', stage: 9, icon: '🏆', name: '実績を1,000個達成しよう', desc: '実績の達成数が1,000個に到達する', check: (s) => (s.achievements || []).length >= 1000 },
  { id: 'm9_fameshop70', stage: 9, icon: '💎', name: '名声ショップを70個購入しよう', desc: '名声ショップのアップグレードを合計70個購入する', check: (s) => (s.fameShopUpgrades || []).length >= 70 },
  { id: 'm9_buildings200000', stage: 9, icon: '🏘️', name: '施設を合計200,000個所有しよう', desc: '種類を問わず施設を合計200,000個所有する', check: (s) => totalBuildingsOwned(s) >= 200000 },
  { id: 'm9_happycap1000', stage: 9, icon: '😊', name: '幸福度の上限を1,000%まで引き上げよう', desc: '幸福度政策を重ねて上限を引き上げる', check: (s) => happinessCapFromState(s) >= 1000 },
  // Stage 10: 究極完全都市(最終段階)
  { id: 'm10_balanced1000', stage: 10, icon: '👑', name: '全ての施設を1,000個以上ずつ所有しよう', desc: '真の完全制覇へ向けて、全施設を極限まで育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1000) },
  { id: 'm10_prestige230', stage: 10, icon: '🌟', name: '名声ポイントを12,000貯めよう', desc: '名声ポイントが12,000に到達する(名声ショップTier10解放)', check: (s) => (s.famePoints || 0) >= 12000 },
  { id: 'm10_prestige320', stage: 10, icon: '🌟', name: '名声ポイントを25,000貯めよう', desc: '名声ポイントが25,000に到達する(名声ショップ最終Tier解放)', check: (s) => (s.famePoints || 0) >= 25000 },
  { id: 'm10_fameshop_all', stage: 10, icon: '💎', name: '名声ショップを全て購入しよう', desc: `名声ショップの全${FAME_SHOP.length}アイテムをコンプリートする`, check: (s) => (s.fameShopUpgrades || []).length >= FAME_SHOP.length },
  { id: 'm10_ach_all', stage: 10, icon: '🏆', name: '実績を全て達成しよう', desc: '実績を1つ残らず全て達成する', check: (s) => (s.achievements || []).length >= ACHIEVEMENTS.length },
  { id: 'm10_next_universe10', stage: 10, icon: '🌌', name: '「次なる宇宙の種」を10個所有しよう', desc: '真の完全制覇へ、最新施設をさらに育てる', check: (s) => (s.buildings.next_universe_seed || 0) >= 10 },
  { id: 'm10_buildings1000000', stage: 10, icon: '🏙️', name: '施設を合計1,000,000個所有しよう', desc: '種類を問わず施設を合計100万個所有する', check: (s) => totalBuildingsOwned(s) >= 1000000 },
  { id: 'm10_final', stage: 10, icon: '🎉', name: 'タウンDELUXEを完全制覇しよう', desc: '全実績・全名声ショップ・全施設1,000個以上を同時に達成する', check: (s) => (s.achievements || []).length >= ACHIEVEMENTS.length && (s.fameShopUpgrades || []).length >= FAME_SHOP.length && BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1000) },

  // ここから既存stage 1〜10への追加分(上位目標の水増し・見落とし気味な指標の補完)
  { id: 'm1_golden', stage: 1, icon: '✨', name: 'ゴールデンビルを見つけよう', desc: '町に現れるゴールデンビルを1回クリックする', check: (s) => (s.goldenClicks || 0) >= 1 },
  { id: 'm2_rain', stage: 2, icon: '☔', name: '恵みの雨を体験しよう', desc: '雨イベント(収入1.5倍)が発生するのを待つ', check: (s) => (s.rainCount || 0) >= 1 },
  { id: 'm2_bgmbuy', stage: 2, icon: '🎼', name: 'BGMを1曲購入しよう', desc: 'BGM選択画面で有料トラックを1つ購入する', check: (s) => (s.bgmUnlocked || []).length >= 2 },
  { id: 'm3_clicks100', stage: 3, icon: '👆', name: '町役場を100回クリックしよう', desc: '累計クリック回数が100回に到達する', check: (s) => (s.totalClicks || 0) >= 100 },
  { id: 'm3_season', stage: 3, icon: '🥶', name: '季節限定の陳情に応えよう', desc: '冬か夏、どちらかの季節限定陳情に設備で対応する', check: (s) => (s.seasonalComplaintsResolved || []).length >= 1 },
  { id: 'm4_clicks1000', stage: 4, icon: '👆', name: '町役場を1,000回クリックしよう', desc: '累計クリック回数が1,000回に到達する', check: (s) => (s.totalClicks || 0) >= 1000 },
  { id: 'm4_golden10', stage: 4, icon: '✨', name: 'ゴールデンビルを10回ゲットしよう', desc: 'ゴールデンビルを累計10回クリックする', check: (s) => (s.goldenClicks || 0) >= 10 },
  { id: 'm4_seasonboth', stage: 4, icon: '🌦️', name: '冬夏どちらの陳情にも対応しよう', desc: '冬と夏、両方の季節限定陳情に設備で対応する', check: (s) => (s.seasonalComplaintsResolved || []).includes('cold') && (s.seasonalComplaintsResolved || []).includes('heat') },
  { id: 'm5_login7', stage: 5, icon: '🔥', name: '連続ログイン7日を達成しよう', desc: '7日連続でプレイする', check: (s) => (s.loginStreak || 0) >= 7 },
  { id: 'm5_bgmall', stage: 5, icon: '🎼', name: 'BGMを5曲解放しよう', desc: 'BGMトラックを合計5曲解放する', check: (s) => (s.bgmUnlocked || []).length >= 5 },
  { id: 'm6_rank_top', stage: 6, icon: '👑', name: '最高位の称号に到達しよう', desc: `市長ランクの最高位「${RANK_TIERS[RANK_TIERS.length - 1].title}」に到達する`, check: (s) => rankIndexFor(s.lifetimeMoney) >= RANK_TIERS.length - 1 },
  { id: 'm6_dailymission50', stage: 6, icon: '📅', name: 'デイリーミッションを50回達成しよう', desc: 'デイリーミッションの累計達成数が50回に到達する', check: (s) => (s.dailyMissionsClaimed || 0) >= 50 },
  { id: 'm7_prevention', stage: 7, icon: '🛡️', name: '病気・火事・空き巣を10回ずつ未然に防ごう', desc: '各種予防の実績を積む', check: (s) => (s.sicknessPrevented || 0) >= 10 && ((s.hazards && s.hazards.fire && s.hazards.fire.prevented) || 0) >= 10 && (s.crimePrevented || 0) >= 10 },
  { id: 'm7_clicks10000', stage: 7, icon: '👆', name: '町役場を10,000回クリックしよう', desc: '累計クリック回数が10,000回に到達する', check: (s) => (s.totalClicks || 0) >= 10000 },
  { id: 'm8_happycap500', stage: 8, icon: '😊', name: '幸福度の上限を500%まで引き上げよう', desc: '幸福度政策を重ねて上限を引き上げる', check: (s) => happinessCapFromState(s) >= 500 },
  { id: 'm8_login30', stage: 8, icon: '🔥', name: '連続ログイン30日を達成しよう', desc: '30日連続でプレイする', check: (s) => (s.loginStreak || 0) >= 30 },
  { id: 'm9_bgmall', stage: 9, icon: '🎼', name: 'BGMを全て解放しよう', desc: `BGMトラックを全${BGM_TRACKS.length}曲解放する`, check: (s) => (s.bgmUnlocked || []).length >= BGM_TRACKS.length },
  { id: 'm9_dailymission200', stage: 9, icon: '📅', name: 'デイリーミッションを200回達成しよう', desc: 'デイリーミッションの累計達成数が200回に到達する', check: (s) => (s.dailyMissionsClaimed || 0) >= 200 },

  // Stage 11: 次元融合の扉(第2のプレステージ層に踏み出す)
  { id: 'm11_first_fusion', stage: 11, icon: '💠', name: '初めて次元融合をしよう', desc: '都市合併タブから「次元融合」を1回行う', check: (s) => (s.dimensionFusionCount || 0) >= 1 },
  { id: 'm11_dimshop1', stage: 11, icon: '💠', name: '次元ショップでアイテムを買おう', desc: '次元ショップのアップグレードを1個購入する', check: (s) => (s.dimensionShopUpgrades || []).length >= 1 },
  { id: 'm11_dimshop5', stage: 11, icon: '💠', name: '次元ショップを5個購入しよう', desc: '次元ショップのアップグレードを合計5個購入する', check: (s) => (s.dimensionShopUpgrades || []).length >= 5 },
  { id: 'm11_fusion3', stage: 11, icon: '💠', name: '次元融合を3回行おう', desc: '次元融合の累計回数が3回に到達する', check: (s) => (s.dimensionFusionCount || 0) >= 3 },
  { id: 'm11_money1e32', stage: 11, icon: '💰', name: '累計1溝円を突破しよう', desc: '累計獲得資金が1溝円(10^32)に到達する', check: (s) => s.lifetimeMoney >= 1e32 },
  { id: 'm11_money1e35', stage: 11, icon: '💰', name: '累計10穰円を突破しよう', desc: '累計獲得資金が10穰円(10^35)に到達する', check: (s) => s.lifetimeMoney >= 1e35 },
  { id: 'm11_prestige60', stage: 11, icon: '🌟', name: '都市合併を60回行おう', desc: '都市合併の累計回数が60回に到達する', check: (s) => (s.prestigeCount || 0) >= 60 },
  { id: 'm11_balanced3000', stage: 11, icon: '🌟', name: '全ての施設を3,000個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 3000) },
  { id: 'm11_ach1200', stage: 11, icon: '🏆', name: '実績を1,200個達成しよう', desc: '実績の達成数が1,200個に到達する', check: (s) => (s.achievements || []).length >= 1200 },
  { id: 'm11_buildings2000000', stage: 11, icon: '🏘️', name: '施設を合計2,000,000個所有しよう', desc: '種類を問わず施設を合計200万個所有する', check: (s) => totalBuildingsOwned(s) >= 2000000 },

  // Stage 12: 次元経済圏
  { id: 'm12_dimshop10', stage: 12, icon: '💠', name: '次元ショップを10個購入しよう', desc: '次元ショップのアップグレードを合計10個購入する', check: (s) => (s.dimensionShopUpgrades || []).length >= 10 },
  { id: 'm12_dimshop_all', stage: 12, icon: '💠', name: '次元ショップを全て購入しよう', desc: `次元ショップの全${DIMENSION_SHOP.length}アイテムをコンプリートする`, check: (s) => (s.dimensionShopUpgrades || []).length >= DIMENSION_SHOP.length },
  { id: 'm12_fusion10', stage: 12, icon: '💠', name: '次元融合を10回行おう', desc: '次元融合の累計回数が10回に到達する', check: (s) => (s.dimensionFusionCount || 0) >= 10 },
  { id: 'm12_money1e40', stage: 12, icon: '💰', name: '累計1澗円を突破しよう', desc: '累計獲得資金が1澗円(10^40)に到達する', check: (s) => s.lifetimeMoney >= 1e40 },
  { id: 'm12_money1e45', stage: 12, icon: '💰', name: '累計10正円を突破しよう', desc: '累計獲得資金が10正円(10^45)に到達する', check: (s) => s.lifetimeMoney >= 1e45 },
  { id: 'm12_balanced5000', stage: 12, icon: '🌟', name: '全ての施設を5,000個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 5000) },
  { id: 'm12_ach_all_confirm', stage: 12, icon: '🏆', name: '実績を全て達成しよう(再確認)', desc: '実績を1つ残らず全て達成する', check: (s) => (s.achievements || []).length >= ACHIEVEMENTS.length },
  { id: 'm12_clicks100000', stage: 12, icon: '👆', name: '町役場を100,000回クリックしよう', desc: '累計クリック回数が100,000回に到達する', check: (s) => (s.totalClicks || 0) >= 100000 },
  { id: 'm12_buildings10000000', stage: 12, icon: '🏘️', name: '施設を合計10,000,000個所有しよう', desc: '種類を問わず施設を合計1,000万個所有する', check: (s) => totalBuildingsOwned(s) >= 10000000 },
  { id: 'm12_quests100', stage: 12, icon: '📜', name: 'ミッションを100個達成しよう', desc: '恒久ミッションの累計達成数が100個に到達する', check: (s) => (s.questsClaimed || []).length >= 100 },

  // Stage 13: 完全なる名声
  { id: 'm13_fameshop_all', stage: 13, icon: '💎', name: '名声ショップを全て購入しよう(再確認)', desc: `名声ショップの全${FAME_SHOP.length}アイテムをコンプリートする`, check: (s) => (s.fameShopUpgrades || []).length >= FAME_SHOP.length },
  { id: 'm13_money1e60', stage: 13, icon: '💰', name: '累計1×10^60円を突破しよう', desc: '累計獲得資金が10^60円に到達する', check: (s) => s.lifetimeMoney >= 1e60 },
  { id: 'm13_money1e70', stage: 13, icon: '💰', name: '累計1×10^70円を突破しよう', desc: '累計獲得資金が10^70円に到達する', check: (s) => s.lifetimeMoney >= 1e70 },
  { id: 'm13_balanced10000', stage: 13, icon: '🌟', name: '全ての施設を10,000個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 10000) },
  { id: 'm13_buildings100000000', stage: 13, icon: '🏘️', name: '施設を合計100,000,000個所有しよう', desc: '種類を問わず施設を合計1億個所有する', check: (s) => totalBuildingsOwned(s) >= 100000000 },
  { id: 'm13_happycap3000', stage: 13, icon: '😊', name: '幸福度の上限を3,000%まで引き上げよう', desc: '幸福度政策・名声ショップ・次元ショップを重ねて上限を引き上げる', check: (s) => happinessCapFromState(s) >= 3000 },
  { id: 'm13_fusion20', stage: 13, icon: '💠', name: '次元融合を20回行おう', desc: '次元融合の累計回数が20回に到達する', check: (s) => (s.dimensionFusionCount || 0) >= 20 },
  { id: 'm13_prestige150', stage: 13, icon: '🌟', name: '都市合併を150回行おう', desc: '都市合併の累計回数が150回に到達する', check: (s) => (s.prestigeCount || 0) >= 150 },
  { id: 'm13_quests150', stage: 13, icon: '📜', name: 'ミッションを150個達成しよう', desc: '恒久ミッションの累計達成数が150個に到達する', check: (s) => (s.questsClaimed || []).length >= 150 },

  // Stage 14: 神話への扉(レリックショップに踏み出す)
  { id: 'm14_first_relic', stage: 14, icon: '🏺', name: '初めてレリックを手に入れよう', desc: 'レリックショップのアイテムを1個購入する(全実績・全名声ショップの完全制覇が前提)', check: (s) => (s.relicShopUpgrades || []).length >= 1 },
  { id: 'm14_relic4', stage: 14, icon: '🏺', name: 'レリックを4個購入しよう', desc: 'レリックショップのアイテムを合計4個購入する', check: (s) => (s.relicShopUpgrades || []).length >= 4 },
  { id: 'm14_money1e80', stage: 14, icon: '💰', name: '累計1×10^80円を突破しよう', desc: '累計獲得資金が10^80円に到達する', check: (s) => s.lifetimeMoney >= 1e80 },
  { id: 'm14_money1e90', stage: 14, icon: '💰', name: '累計1×10^90円を突破しよう', desc: '累計獲得資金が10^90円に到達する', check: (s) => s.lifetimeMoney >= 1e90 },
  { id: 'm14_balanced25000', stage: 14, icon: '🌟', name: '全ての施設を25,000個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 25000) },
  { id: 'm14_balanced50000', stage: 14, icon: '🌟', name: '全ての施設を50,000個以上ずつ所有しよう', desc: 'バランスよく全施設をさらに育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 50000) },
  { id: 'm14_dimshop_all2', stage: 14, icon: '💠', name: '次元ショップの完全制覇を確認しよう', desc: `次元ショップの全${DIMENSION_SHOP.length}アイテムをコンプリートする`, check: (s) => (s.dimensionShopUpgrades || []).length >= DIMENSION_SHOP.length },
  { id: 'm14_buildings1000000000', stage: 14, icon: '🏙️', name: '施設を合計1,000,000,000個所有しよう', desc: '種類を問わず施設を合計10億個所有する', check: (s) => totalBuildingsOwned(s) >= 1000000000 },
  { id: 'm14_quests200', stage: 14, icon: '📜', name: 'ミッションを200個達成しよう', desc: '恒久ミッションの累計達成数が200個に到達する', check: (s) => (s.questsClaimed || []).length >= 200 },

  // Stage 15: 神話級都市(真の最終段階)
  { id: 'm15_relic_all', stage: 15, icon: '🏺', name: 'レリックショップを全て購入しよう', desc: `レリックショップの全${RELIC_SHOP.length}アイテムをコンプリートする`, check: (s) => (s.relicShopUpgrades || []).length >= RELIC_SHOP.length },
  { id: 'm15_balanced100000', stage: 15, icon: '👑', name: '全ての施設を100,000個以上ずつ所有しよう', desc: '真の完全制覇へ向けて、全施設を極限まで育てる', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 100000) },
  { id: 'm15_money1e100', stage: 15, icon: '💰', name: '累計1×10^100円(1グーゴル)を突破しよう', desc: '累計獲得資金が10^100円に到達する', check: (s) => s.lifetimeMoney >= 1e100 },
  { id: 'm15_ach_all2', stage: 15, icon: '🏆', name: '実績を全て達成しよう(再確認)', desc: '実績を1つ残らず全て達成する', check: (s) => (s.achievements || []).length >= ACHIEVEMENTS.length },
  { id: 'm15_fusion50', stage: 15, icon: '💠', name: '次元融合を50回行おう', desc: '次元融合の累計回数が50回に到達する', check: (s) => (s.dimensionFusionCount || 0) >= 50 },
  { id: 'm15_buildings10000000000', stage: 15, icon: '🏙️', name: '施設を合計100億個所有しよう', desc: '種類を問わず施設を合計100億個所有する', check: (s) => totalBuildingsOwned(s) >= 10000000000 },
  { id: 'm15_quests300', stage: 15, icon: '📜', name: 'ミッションを300個達成しよう', desc: '恒久ミッションの累計達成数が300個に到達する', check: (s) => (s.questsClaimed || []).length >= 300 },
  { id: 'm15_final', stage: 15, icon: '🎉', name: 'タウンDELUXEを神話級に完全制覇しよう', desc: '全実績・全名声ショップ・全次元ショップ・全レリック・全施設100,000個以上を同時に達成する', check: (s) => (s.achievements || []).length >= ACHIEVEMENTS.length && (s.fameShopUpgrades || []).length >= FAME_SHOP.length && (s.dimensionShopUpgrades || []).length >= DIMENSION_SHOP.length && (s.relicShopUpgrades || []).length >= RELIC_SHOP.length && BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 100000) }
];
const QUESTS_BY_ID = new Map(QUESTS.map((q) => [q.id, q]));
const QUEST_STAGE_NAMES = [
  'はじめの一歩', '町の基盤づくり', '経済成長', '拡張と発展', '更なる高み',
  '名声への道', '銀河評議会', '第二部の入口', '無限への挑戦', '究極完全都市',
  '次元融合の扉', '次元経済圏', '完全なる名声', '神話への扉', '神話級都市'
];
const QUEST_STAGE_COUNT = QUESTS.reduce((max, q) => Math.max(max, q.stage), 0);
// stageごとの報酬テーブル(index 0 = stage1)。floor未満にはならず、収入に応じてさらに上乗せされる
const QUEST_STAGE_REWARD = [
  { floor: 20,         mult: 2 },
  { floor: 150,        mult: 6 },
  { floor: 1000,       mult: 15 },
  { floor: 8000,       mult: 35 },
  { floor: 60000,      mult: 70 },
  { floor: 500000,     mult: 130 },
  { floor: 4000000,    mult: 220 },
  { floor: 30000000,   mult: 350 },
  { floor: 250000000,  mult: 500 },
  { floor: 2000000000, mult: 700 },
  { floor: 16000000000,    mult: 1000 },
  { floor: 130000000000,   mult: 1400 },
  { floor: 1000000000000,  mult: 2000 },
  { floor: 8000000000000,  mult: 2800 },
  { floor: 65000000000000, mult: 4000 }
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
const UPGRADE_MILESTONES = [10, 25, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2500];
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
    { at: 10000000000, cost: 6000000000, name: '👆 元気な握手 Lv.5', mult: 2 },
    { at: 1000000000000, cost: 500000000000, name: '👆 元気な握手 Lv.6', mult: 2 },
    { at: 100000000000000, cost: 40000000000000, name: '👆 元気な握手 Lv.7', mult: 2 },
    { at: 10000000000000000, cost: 3000000000000000, name: '👆 元気な握手 Lv.8', mult: 2 },
    { at: 1000000000000000000, cost: 200000000000000000, name: '👆 元気な握手 Lv.9', mult: 2 }
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

  [1, 5, 20].forEach((v) => {
    list.push({
      id: `ach_fire_survived_${v}`, name: `🔥 火事を乗り越えた${v}回`,
      desc: `火事の発生を${v}回乗り越える`,
      check: (s) => ((s.hazards && s.hazards.fire && s.hazards.fire.survived) || 0) >= v
    });
  });
  [1, 10, 30].forEach((v) => {
    list.push({
      id: `ach_fire_cured_${v}`, name: `🚒 消防隊の活躍${v}回`,
      desc: `消防活動で火事を${v}回早期鎮火させる`,
      check: (s) => ((s.hazards && s.hazards.fire && s.hazards.fire.cured) || 0) >= v
    });
  });
  [1, 10, 50].forEach((v) => {
    list.push({
      id: `ach_fire_prevented_${v}`, name: `🧯 火事を未然に防いだ${v}回`,
      desc: `消防系施設の力で火事を${v}回未然に防ぐ`,
      check: (s) => ((s.hazards && s.hazards.fire && s.hazards.fire.prevented) || 0) >= v
    });
  });

  [1, 10, 50].forEach((v) => {
    list.push({
      id: `ach_crime_prevented_${v}`, name: `🚓 犯罪を未然に防いだ${v}回`,
      desc: `交番の力で犯罪を${v}回未然に防ぐ`,
      check: (s) => (s.crimePrevented || 0) >= v
    });
  });
  [1, 5, 20].forEach((v) => {
    list.push({
      id: `ach_crime_survived_${v}`, name: `🕵️ 被害を乗り越えた${v}回`,
      desc: `犯罪被害を${v}回乗り越える`,
      check: (s) => (s.crimeOccurred || 0) >= v
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
  list.push({ id: 'ach_fame_shop_complete', name: '💎 名声の頂点', desc: '名声ショップの全アップグレードを取得する', check: (s) => (s.fameShopUpgrades || []).length >= FAME_SHOP.length });
  [1, 3, 6, 9].forEach((v) => {
    list.push({
      id: `ach_expansion_${v}`, name: `🏘️ 町の拡張${v}回`,
      desc: `町の拡張を${v}回行う`,
      check: (s) => (s.townExpansions || []).length >= v
    });
  });
  list.push({ id: 'ach_expansion_complete', name: '🌌 究極の大都市', desc: '町の拡張を全て行い、最大人口を極限まで引き上げる', check: (s) => (s.townExpansions || []).length >= TOWN_EXPANSIONS.length });
  BGM_TRACKS.filter((t) => t.price > 0).forEach((t) => {
    list.push({ id: `ach_bgm_${t.id}`, name: `🎵 BGM『${t.name}』解放`, desc: `BGM『${t.name}』を購入して解放する`, check: (s) => (s.bgmUnlocked || []).includes(t.id) });
  });
  list.push({ id: 'ach_rank_top', name: `👑 ${RANK_TIERS[RANK_TIERS.length - 1].title}に到達`, desc: `最高位の称号「${RANK_TIERS[RANK_TIERS.length - 1].title}」を獲得する`, check: (s) => rankIndexFor(s.lifetimeMoney) >= RANK_TIERS.length - 1 });
  list.push({ id: 'ach_season_cold', name: '🥶 冬の備え', desc: '冬の陳情で「暖房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('cold') });
  list.push({ id: 'ach_season_heat', name: '🥵 夏の備え', desc: '夏の陳情で「冷房設備を導入する」を選ぶ', check: (s) => (s.seasonalComplaintsResolved || []).includes('heat') });

  list.push({ id: 'ach_happiness_100', name: '😊 幸福な町', desc: '幸福度100%以上を達成', check: (s) => s.happiness >= 100 });
  list.push({ id: 'ach_happiness_150', name: '😆 楽園都市', desc: '幸福度150%以上を達成', check: (s) => s.happiness >= 150 });
  list.push({ id: 'ach_happiness_expansion_complete', name: '🌠 至福の頂点', desc: '幸福度政策を全て行い、幸福度の上限を極限まで引き上げる', check: (s) => (s.happinessExpansions || []).length >= HAPPINESS_EXPANSIONS.length });
  list.push({ id: 'ach_all_buildings', name: '🏙️ フルコンプ都市', desc: '全ての施設を1つ以上所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1) });
  {
    const last = BUILDINGS[BUILDINGS.length - 1];
    list.push({ id: 'ach_final_building', name: `${last.emoji} ${last.name}に到達`, desc: `最新の施設「${last.name}」を1つ以上建設する`, check: (s) => (s.buildings[last.id] || 0) >= 1 });
  }
  list.push({ id: 'ach_balanced_10', name: '⚖️ バランス都市', desc: '全ての施設を10個以上ずつ所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 10) });
  list.push({ id: 'ach_balanced_50', name: '🌈 万能都市', desc: '全ての施設を50個以上ずつ所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 50) });
  list.push({ id: 'ach_balanced_200', name: '🌟 完全都市', desc: '全ての施設を200個以上ずつ所有する', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 200) });
  list.push({ id: 'ach_balanced_1000', name: '👑 究極完全都市', desc: '全ての施設を1000個以上ずつ所有する。真の完全制覇。', check: (s) => BUILDINGS.every((b) => (s.buildings[b.id] || 0) >= 1000) });
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

// id→定義 のO(1)ルックアップ用。アップグレード/名声ショップ項目が数百件規模になったため、
// 所持数×全件数の総当たり(.find()をループ内で呼ぶ)を避けるために用意。
const UPGRADES_BY_ID = new Map(UPGRADES.map((u) => [u.id, u]));
const FAME_SHOP_BY_ID = new Map(FAME_SHOP.map((f) => [f.id, f]));

// 町の装飾コレクション: 実績の達成数に応じて自動的に街へ現れる、経済効果のない見た目だけの飾り。
// 「所持」の概念がなく実績数だけで判定するため、専用の状態は持たない(購入・claim不要)。
const DECORATIONS = [
  { id: 'deco_fountain',        name: '噴水',           emoji: '⛲', need: 5,    desc: '実績5個達成で街に噴水が現れる。' },
  { id: 'deco_statue',          name: '銅像',           emoji: '🗿', need: 20,   desc: '実績20個達成で街に銅像が現れる。' },
  { id: 'deco_clocktower',      name: '時計台',         emoji: '🕰️', need: 50,   desc: '実績50個達成で街に時計台が現れる。' },
  { id: 'deco_torii',           name: '鳥居',           emoji: '⛩️', need: 100,  desc: '実績100個達成で街に鳥居が現れる。' },
  { id: 'deco_carousel',        name: 'メリーゴーランド', emoji: '🎠', need: 200,  desc: '実績200個達成で街にメリーゴーランドが現れる。' },
  { id: 'deco_lantern',         name: '提灯通り',       emoji: '🏮', need: 300,  desc: '実績300個達成で街に提灯が灯る。' },
  { id: 'deco_bridge',          name: 'ライトアップ橋', emoji: '🌉', need: 400,  desc: '実績400個達成で街に橋が架かる。' },
  { id: 'deco_mural',           name: '壁画',           emoji: '🎨', need: 500,  desc: '実績500個達成で街に壁画が描かれる。' },
  { id: 'deco_circus',          name: 'サーカステント', emoji: '🎪', need: 600,  desc: '実績600個達成で街にサーカステントが現れる。' },
  { id: 'deco_shrine',          name: '神殿',           emoji: '🛕', need: 700,  desc: '実績700個達成で街に神殿が現れる。' },
  { id: 'deco_rainbow',         name: '虹のオブジェ',   emoji: '🌈', need: 800,  desc: '実績800個達成で街に虹のオブジェが現れる。' },
  { id: 'deco_fireworks_deck',  name: '花火台',         emoji: '🎇', need: 900,  desc: '実績900個達成で街に花火台が現れる。' },
  { id: 'deco_crown',           name: '王冠モニュメント', emoji: '👑', need: 1000, desc: '実績1,000個達成で街に王冠モニュメントが現れる。' },
  { id: 'deco_starmap',         name: '星図モニュメント', emoji: '🌌', need: 1150, desc: '実績1,150個達成で街に星図モニュメントが現れる。' },
  { id: 'deco_infinity',        name: '無限記念碑',     emoji: '♾️', need: ACHIEVEMENTS.length, desc: '全実績達成で街に無限記念碑が現れる。町の完全制覇の証。' }
];

function formatNum(n) {
  n = Math.floor(n * 100) / 100;
  if (n < 0) return '-' + formatNum(-n);
  if (n < 1000) return (Math.round(n * 100) / 100).toLocaleString('ja-JP');
  // 第二部の施設(夢想収集庁〜次なる宇宙の種)は京(1e16)を大きく超えるため、
  // 伝統的な大数の単位(垓・秭・穣…)を無量大数まで用意しておく。
  const units = [
    { v: 1e68, s: '無量大数' }, { v: 1e64, s: '不可思議' }, { v: 1e60, s: '那由他' }, { v: 1e56, s: '阿僧祇' },
    { v: 1e52, s: '恒河沙' }, { v: 1e48, s: '極' }, { v: 1e44, s: '載' }, { v: 1e40, s: '正' },
    { v: 1e36, s: '澗' }, { v: 1e32, s: '溝' }, { v: 1e28, s: '穣' }, { v: 1e24, s: '秭' }, { v: 1e20, s: '垓' },
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
