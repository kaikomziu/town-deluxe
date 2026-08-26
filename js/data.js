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
  { id: 'dream_archive', name: '夢想収集庁', emoji: '🌙', baseCost: 1500000000000000000, baseIncome: 25000000000, pop: 100000, happiness: 43, desc: '人々の夢を収集し記録する不思議な庁舎。眠りの中の町がここに生まれる。' },
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
  { id: 'causality_engine', name: '因果律機関', emoji: '⚙️', baseCost: 90000000000000000000000000, baseIncome: 1100000000000000, pop: 460000000, happiness: 97, desc: '原因と結果を意のままに操る機関。町の発展速度そのものを加速させる。' },
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
  { id: 'next_universe_seed', name: '次なる宇宙の種', emoji: '🌌', baseCost: 230000000000000000000000000000000000000, baseIncome: 35000000000000000000000, pop: 316000000000000, happiness: 184, desc: '次の宇宙を芽吹かせる種。この町の物語は、まだ終わらない。' }
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
  { id: 'expand_22', cost: 500000000000000000000000,    popBonus: 12000000000, name: '🌠 全存在都市連邦',    desc: 'あらゆる存在を受け入れる、最大人口が+12,000,000,000人される。' }
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
  { id: 'happy_22', cost: 500000000000000000000000,    capBonus: 2500, name: '♾️ 幸福度、無限大',     desc: '幸福度の上限が永久にさらに+2,500され、もはや上限という概念が意味を失う。' }
];
const HAPPINESS_EXPANSIONS_BY_ID = new Map(HAPPINESS_EXPANSIONS.map((e) => [e.id, e]));

// 名声ショップ: 都市合併で得た名声ポイントを使って買う恒久アップグレード(合併しても失われない)。
// tierは解放に必要な累計都市合併回数(FAME_SHOP_TIER_REQUIREMENTのインデックスに対応)で、
// 周回(都市合併)を重ねるほど新しいティアが開放されていくエンドコンテンツ。
const FAME_SHOP_TIER_REQUIREMENT = [0, 3, 7, 15, 30, 50, 75, 110, 160, 230, 320];
const FAME_SHOP = [
  // Tier 1: いつでも購入可(名声ポイントさえあれば)
  { id: 'fame_income_1',  tier: 0, cost: 5,   name: '💹 効率化都市計画 I',   desc: '全施設の収入が永久に+10%される。',                       effect: { type: 'incomeMult', value: 1.10 } },
  { id: 'fame_click_1',   tier: 0, cost: 5,   name: '👆 熟練の握手',         desc: '町役場クリックの獲得資金が永久に+20%される。',             effect: { type: 'clickMult', value: 1.20 } },
  { id: 'fame_petition_1',tier: 0, cost: 8,   name: '😊 御用聞きの心得',     desc: '陳情に応えた時の幸福度上昇が永久に+20%される。',           effect: { type: 'petitionAgreeMult', value: 1.20 } },
  { id: 'fame_rain_1',    tier: 0, cost: 8,   name: '☀️ 気象予報士常駐',     desc: '恵みの雨イベントが永久に約25%発生しやすくなる。',           effect: { type: 'rainFreqMult', value: 0.75 } },
  { id: 'fame_ufo_1',     tier: 0, cost: 8,   name: '🛸 電波観測所 I',       desc: 'UFOが永久に約20%出現しやすくなる。',                       effect: { type: 'ufoFreqMult', value: 0.8 } },
  { id: 'fame_petition_time_1', tier: 0, cost: 6, name: '⏳ 陳情猶予延長 I',  desc: '陳情に答えられる制限時間が永久に+20%延長される。',           effect: { type: 'petitionTimeMult', value: 1.2 } },
  // Tier 2: 都市合併3回で解放
  { id: 'fame_income_2',  tier: 1, cost: 20,  name: '💹 効率化都市計画 II',  desc: '全施設の収入が永久にさらに+15%される。',                   effect: { type: 'incomeMult', value: 1.15 } },
  { id: 'fame_offline_1', tier: 1, cost: 25,  name: '🌙 越境オフライン協定', desc: 'オフライン収益の上限が8時間→16時間に延長される。',           effect: { type: 'offlineCapHours', value: 16 } },
  { id: 'fame_hospital_1',tier: 1, cost: 25,  name: '🛡️ 医療ネットワーク強化', desc: '医療系施設による病気予防の効果が永久に+30%される。',        effect: { type: 'preventionMult', value: 1.30 } },
  { id: 'fame_golden_1',  tier: 1, cost: 20,  name: '✨ ゴールデンタイム延長', desc: 'ゴールデンビルの出現時間が永久に+50%延長される。',         effect: { type: 'goldenDurationMult', value: 1.5 } },
  { id: 'fame_petition_2',tier: 1, cost: 22,  name: '😊 御用聞きの心得 II',   desc: '陳情に応えた時の幸福度上昇が永久にさらに+20%される。',       effect: { type: 'petitionAgreeMult', value: 1.20 } },
  { id: 'fame_happiness_0',tier: 1, cost: 18, name: '🎗️ 町政運営基盤',      desc: '町の幸福度基準値が永久に+8される。',                       effect: { type: 'happinessBonusFlat', value: 8 } },
  { id: 'fame_sickness_severity_1', tier: 1, cost: 22, name: '💊 公衆衛生キャンペーン I', desc: '病気イベントの深刻度が永久に約20%軽減される。',    effect: { type: 'sicknessSeverityMult', value: 0.8 } },
  { id: 'fame_mission_1', tier: 1, cost: 20,  name: '🎯 ミッション報奨金 I',  desc: 'デイリーミッションの報酬が永久に+20%される。',             effect: { type: 'missionRewardMult', value: 1.2 } },
  // Tier 3: 都市合併7回で解放
  { id: 'fame_income_3',  tier: 2, cost: 60,  name: '💹 効率化都市計画 III', desc: '全施設の収入が永久にさらに+20%される。',                   effect: { type: 'incomeMult', value: 1.20 } },
  { id: 'fame_autobuy',   tier: 2, cost: 80,  name: '🤖 執事の自動購入',     desc: '買える中で最も安い施設を自動で購入してくれる執事を雇う。',   effect: { type: 'autoBuy', value: true } },
  { id: 'fame_offline_2', tier: 2, cost: 60,  name: '🌙 越境オフライン協定 II', desc: 'オフライン収益の上限が16時間→24時間に延長される。',      effect: { type: 'offlineCapHours', value: 24 } },
  { id: 'fame_golden_2',  tier: 2, cost: 50,  name: '✨ ゴールデンビル頻発', desc: 'ゴールデンビルが永久に約20%出現しやすくなる。',            effect: { type: 'goldenFreqMult', value: 0.8 } },
  { id: 'fame_click_2',   tier: 2, cost: 55,  name: '👆 熟練の握手 II',      desc: '町役場クリックの獲得資金が永久にさらに+25%される。',       effect: { type: 'clickMult', value: 1.25 } },
  { id: 'fame_rain_2',    tier: 2, cost: 50,  name: '☀️ 気象予報士常駐 II',  desc: '恵みの雨イベントが永久にさらに約15%発生しやすくなる。',     effect: { type: 'rainFreqMult', value: 0.85 } },
  { id: 'fame_prevention_2', tier: 2, cost: 55, name: '🛡️ 医療ネットワーク強化 II', desc: '医療系施設による病気予防の効果が永久にさらに+20%される。', effect: { type: 'preventionMult', value: 1.20 } },
  { id: 'fame_sickness_duration_1', tier: 2, cost: 55, name: '⏱️ 早期収束プロトコル I', desc: '病気イベントの流行期間が永久に約20%短縮される。',  effect: { type: 'sicknessDurationMult', value: 0.8 } },
  { id: 'fame_petition_time_2', tier: 2, cost: 50, name: '⏳ 陳情猶予延長 II', desc: '陳情に答えられる制限時間が永久にさらに+20%延長される。',   effect: { type: 'petitionTimeMult', value: 1.2 } },
  // Tier 4: 都市合併15回で解放(真のエンドコンテンツ)
  { id: 'fame_income_4',  tier: 3, cost: 200, name: '💹 効率化都市計画 IV',  desc: '全施設の収入が永久にさらに+30%される。',                   effect: { type: 'incomeMult', value: 1.30 } },
  { id: 'fame_happiness_1',tier: 3, cost: 250, name: '🌌 銀河評議会の椅子', desc: '町の幸福度基準値が永久に+15される。',                     effect: { type: 'happinessBonusFlat', value: 15 } },
  { id: 'fame_prestige_th',tier: 3, cost: 300, name: '👑 伝説の統治',       desc: '都市合併に必要な累計資金がずっと10%引き下げられる。',       effect: { type: 'prestigeThresholdMult', value: 0.9 } },
  { id: 'fame_petition_3',tier: 3, cost: 220, name: '😊 御用聞きの心得 III', desc: '陳情に応えた時の幸福度上昇が永久にさらに+25%される。',      effect: { type: 'petitionAgreeMult', value: 1.25 } },
  { id: 'fame_golden_3',  tier: 3, cost: 210, name: '✨ ゴールデンタイム延長 II', desc: 'ゴールデンビルの出現時間が永久にさらに+30%延長される。', effect: { type: 'goldenDurationMult', value: 1.3 } },
  { id: 'fame_ufo_2',     tier: 3, cost: 200, name: '🛸 電波観測所 II',      desc: 'UFOが永久にさらに約25%出現しやすくなる。',                 effect: { type: 'ufoFreqMult', value: 0.75 } },
  { id: 'fame_mission_2', tier: 3, cost: 220, name: '🎯 ミッション報奨金 II', desc: 'デイリーミッションの報酬が永久にさらに+20%される。',       effect: { type: 'missionRewardMult', value: 1.2 } },
  { id: 'fame_gain_1',    tier: 3, cost: 280, name: '🎖️ 名声増幅回路 I',    desc: '都市合併で得られる名声ポイントが永久に+10%される。',        effect: { type: 'fameGainMult', value: 1.10 } },
  // Tier 5: 都市合併30回で解放(周回を重ねた者だけが辿り着く最終ティア)
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
  // Tier 6: 都市合併50回で解放
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
  // Tier 7: 都市合併75回で解放
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
  // Tier 8: 都市合併110回で解放
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
  // Tier 9: 都市合併160回で解放
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
  // Tier 10: 都市合併230回で解放
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
  // Tier 11: 都市合併320回で解放(周回の果てに辿り着く真の最終ティア)
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
