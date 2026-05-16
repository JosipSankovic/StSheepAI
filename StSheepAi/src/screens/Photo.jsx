import React from 'react'
import { Icon } from '../icons.jsx'
import { Placeholder, ScreenHeader } from '../ui.jsx'

/* AI Photo Guide — flow:
   1. Pick language
   2. Camera viewfinder with localized instruction
   3. Capture (animated scan) → 3 result cards:
      - What is it / what was it used for
      - Some facts about it
      - What it is used for today
*/

const LANGS = [
  { code: "en", label: "English",   flag: "🇬🇧", speech: "en-US" },
  { code: "hr", label: "Hrvatski",  flag: "🇭🇷", speech: "hr-HR" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪", speech: "de-DE" },
  { code: "it", label: "Italiano",  flag: "🇮🇹", speech: "it-IT" },
  { code: "fr", label: "Français",  flag: "🇫🇷", speech: "fr-FR" },
  { code: "es", label: "Español",   flag: "🇪🇸", speech: "es-ES" },
  { code: "ja", label: "日本語",    flag: "🇯🇵", speech: "ja-JP" },
  { code: "zh", label: "中文",      flag: "🇨🇳", speech: "zh-CN" },
  { code: "ko", label: "한국어",    flag: "🇰🇷", speech: "ko-KR" },
];

const COPY = {
  en: { kicker: "AI Photo Guide", title: "Point. Snap. Learn.",
        sub: "We'll identify the landmark and tell you its story.",
        choose: "Choose your language",
        ready: "Got it. Now point your camera at a landmark in Split and tap the shutter.",
        instr: "Point your camera at a landmark and tap to capture.",
        ident: "Identifying…",
        capture: "Capture",
        retake: "Try another",
        labels: { c1: "What is this?", c2: "Did you know?", c3: "Today it's used for…" } },
  hr: { kicker: "AI vodič kroz fotografije", title: "Uperi. Slikaj. Saznaj.",
        sub: "Prepoznat ćemo znamenitost i ispričati ti njezinu priču.",
        choose: "Odaberite svoj jezik",
        ready: "Odlično. Uperite kameru u znamenitost u Splitu i pritisnite okidač.",
        instr: "Uperite kameru u znamenitost i dodirnite za slikanje.",
        ident: "Prepoznajem…",
        capture: "Slikaj",
        retake: "Pokušaj ponovo",
        labels: { c1: "Što je ovo?", c2: "Jeste li znali?", c3: "Danas se koristi za…" } },
  de: { kicker: "AI-Fotoführer", title: "Zielen. Klicken. Lernen.",
        sub: "Wir erkennen das Wahrzeichen und erzählen seine Geschichte.",
        choose: "Wähle deine Sprache",
        ready: "Alles klar. Richte deine Kamera auf ein Wahrzeichen in Split und tippe auf den Auslöser.",
        instr: "Richte die Kamera auf ein Wahrzeichen und tippe zum Auslösen.",
        ident: "Erkenne…",
        capture: "Auslösen",
        retake: "Noch eins",
        labels: { c1: "Was ist das?", c2: "Wussten Sie?", c3: "Heute dient es als…" } },
  it: { kicker: "Guida AI fotografica", title: "Punta. Scatta. Scopri.",
        sub: "Identifichiamo il monumento e ti raccontiamo la sua storia.",
        choose: "Scegli la tua lingua",
        ready: "Perfetto. Punta la fotocamera verso un monumento di Spalato e tocca lo scatto.",
        instr: "Inquadra un monumento e tocca per scattare.",
        ident: "Identificazione…",
        capture: "Scatta",
        retake: "Prova un altro",
        labels: { c1: "Che cos'è?", c2: "Lo sapevi?", c3: "Oggi è usato per…" } },
  fr: { kicker: "Guide photo IA", title: "Visez. Cliquez. Apprenez.",
        sub: "Nous identifions le monument et vous racontons son histoire.",
        choose: "Choisis ta langue",
        ready: "Parfait. Pointe ta caméra vers un monument de Split et appuie sur le déclencheur.",
        instr: "Pointez la caméra vers un monument et appuyez pour capturer.",
        ident: "Identification…",
        capture: "Capturer",
        retake: "Essayer un autre",
        labels: { c1: "Qu'est-ce que c'est ?", c2: "Le saviez-vous ?", c3: "Aujourd'hui, c'est…" } },
  es: { kicker: "Guía de fotos IA", title: "Apunta. Dispara. Aprende.",
        sub: "Identificamos el monumento y te contamos su historia.",
        choose: "Elige tu idioma",
        ready: "Listo. Apunta tu cámara a un monumento de Split y pulsa el botón.",
        instr: "Apunta a un monumento y toca para capturar.",
        ident: "Identificando…",
        capture: "Capturar",
        retake: "Probar otro",
        labels: { c1: "¿Qué es esto?", c2: "¿Sabías que…?", c3: "Hoy se usa para…" } },
  ja: { kicker: "AIフォトガイド", title: "向ける。撮る。学ぶ。",
        sub: "ランドマークを認識し、その物語を伝えます。",
        choose: "言語を選択してください",
        ready: "OK。スプリットのランドマークにカメラを向けてシャッターをタップしてください。",
        instr: "カメラをランドマークに向けてタップ。",
        ident: "認識中…",
        capture: "撮影",
        retake: "もう一度",
        labels: { c1: "これは何ですか？", c2: "ご存知ですか？", c3: "今日では…" } },
  zh: { kicker: "AI 照片导览", title: "对准。拍照。了解。",
        sub: "我们将识别地标并讲述它的故事。",
        choose: "请选择语言",
        ready: "好的。把相机对准斯普利特的某个地标，然后点击快门。",
        instr: "把相机对准地标然后点击拍摄。",
        ident: "识别中…",
        capture: "拍摄",
        retake: "再试一张",
        labels: { c1: "这是什么？", c2: "你知道吗？", c3: "今天它的用途…" } },
  ko: { kicker: "AI 포토 가이드", title: "향하세요. 찍으세요. 알아보세요.",
        sub: "랜드마크를 인식하고 그 이야기를 들려드립니다.",
        choose: "언어를 선택하세요",
        ready: "좋아요. 스플리트의 랜드마크에 카메라를 향하고 셔터를 눌러 주세요.",
        instr: "랜드마크를 향한 후 탭하여 촬영하세요.",
        ident: "인식 중…",
        capture: "촬영",
        retake: "다시 시도",
        labels: { c1: "이것은 무엇인가요?", c2: "알고 계셨나요?", c3: "오늘날에는…" } },
};

/* Result data — for each landmark, in each language, the 3 cards */
const RESULTS = {
  peristyle: {
    name: { en: "Peristyle of Diocletian's Palace", hr: "Peristil Dioklecijanove palače", de: "Peristyl des Diokletianpalasts", it: "Peristilio del Palazzo di Diocleziano", fr: "Péristyle du Palais de Dioclétien", es: "Peristilo del Palacio de Diocleciano", ja: "ディオクレティアヌス宮殿の中庭", zh: "戴克里先宫中庭", ko: "디오클레티아누스 궁전의 페리스타일" },
    tone: "sea",
    en: {
      c1: "The ceremonial courtyard of a 1,700-year-old Roman palace — the entrance hall to Emperor Diocletian's private quarters, marked by red granite columns shipped from Egypt and a black sphinx that guarded his throne.",
      c2: "The granite sphinx on the right is 3,500 years old — older than the palace itself. Diocletian brought 12 of them from Egypt; this is the only one still here, the others smashed by early Christians.",
      c3: "Today it's Split's open-air living room — summer opera, fashion shows, sunset coffees on the steps, and the daily 'changing of the guard' re-enactment in legionnaire costume at noon.",
    },
    hr: {
      c1: "Svečano dvorište rimske palače stare 1.700 godina — predvorje carskih odaja, omeđeno crvenim granitnim stupovima dovezenim iz Egipta i crnom sfingom koja je čuvala prijestolje cara Dioklecijana.",
      c2: "Granitna sfinga zdesna stara je 3.500 godina — starija od same palače. Dioklecijan ih je dovezao 12 iz Egipta; ovo je jedina preostala, ostale su razbili rani kršćani.",
      c3: "Danas je to splitski dnevni boravak pod otvorenim nebom — ljetne opere, modne revije, kava na stepenicama o zalasku sunca i svakodnevna 'smjena straže' u legionarskim kostimima u podne.",
    },
    de: {
      c1: "Der zeremonielle Hof eines 1.700 Jahre alten römischen Palasts — Eingangshalle zu Kaiser Diokletians privaten Räumen, gesäumt von roten Granitsäulen aus Ägypten und einer schwarzen Sphinx als Wächter.",
      c2: "Die Granit-Sphinx rechts ist 3.500 Jahre alt — älter als der Palast selbst. Diokletian brachte 12 aus Ägypten mit; nur diese eine ist noch da, die anderen wurden von frühen Christen zerstört.",
      c3: "Heute ist es Splits Wohnzimmer unter freiem Himmel — Sommeropern, Modeschauen, Kaffee bei Sonnenuntergang auf den Stufen und die tägliche 'Wachablösung' in Legionärsuniform um zwölf.",
    },
    it: {
      c1: "Il cortile cerimoniale di un palazzo romano di 1.700 anni — l'ingresso agli appartamenti privati dell'imperatore Diocleziano, delimitato da colonne di granito rosso giunte dall'Egitto e da una sfinge nera.",
      c2: "La sfinge di granito sulla destra ha 3.500 anni — più antica del palazzo stesso. Diocleziano ne portò 12 dall'Egitto; questa è l'unica rimasta, le altre distrutte dai primi cristiani.",
      c3: "Oggi è il salotto a cielo aperto di Spalato — opere estive, sfilate di moda, caffè al tramonto sui gradini e il quotidiano 'cambio della guardia' in costume da legionario a mezzogiorno.",
    },
    fr: {
      c1: "La cour cérémoniale d'un palais romain vieux de 1 700 ans — l'entrée des appartements privés de l'empereur Dioclétien, bordée de colonnes de granit rouge venues d'Égypte et d'un sphinx noir gardien.",
      c2: "Le sphinx de granit à droite a 3 500 ans — plus ancien que le palais lui-même. Dioclétien en rapporta 12 d'Égypte ; celui-ci est le seul survivant, les autres brisés par les premiers chrétiens.",
      c3: "Aujourd'hui, c'est le salon à ciel ouvert de Split — opéras d'été, défilés de mode, cafés au coucher du soleil et la 'relève de la garde' en costume de légionnaire chaque midi.",
    },
    es: {
      c1: "El patio ceremonial de un palacio romano de 1.700 años — el vestíbulo a los aposentos privados del emperador Diocleciano, flanqueado por columnas de granito rojo traídas de Egipto y una esfinge negra guardiana.",
      c2: "La esfinge de granito a la derecha tiene 3.500 años — más antigua que el propio palacio. Diocleciano trajo 12 de Egipto; esta es la única que queda, las demás destruidas por los primeros cristianos.",
      c3: "Hoy es la sala de estar al aire libre de Split — óperas de verano, desfiles, café al atardecer en las escalinatas y el 'cambio de guardia' diario en traje de legionario al mediodía.",
    },
    ja: {
      c1: "1,700年前のローマ宮殿の儀式用中庭 — ディオクレティアヌス帝の私的居室への入口で、エジプトから運ばれた赤い花崗岩の柱と、玉座を守る黒い大スフィンクスが並びます。",
      c2: "右側の花崗岩のスフィンクスは3,500歳 — 宮殿よりも古いです。ディオクレティアヌスは12体をエジプトから持ち帰りましたが、初期キリスト教徒に壊され、残っているのはこれだけです。",
      c3: "今日は屋外のリビングルーム — 夏のオペラ、ファッションショー、夕焼け時の階段でのコーヒー、そして毎日正午のレジオネア衣装による「衛兵交代」。",
    },
    zh: {
      c1: "一座有1700年历史的罗马宫殿的礼仪庭院——通往戴克里先皇帝私人寝宫的入口大厅，两侧是从埃及运来的红色花岗岩柱，以及守护王座的黑色狮身人面像。",
      c2: "右侧的花岗岩狮身人面像有3500年的历史——比宫殿本身还要古老。戴克里先从埃及带回12座，现仅存这一座，其余被早期基督徒砸毁。",
      c3: "如今这里是斯普利特的露天客厅——夏季歌剧、时装秀、台阶上的日落咖啡，以及每天中午身着罗马军团服装的「换岗仪式」。",
    },
    ko: {
      c1: "1,700년 된 로마 궁전의 의례용 안뜰 — 디오클레티아누스 황제의 사적 공간으로 가는 현관으로, 이집트에서 가져온 붉은 화강암 기둥과 옥좌를 지키던 검은 스핑크스가 늘어서 있습니다.",
      c2: "오른쪽의 화강암 스핑크스는 3,500년 된 것 — 궁전 자체보다 더 오래되었습니다. 디오클레티아누스가 이집트에서 12개를 가져왔는데, 초기 기독교인들이 부수어 지금은 이것만 남아 있습니다.",
      c3: "오늘날에는 스플리트의 야외 거실 — 여름 오페라, 패션쇼, 계단에서 즐기는 일몰 커피, 그리고 매일 정오에 열리는 로마 군단 복장의 '근위병 교대식'.",
    },
  },
  belltower: {
    name: { en: "Cathedral of St. Domnius — bell tower", hr: "Zvonik katedrale sv. Duje", de: "Glockenturm der Kathedrale St. Domnius", it: "Campanile della Cattedrale di San Doimo", fr: "Clocher de la cathédrale Saint-Domnius", es: "Campanario de la Catedral de San Domnio", ja: "聖ドムニウス大聖堂の鐘楼", zh: "圣杜耶大教堂钟楼", ko: "성 도므니우스 대성당 종탑" },
    tone: "sun",
    en: {
      c1: "A 60-meter Romanesque bell tower rising above what was originally Emperor Diocletian's mausoleum — converted into a Christian cathedral in the 7th century, making it one of the oldest cathedrals in continuous use.",
      c2: "Diocletian persecuted Christians; his tomb was emptied and re-consecrated to St. Domnius — a bishop he had executed. Karma, with a stone bell tower attached.",
      c3: "Today you can climb the 183 steel steps (€7) for the best view in Split — and the cathedral still holds Mass every Sunday morning at 7:30.",
    },
    hr: {
      c1: "Romanički zvonik visok 60 metara uzdiže se iznad nekadašnjeg mauzoleja cara Dioklecijana — pretvorenog u kršćansku katedralu u 7. stoljeću, jednu od najstarijih u stalnoj upotrebi.",
      c2: "Dioklecijan je progonio kršćane; njegov je grob ispražnjen i posvećen sv. Duji — biskupu kojeg je sam dao pogubiti. Karma od kamena.",
      c3: "Danas se može popeti uz 183 čelične stube (€7) za najbolji pogled u Splitu — a u katedrali se i dalje služi misa svake nedjelje u 7:30.",
    },
    de: { c1: "Ein 60 Meter hoher romanischer Glockenturm über dem ehemaligen Mausoleum Kaiser Diokletians — im 7. Jahrhundert in eine christliche Kathedrale umgewandelt, eine der ältesten ununterbrochen genutzten.", c2: "Diokletian verfolgte Christen; sein Grab wurde geleert und St. Domnius geweiht — einem Bischof, den er hinrichten ließ. Karma in Stein.", c3: "Heute kann man die 183 Stufen erklimmen (€7) und genießt den besten Blick über Split — und sonntags um 7:30 wird noch immer Messe gelesen." },
    it: { c1: "Un campanile romanico di 60 metri sopra quello che era il mausoleo dell'imperatore Diocleziano — trasformato in cattedrale cristiana nel VII secolo, una delle più antiche in uso continuo.", c2: "Diocleziano perseguitò i cristiani; la sua tomba fu svuotata e riconsacrata a San Doimo — un vescovo che lui stesso aveva fatto giustiziare. Karma di pietra.", c3: "Oggi puoi salire i 183 gradini (€7) per la vista più bella su Spalato — e ogni domenica alle 7:30 si celebra ancora la messa." },
    fr: { c1: "Un clocher roman de 60 m s'élevant au-dessus de l'ancien mausolée de l'empereur Dioclétien — converti en cathédrale chrétienne au 7ᵉ siècle, l'une des plus anciennes encore en activité.", c2: "Dioclétien persécutait les chrétiens ; sa tombe fut vidée et reconsacrée à saint Domnius — un évêque qu'il avait fait exécuter. Karma de pierre.", c3: "Aujourd'hui, on grimpe les 183 marches (7 €) pour la meilleure vue de Split — et la messe y est toujours célébrée le dimanche à 7h30." },
    es: { c1: "Un campanario románico de 60 m sobre el antiguo mausoleo del emperador Diocleciano — convertido en catedral cristiana en el siglo VII, una de las más antiguas en uso continuo.", c2: "Diocleciano persiguió a los cristianos; su tumba fue vaciada y consagrada a san Domnio — un obispo al que él mismo mandó ejecutar. Karma en piedra.", c3: "Hoy puedes subir los 183 escalones (€7) para tener las mejores vistas de Split — y la misa se sigue celebrando los domingos a las 7:30." },
    ja: { c1: "60mのロマネスク様式の鐘楼。元はディオクレティアヌス帝の霊廟で、7世紀にキリスト教大聖堂に改築された、現役で最古級の大聖堂です。", c2: "ディオクレティアヌスはキリスト教徒を迫害しましたが、墓は空にされ、彼が処刑させた司教・聖ドムニウスに捧げられました。", c3: "今は183段の鉄階段（€7）を上ればスプリット随一の眺望。日曜午前7:30にはミサも続いています。" },
    zh: { c1: "一座60米高的罗马式钟楼，矗立在戴克里先皇帝原陵墓之上——7世纪改建为基督教大教堂，是仍在使用的最古老大教堂之一。", c2: "戴克里先曾迫害基督徒；他的陵墓被清空后献给圣杜耶——一位被他下令处决的主教。报应化为石塔。", c3: "如今可登上183级铁梯（€7），俯瞰斯普利特最佳视野——每周日早晨7:30仍举行弥撒。" },
    ko: { c1: "60m 높이의 로마네스크 양식 종탑으로, 원래는 디오클레티아누스 황제의 영묘 위에 세워졌고 7세기에 기독교 대성당으로 개조되었습니다. 현존하는 가장 오래된 대성당 중 하나.", c2: "디오클레티아누스는 기독교인을 박해했지만, 그의 무덤은 비워져 그가 처형한 주교 성 도므니우스에게 봉헌되었습니다. 돌로 된 인과응보.", c3: "지금은 183개의 철 계단(€7)을 올라 스플리트 최고의 전망을 즐길 수 있으며, 매주 일요일 오전 7시 30분에 미사가 열립니다." },
  },
  riva: {
    name: { en: "The Riva — Split's seafront promenade", hr: "Riva — splitska obalna šetnica", de: "Die Riva — Splits Strandpromenade", it: "La Riva — il lungomare di Spalato", fr: "La Riva — promenade en bord de mer", es: "La Riva — paseo marítimo de Split", ja: "リヴァ（海沿いの遊歩道）", zh: "里瓦——斯普利特海滨长廊", ko: "리바 — 스플리트 해변 산책로" },
    tone: "terra",
    en: {
      c1: "The wide marble-paved seafront strip along the harbor — lined with palms, café terraces, and the white south wall of Diocletian's Palace. Before 1800 the sea reached the palace walls; it was extended under French Marshal Marmont.",
      c2: "Each palm on the Riva has been replanted multiple times — they keep dying in cold winters and being quietly swapped out at night so tourists don't notice.",
      c3: "Today the Riva is Split's social heart — evening passeggiata around 7 pm, football victory parades, summer concerts and the start of every parade.",
    },
    hr: { c1: "Mramorom popločana obala duž luke — s palmama, kavanama i bijelim južnim zidom Dioklecijanove palače. Prije 1800. more je dopiralo do palače; obala je proširena za francuskog maršala Marmonta.", c2: "Svaka palma na Rivi presađivana je više puta — propadaju zimi pa ih se noću potiho mijenja kako turisti ne bi primijetili.", c3: "Danas je Riva splitsko srce — večernji korzo oko 19 sati, nogometne fešte, ljetni koncerti i početak svake povorke." },
    de: { c1: "Die breite, mit Marmor gepflasterte Uferpromenade — Palmen, Cafés und die weiße Südwand des Diokletianpalasts. Vor 1800 reichte das Meer bis an die Mauern; unter Marschall Marmont wurde sie aufgeschüttet.", c2: "Jede Palme an der Riva wurde mehrfach neu gepflanzt — sie sterben im kalten Winter und werden nachts heimlich ausgetauscht, damit es niemand merkt.", c3: "Heute ist die Riva Splits Wohnzimmer — Abendkorso um 19 Uhr, Fußball-Paraden, Sommerkonzerte und Start jeder Prozession." },
    it: { c1: "La larga passeggiata pavimentata in marmo lungo il porto — palme, caffè e la parete bianca meridionale del Palazzo di Diocleziano. Prima del 1800 il mare arrivava ai muri; fu ampliata sotto il maresciallo Marmont.", c2: "Ogni palma della Riva è stata ripiantata più volte — muoiono d'inverno e vengono sostituite in silenzio di notte, così i turisti non se ne accorgono.", c3: "Oggi è il cuore sociale di Spalato — la passeggiata serale verso le 19, le parate calcistiche, i concerti estivi e l'inizio di ogni processione." },
    fr: { c1: "La large promenade pavée de marbre le long du port — palmiers, terrasses de café et la façade sud blanche du Palais de Dioclétien. Avant 1800, la mer arrivait jusqu'aux murs ; elle fut élargie sous le maréchal Marmont.", c2: "Chaque palmier de la Riva a été replanté plusieurs fois — ils meurent l'hiver et sont discrètement remplacés la nuit pour ne pas alerter les touristes.", c3: "Aujourd'hui, la Riva est le cœur social de Split — passeggiata du soir vers 19 h, parades de football, concerts d'été et départ de toutes les processions." },
    es: { c1: "El amplio paseo de mármol junto al puerto — palmeras, terrazas y la pared blanca sur del Palacio de Diocleciano. Antes de 1800 el mar llegaba a los muros; se amplió bajo el mariscal Marmont.", c2: "Cada palmera de la Riva ha sido replantada varias veces — se mueren en invierno y se sustituyen discretamente de noche para que los turistas no lo noten.", c3: "Hoy es el corazón social de Split — paseo nocturno hacia las 19h, celebraciones futbolísticas, conciertos de verano y arranque de toda procesión." },
    ja: { c1: "港沿いの大理石舗装の広い遊歩道 — ヤシ並木、カフェ、宮殿の白い南壁。1800年以前は海が城壁まで来ていましたが、マルモン元帥のもとで拡張されました。", c2: "リヴァのヤシは何度も植え替えられています — 冬に枯れるので、観光客に気づかれないよう夜のうちに静かに交換されます。", c3: "今やリヴァはスプリットの社交の中心 — 19時頃の夕方の散歩、サッカーの祝賀パレード、夏のコンサート、すべての行進の出発点。" },
    zh: { c1: "沿港的大理石宽阔海滨步道——棕榈树、咖啡馆露台和戴克里先宫白色南墙。1800年前海水可至宫墙，由法国马尔蒙元帅时期填海扩建。", c2: "里瓦的每一棵棕榈树都被多次更换——冬天会枯死，被悄悄地在夜间换上新树，免得游客发现。", c3: "如今里瓦是斯普利特的社交中心——傍晚7点的散步、足球庆祝游行、夏季音乐会、每场游行的起点。" },
    ko: { c1: "항구를 따라 펼쳐진 대리석 산책로 — 야자수, 카페 테라스, 그리고 디오클레티아누스 궁전의 흰 남쪽 벽. 1800년 이전에는 바다가 성벽까지 닿았고, 마르몽 원수 시절 확장되었습니다.", c2: "리바의 야자수는 여러 번 교체되어 왔습니다 — 추운 겨울에 죽어버리기 때문에 관광객이 눈치 채지 못하게 밤에 조용히 바꿔 심습니다.", c3: "오늘날 리바는 스플리트의 사교 중심 — 저녁 7시경의 산책, 축구 우승 퍼레이드, 여름 콘서트, 모든 행렬의 시작점." },
  },
  marjan: {
    name: { en: "Marjan Hill viewpoint", hr: "Vidikovac na Marjanu", de: "Aussichtspunkt Marjan", it: "Belvedere del Marjan", fr: "Belvédère de Marjan", es: "Mirador de Marjan", ja: "マルヤンの丘の展望台", zh: "马尔扬山观景台", ko: "마르얀 언덕 전망대" },
    tone: "sun",
    en: {
      c1: "Split's green peninsula rising 178 m above the city — covered in pine forest, hiking paths and tiny medieval hermit chapels, with one of the best views over the old town and the Adriatic.",
      c2: "The pine forest you see was planted entirely by hand in the late 19th century — Marjan was bare rock and goats until a movement of citizens decided their city needed a 'lung'.",
      c3: "Today it's where Splićani come to run, swim at Bene beach, climb to Telegrin at sunset, and escape August's tourist heat without leaving the city.",
    },
    hr: { c1: "Splitski zeleni poluotok visok 178 m — borova šuma, planinarske staze, sitne srednjovjekovne pustinjačke crkve i jedan od najljepših pogleda na grad i Jadran.", c2: "Borovu šumu zasadili su građani ručno krajem 19. stoljeća — Marjan je do tada bio gola stijena s kozama.", c3: "Danas je to gradilište Splićana: trčanje, kupanje na Bene plaži, izlazak na Telegrin o zalasku sunca i bijeg od kolovoške gužve a da se ne napušta grad." },
    de: { c1: "Splits grüne Halbinsel, 178 m über der Stadt — Pinienwald, Wanderwege, kleine mittelalterliche Eremitenkapellen und einer der schönsten Blicke über die Altstadt und die Adria.", c2: "Der Pinienwald wurde Ende des 19. Jh. von Bürgern Hand in Hand gepflanzt — Marjan war bis dahin nackter Fels mit Ziegen.", c3: "Heute kommen Splićani zum Laufen, Schwimmen am Strand Bene, auf den Telegrin bei Sonnenuntergang — und um der Augusthitze zu entfliehen, ohne die Stadt zu verlassen." },
    it: { c1: "La penisola verde di Spalato, 178 m sopra la città — pineta, sentieri, piccole chiesette eremitiche medievali e una delle viste più belle sulla città vecchia e l'Adriatico.", c2: "La pineta che vedi fu piantata a mano alla fine dell'Ottocento — il Marjan era roccia nuda con le capre fino a quando i cittadini decisero che la città aveva bisogno di un 'polmone'.", c3: "Oggi è dove gli Spalatini corrono, nuotano alla spiaggia Bene, salgono sul Telegrin al tramonto e sfuggono al caldo turistico di agosto senza uscire dalla città." },
    fr: { c1: "La péninsule verte de Split, 178 m au-dessus de la ville — pinède, sentiers, petites chapelles d'ermites médiévales et l'une des plus belles vues sur la vieille ville et l'Adriatique.", c2: "La pinède a été plantée à la main à la fin du 19ᵉ siècle — le Marjan n'était que rochers nus et chèvres jusque-là.", c3: "Aujourd'hui, les Splićani viennent y courir, se baigner à la plage Bene, monter au Telegrin au coucher du soleil — et fuir la chaleur touristique d'août sans quitter la ville." },
    es: { c1: "La península verde de Split, 178 m sobre la ciudad — pinar, senderos, ermitas medievales y una de las mejores vistas del casco antiguo y del Adriático.", c2: "El pinar fue plantado a mano a finales del siglo XIX — Marjan era roca pelada con cabras hasta que los ciudadanos decidieron que la ciudad necesitaba un 'pulmón'.", c3: "Hoy los Splićani vienen a correr, a bañarse en la playa Bene, a subir al Telegrin al atardecer y a huir del calor de agosto sin salir de la ciudad." },
    ja: { c1: "市の上に178m立ち上がるスプリットの緑の半島 — 松林、ハイキング道、中世の小さな修道院、旧市街とアドリア海を一望する絶景。", c2: "今ある松林は19世紀末に市民の手で一本ずつ植えられました — それまでは岩肌とヤギだけでした。", c3: "今は市民の遊び場 — ジョギング、ベネ浜での海水浴、夕暮れのテレグリン登山、8月の観光客の熱気から街を離れずに逃れる場所。" },
    zh: { c1: "斯普利特海拔178米的绿色半岛——松林、徒步小径、中世纪隐修小教堂，以及俯瞰老城与亚得里亚海的最佳视角。", c2: "你看到的松林是19世纪末由市民亲手种下的——此前马尔扬只是裸岩与山羊。", c3: "如今是斯普利特人的后花园：跑步、在贝内海滩游泳、傍晚登顶 Telegrin，无需出城就能躲过8月的游客热浪。" },
    ko: { c1: "도시 위로 178m 솟은 스플리트의 푸른 반도 — 소나무 숲, 등산로, 중세의 작은 은수자 예배당, 그리고 구시가지와 아드리아해를 내려다보는 최고의 전망.", c2: "보이는 소나무 숲은 19세기 말 시민들이 손수 심은 것 — 그 전에는 맨바위와 염소뿐이었습니다.", c3: "오늘날 스플리트 시민들이 달리고, 베네 해변에서 수영하고, 해 질 녘 텔레그린에 오르며, 8월 관광 더위를 도시를 떠나지 않고 피하는 곳." },
  },
};

export default function Photo() {
  const [step, setStep] = React.useState("lang");   // lang | camera | scanning | result
  const [lang, setLang] = React.useState(null);
  const [pickedId, setPickedId] = React.useState(null);

  const copy = COPY[lang] || COPY.en;
  const result = pickedId ? RESULTS[pickedId] : null;

  const goCamera = (code) => { setLang(code); setStep("camera"); };
  const capture = (id) => {
    setPickedId(id);
    setStep("scanning");
    setTimeout(() => setStep("result"), 1900);
  };
  const reset = () => { setStep("camera"); setPickedId(null); };

  return (
    <div>
      {step === "lang" && <LangPicker onPick={goCamera}/>}
      {step === "camera" && <CameraView copy={copy} onCapture={capture} onBackLang={() => setStep("lang")}/>}
      {step === "scanning" && <Scanning copy={copy} pickedId={pickedId}/>}
      {step === "result" && result && (
        <ResultView lang={lang} copy={copy} result={result} onRetake={reset} onLang={() => setStep("lang")}/>
      )}
    </div>
  );
}

/* ── Step 1: language picker ────────────────────────────────────────── */

function LangPicker({ onPick }) {
  return (
    <div>
      <ScreenHeader
        kicker="AI Photo Guide"
        title={<>Hello — choose<br/>your language.</>}
        sub="Then point your camera at any landmark in Split and we'll tell you its story."
      />

      <div style={{ padding: "0 18px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {LANGS.map((L, i) => (
            <button
              key={L.code}
              onClick={() => onPick(L.code)}
              className="fade-up"
              style={{
                animationDelay: `${i * 40}ms`,
                padding: "14px 14px",
                border: "1px solid var(--line)",
                borderRadius: 18,
                background: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                display: "flex", alignItems: "center", gap: 10,
                transition: "transform .15s, background .2s",
              }}
              onTouchStart={(e)=>e.currentTarget.style.transform = "scale(0.97)"}
              onTouchEnd={(e)=>e.currentTarget.style.transform = "scale(1)"}
              onMouseEnter={(e)=>e.currentTarget.style.background = "var(--paper)"}
              onMouseLeave={(e)=>e.currentTarget.style.background = "#fff"}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "var(--paper)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {L.flag}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{L.label}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>{L.code.toUpperCase()}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "var(--ink-mute)" }}>
          You can change this anytime.
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: camera viewfinder ──────────────────────────────────────── */

const LANDMARKS = [
  { id: "peristyle", short: "peristyle", tone: "sea" },
  { id: "belltower", short: "bell tower", tone: "sun" },
  { id: "riva",      short: "riva", tone: "terra" },
  { id: "marjan",    short: "marjan", tone: "sun" },
];

const DEMO_PHOTOS = {
  peristyle: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Peristyle_of_Diocletian%27s_Palace%2C_Split_%2811908116224%29.jpg?width=900",
    credit: "Following Hadrian / Wikimedia Commons",
  },
  belltower: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Cathedral_of_Saint_Domnius_Bell_Tower_In_Split.jpg?width=900",
    credit: "RajashreeTalukdar / Wikimedia Commons",
  },
  riva: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Split_-_Riva_003.jpg?width=900",
    credit: "JoJan / Wikimedia Commons",
  },
  marjan: {
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Split-Marjan-01.jpg?width=900",
    credit: "SchiDD / Wikimedia Commons",
  },
};

function CameraView({ copy, onCapture, onBackLang }) {
  const previewLandmark = LANDMARKS[0];

  return (
    <div>
      <div style={{ padding: "0 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBackLang} style={{
          border: "1px solid var(--line)", background: "#fff",
          padding: "6px 12px 6px 8px", borderRadius: 999,
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--ink-soft)", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon.Globe style={{ width: 14, height: 14 }}/> {copy.kicker}
        </button>
        <div className="tag">Step 2 / 3</div>
      </div>

      {/* Localized instruction */}
      <div style={{ padding: "0 22px 16px" }}>
        <div className="serif" style={{
          fontSize: 22, lineHeight: 1.2, color: "var(--ink)",
          textWrap: "balance",
        }}>
          {copy.ready}
        </div>
      </div>

      {/* Viewfinder */}
      <div style={{ padding: "0 18px" }}>
        <div style={{
          position: "relative",
          aspectRatio: "3/4",
          borderRadius: 24,
          overflow: "hidden",
          background: "#0c1219",
          boxShadow: "0 18px 40px -20px rgba(0,0,0,0.5)",
        }}>
          {/* Demo camera feed */}
          <DemoPhoto
            landmarkId={previewLandmark.id}
            tone={previewLandmark.tone}
            label="Live demo camera"
            ratio="3/4"
            style={{ borderRadius: 0, height: "100%", aspectRatio: "auto", position: "absolute", inset: 0 }}
          />

          {/* corner brackets */}
          <Corners/>

          {/* faux scan line */}
          <div style={{
            position: "absolute", left: "8%", right: "8%", top: "50%",
            height: 1, background: "rgba(245,184,30,0.7)",
            boxShadow: "0 0 14px rgba(245,184,30,0.8)",
            animation: "scan 3.4s ease-in-out infinite",
          }}/>

          {/* viewfinder helper text */}
          <div style={{
            position: "absolute", top: 16, left: 16, right: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{
              padding: "5px 10px",
              borderRadius: 999,
              background: "rgba(13,28,44,0.6)",
              backdropFilter: "blur(6px)",
              color: "#fff", fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: 1,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#ff4757", animation: "blink 1.4s ease-in-out infinite" }}/>
              LIVE
            </div>
            <div style={{
              padding: "5px 10px", borderRadius: 999,
              background: "rgba(13,28,44,0.6)", backdropFilter: "blur(6px)",
              color: "#fff", fontSize: 11,
              fontFamily: "JetBrains Mono, monospace", letterSpacing: 1,
            }}>0.4×&nbsp;·&nbsp;1×&nbsp;·&nbsp;3×</div>
          </div>

          <div style={{
            position: "absolute", left: 16, right: 16, bottom: 16,
            textAlign: "center", color: "#fff",
            fontSize: 12, fontWeight: 500,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}>
            {copy.instr}
          </div>

          <style>{`
            @keyframes scan {
              0%, 100% { top: 16%; }
              50% { top: 84%; }
            }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          `}</style>
        </div>
      </div>

      {/* Demo selection */}
      <div style={{ padding: "16px 22px 8px" }}>
        <div className="tag">Demo · tap a real sample photo to simulate</div>
      </div>
      <div style={{ padding: "0 18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {LANDMARKS.map((L, i) => (
          <button key={L.id} onClick={() => onCapture(L.id)} className="fade-up"
            style={{
              animationDelay: `${i * 50}ms`,
              padding: 0, borderRadius: 14, overflow: "hidden",
              border: "1px solid var(--line)", background: "#fff",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>
            <DemoPhoto landmarkId={L.id} tone={L.tone} ratio="16/10" label={L.short} style={{ borderRadius: 0 }}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function Corners() {
  const c = { position: "absolute", width: 36, height: 36, border: "3px solid rgba(245,184,30,0.95)" };
  return (
    <>
      <div style={{ ...c, top: 60, left: 24, borderRight: 0, borderBottom: 0, borderTopLeftRadius: 8 }}/>
      <div style={{ ...c, top: 60, right: 24, borderLeft: 0, borderBottom: 0, borderTopRightRadius: 8 }}/>
      <div style={{ ...c, bottom: 60, left: 24, borderRight: 0, borderTop: 0, borderBottomLeftRadius: 8 }}/>
      <div style={{ ...c, bottom: 60, right: 24, borderLeft: 0, borderTop: 0, borderBottomRightRadius: 8 }}/>
    </>
  );
}

/* ── Step 3: scanning ───────────────────────────────────────────────── */

function Scanning({ copy, pickedId }) {
  const tone = (RESULTS[pickedId] && RESULTS[pickedId].tone) || "sea";
  return (
    <div style={{ padding: "0 18px 24px" }}>
      <div style={{ padding: "0 4px 12px" }}>
        <div className="tag">Step 3 / 3</div>
        <div className="serif" style={{ fontSize: 26, marginTop: 6 }}>{copy.ident}</div>
      </div>
      <div style={{
        position: "relative",
        aspectRatio: "3/4",
        borderRadius: 24, overflow: "hidden",
        background: "#0c1219",
      }}>
        <DemoPhoto landmarkId={pickedId} tone={tone} ratio="3/4" style={{ borderRadius: 0, height: "100%", aspectRatio: "auto", position: "absolute", inset: 0 }}/>
        <div style={{ position: "absolute", inset: 0, background: "rgba(13,28,44,0.55)" }}/>

        {/* scanning grid */}
        <div style={{
          position: "absolute", inset: 16,
          border: "1px solid rgba(245,184,30,0.6)",
          borderRadius: 12,
          backgroundImage: "linear-gradient(rgba(245,184,30,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(245,184,30,0.12) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "pulse 1.4s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute", left: "8%", right: "8%",
          height: 2, background: "var(--sun)",
          boxShadow: "0 0 20px var(--sun)",
          animation: "scan2 1.4s ease-in-out infinite",
        }}/>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "#fff", textAlign: "center", padding: 20,
        }}>
          <div style={{
            width: 56, height: 56,
            border: "3px solid rgba(255,255,255,0.2)",
            borderTopColor: "var(--sun)",
            borderRadius: 999,
            animation: "spin 0.9s linear infinite",
          }}/>
          <div style={{ marginTop: 18, fontSize: 18, fontWeight: 600 }}>{copy.ident}</div>
          <div className="mono" style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
            STONE · COLUMNS · SHADOWS · ROOFLINE
          </div>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.5 } 50% { opacity: 1 } }
          @keyframes scan2 { 0% { top: 12% } 100% { top: 88% } }
        `}</style>
      </div>
    </div>
  );
}

/* ── Step 4: result — 3 cards ───────────────────────────────────────── */

function ResultView({ lang, copy, result, onRetake, onLang }) {
  const landmarkId = Object.entries(RESULTS).find(([, value]) => value === result)?.[0];
  const name = result.name[lang] || result.name.en;
  const text = result[lang] || result.en;
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [audioMessage, setAudioMessage] = React.useState("");
  const cards = [
    { icon: "📜", label: copy.labels.c1, body: text.c1, tone: "sea" },
    { icon: "✦",  label: copy.labels.c2, body: text.c2, tone: "sun" },
    { icon: "✺",  label: copy.labels.c3, body: text.c3, tone: "terra" },
  ];
  const audioText = buildAudioText(name, cards);
  const speechLang = LANGS.find(L => L.code === lang)?.speech || "en-US";

  React.useEffect(() => () => stopGuideAudio(), []);

  function playAudio() {
    const didStart = speakGuideText(audioText, speechLang, () => setIsSpeaking(false));

    if (!didStart) {
      setAudioMessage("Audio is not supported in this browser.");
      return;
    }

    setAudioMessage("");
    setIsSpeaking(true);
  }

  function stopAudio() {
    stopGuideAudio();
    setIsSpeaking(false);
  }

  return (
    <div>
      {/* Hero with photo */}
      <div style={{ padding: "0 18px" }}>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}>
          <DemoPhoto landmarkId={landmarkId} tone={result.tone} ratio="4/3" style={{ borderRadius: 0 }}/>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(13,28,44,0.1) 0%, rgba(13,28,44,0.85) 100%)",
          }}/>
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(245,184,30,0.95)",
            color: "var(--sea-deep)",
            padding: "5px 12px 5px 8px",
            borderRadius: 999,
            fontSize: 11, fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Check style={{ width: 12, height: 12 }}/> Identified · 96%
          </div>
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(13,28,44,0.6)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            padding: "5px 10px", borderRadius: 999,
            fontSize: 11, fontFamily: "JetBrains Mono, monospace",
            letterSpacing: 1,
          }}>
            {lang.toUpperCase()}
          </div>
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, color: "#fff" }}>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1.05, letterSpacing: 0, textWrap: "balance" }}>
              {name}
            </div>
            {landmarkId && DEMO_PHOTOS[landmarkId] && (
              <div style={{ marginTop: 6, fontSize: 10, opacity: 0.72 }}>
                Demo photo: {DEMO_PHOTOS[landmarkId].credit}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 cards */}
      <div style={{ padding: "20px 18px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="fade-up" style={{
          background: "var(--sea-deep)",
          color: "#fff",
          borderRadius: 20,
          padding: "14px",
          display: "grid",
          gap: 10,
          boxShadow: "0 12px 30px -18px rgba(13,28,44,0.45)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div>
              <div className="tag" style={{ color: "rgba(255,255,255,0.68)" }}>Audio guide</div>
              <div style={{ fontWeight: 750, marginTop: 2 }}>Listen instead of reading</div>
            </div>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.12)",
            }}>
              {isSpeaking ? "▮▮" : "▶"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={playAudio} style={{
              flex: 1,
              border: 0,
              borderRadius: 14,
              padding: "12px",
              background: "var(--sun)",
              color: "var(--sea-deep)",
              fontFamily: "inherit",
              fontWeight: 800,
              cursor: "pointer",
            }}>
              {isSpeaking ? "Restart audio" : "Play audio"}
            </button>
            <button onClick={stopAudio} disabled={!isSpeaking} style={{
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 14,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontFamily: "inherit",
              fontWeight: 700,
              cursor: isSpeaking ? "pointer" : "not-allowed",
              opacity: isSpeaking ? 1 : 0.55,
            }}>
              Stop
            </button>
          </div>

          {audioMessage && (
            <div style={{ fontSize: 12, color: "var(--sun-soft)" }}>{audioMessage}</div>
          )}
        </div>

        {cards.map((c, i) => (
          <InfoCard key={i} c={c} delay={i * 90} num={i + 1}/>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "22px 18px 32px", display: "flex", gap: 10 }}>
        <button onClick={onLang} style={{
          flex: 0.4,
          padding: "14px",
          border: "1px solid var(--line)",
          background: "#fff",
          borderRadius: 16,
          fontWeight: 600, fontSize: 14,
          color: "var(--ink)",
          cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icon.Globe style={{ width: 16, height: 16 }}/>
        </button>
        <button onClick={onRetake} style={{
          flex: 1,
          padding: "14px",
          border: 0,
          background: "var(--sea-deep)",
          color: "#fff",
          borderRadius: 16,
          fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <Icon.Camera style={{ width: 16, height: 16 }}/> {copy.retake}
        </button>
      </div>
    </div>
  );
}

function DemoPhoto({ landmarkId, tone, label, ratio = "4/3", style }) {
  const [failed, setFailed] = React.useState(false);
  const photo = DEMO_PHOTOS[landmarkId];

  if (!photo || failed) {
    return <Placeholder tone={tone} ratio={ratio} label={label} style={style}/>;
  }

  return (
    <div style={{
      aspectRatio: ratio,
      borderRadius: 14,
      position: "relative",
      overflow: "hidden",
      background: "#0c1219",
      ...style,
    }}>
      <img
        src={photo.url}
        alt={label || landmarkId}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(13,28,44,0.05) 25%, rgba(13,28,44,0.62) 100%)",
        pointerEvents: "none",
      }}/>
      {label && (
        <div style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          alignItems: "flex-end",
        }}>
          <span style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}>
            {label}
          </span>
          <span style={{
            fontSize: 9,
            opacity: 0.75,
            textAlign: "right",
            textShadow: "0 1px 4px rgba(0,0,0,0.45)",
          }}>
            real demo
          </span>
        </div>
      )}
    </div>
  );
}

function buildAudioText(name, cards) {
  return [
    name,
    ...cards.map(card => `${card.label}. ${card.body}`),
  ].join(". ");
}

function speakGuideText(text, lang, onEnd) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;

  window.speechSynthesis.speak(utterance);
  return true;
}

function stopGuideAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function InfoCard({ c, delay, num }) {
  const palette = {
    sea:   { bg: "#fff",            stripe: "var(--sea)",        chip: "var(--sea-pale)",  text: "var(--sea-deep)" },
    sun:   { bg: "var(--sun-soft)", stripe: "var(--sun)",        chip: "#fff",             text: "#7d5400" },
    terra: { bg: "#fff",            stripe: "var(--terracotta)", chip: "#fbe1d3",          text: "#7c3a18" },
  }[c.tone];

  return (
    <div className="fade-up" style={{
      animationDelay: `${delay}ms`,
      background: palette.bg,
      border: "1px solid var(--line)",
      borderRadius: 20,
      padding: "16px 18px 18px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 22px -16px rgba(13,28,44,0.25)",
    }}>
      {/* stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 4, background: palette.stripe,
      }}/>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: palette.chip, color: palette.text,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Instrument Serif, serif", fontSize: 16, lineHeight: 1, fontWeight: 700,
        }}>
          {num}
        </div>
        <div className="tag" style={{ color: palette.text }}>{c.label}</div>
      </div>
      <div className="serif" style={{
        fontSize: 19, lineHeight: 1.32,
        color: "var(--ink)",
        marginTop: 10,
        letterSpacing: 0,
        textWrap: "pretty",
      }}>
        {c.body}
      </div>
    </div>
  );
}
