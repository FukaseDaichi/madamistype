import type { TypeCode } from "@/lib/types";

export type SurveyTrendDistributionItem = {
  typeCode: TypeCode;
  count: number;
  note: string;
};

export type SurveyTrendFeaturedType = {
  typeCode: TypeCode;
  lead: string;
  insight: string;
  recommendations: string[];
};

export type SurveyTrendCompactType = {
  typeCode: TypeCode;
  summary: string;
  recommendations: string[];
};

export const SURVEY_TRENDS_CONTENT = {
  responseCount: 206,
  hero: {
    eyebrow: "Survey Report",
    title: "アンケートから見えた\nマダミス傾向ファイル",
    lead: "206件の回答から、どのタイプの人が多かったのか、どんな作品がよく薦められていたのかを静的な記事としてまとめたページです。診断のあとに読み返しても、まだ診断していない人が雰囲気をつかむ入口として読んでもらっても大丈夫な構成にしています。",
    caution:
      "ここで見えるのは、アンケートに協力してくださった方々の分布です。プレイヤー全体の絶対的な比率ではなく、協力的な回答者層の傾向となります。",
  },
  dominantTypes: [
    {
      typeCode: "TFEI",
      count: 40,
      note: "議論を動かしたり、場の空気に火をつけたりするタイプが最も多く集まりました。",
    },
    {
      typeCode: "TREI",
      count: 28,
      note: "感情やキャラクターの波にしっかり乗って物語を味わうタイプが大きく続きました。",
    },
    {
      typeCode: "OFEI",
      count: 26,
      note: "情報を拾い、観察し、集めた材料で卓を前に進めるタイプもかなり厚い層でした。",
    },
  ] satisfies SurveyTrendDistributionItem[],
  supportingTypeCodes: ["OREI", "TFLI", "OFLI"] as TypeCode[],
  overallSignals: [
    "人を動かしたり、場を揺らしたりするのが好き",
    "情報を拾って回るのが好き",
    "物語や感情をしっかり味わいたい",
  ],
  overallWorks: [
    "この闇をあなたと",
    "ふわふわクリームさらにジューシー",
    "シュレディンガーの密室",
    "鬼哭館の殺人事件",
    "エイダ",
  ],
  overallWorksNote:
    "このほかにも「透きとおる青の証明」「ウルイの血族」「エンドロールは流れない」などが複数タイプから挙がっており、特定タイプだけに閉じない広い支持も見えました。",
  featuredTypes: [
    {
      typeCode: "TFEI",
      lead: "今回いちばん人数が多かったタイプで、卓を動かす力と対話の熱量がよく出ていました。",
      insight:
        "駆け引きや感情のぶつかり合いを楽しめそうな作品が並びやすく、討論の熱や存在感が活きるラインナップが目立ちます。",
      recommendations: [
        "シュレディンガーの密室",
        "夜の蛙は眠らない",
        "エイダ",
        "この闇をあなたと",
        "殺意の特異点",
      ],
    },
    {
      typeCode: "TREI",
      lead: "キャラクターや感情、物語の流れにしっかり乗っていくプレイヤー像がはっきり表れていました。",
      insight:
        "自由記述でも共感や感情ポイントを大事にする声が多く、ストーリー性や情感の濃い作品が推薦されやすい傾向でした。",
      recommendations: [
        "ふわふわクリームさらにジューシー",
        "餌の愚-クレードル-",
        "アンノウン",
        "この闇をあなたと",
        "あたたかな幽霊",
      ],
    },
    {
      typeCode: "OFEI",
      lead: "情報を集める、様子を見る、周囲を観察する動きと相性のよさそうな推薦が集まりました。",
      insight:
        "調査感や探索感、情報収集そのものの楽しさがある作品が多く、拾った情報を活かすタイプ像が浮かびます。",
      recommendations: [
        "この闇をあなたと",
        "エイダ",
        "エンドロールは流れない",
        "ウルイの血族",
        "鬼哭館の殺人事件",
      ],
    },
    {
      typeCode: "OREI",
      lead: "おすすめ作品が一作に集中するより、余韻や解釈の広がりを持つ作品へ散っていくのが印象的でした。",
      insight:
        "定番寄りの作品も含め、世界観や余白を読む楽しさがあるタイトルに票が集まりやすいタイプです。",
      recommendations: [
        "透きとおる青の証明",
        "英国探偵とウォルターの遺産",
        "鬼哭館の殺人事件",
        "ふわふわクリームさらにジューシー",
        "餌の愚-クレードル-",
      ],
    },
    {
      typeCode: "TFLI",
      lead: "問い詰める、矛盾を見抜く、発言を精査する空気が推薦作品にもまっすぐ反映されていました。",
      insight:
        "真相に迫る圧や、詰める楽しさのある作品が多く、切り込むタイプらしい選ばれ方です。",
      recommendations: [
        "憑母病棟監獄実験",
        "蟻集",
        "透きとおる青の証明",
        "赤の導線",
        "霧に眠るは幾つの罪",
      ],
    },
    {
      typeCode: "OFLI",
      lead: "票はかなり分散しつつも、静かな調査と推理の相性がよい作品が自然と並びました。",
      insight:
        "目立つ一手よりも、情報を積み上げて核心に近づく遊び方が似合う作品群として読めます。",
      recommendations: [
        "5DIVE",
        "BOOROOM",
        "立方館",
        "Lost/Remembrance",
        "少年少女Aの独白",
      ],
    },
    {
      typeCode: "ORLI",
      lead: "人数は多くないものの、秘密を抱えて静かに立ち回るタイプ像はかなりはっきり出ていました。",
      insight:
        "周囲との距離感を使いながら物語に関わる作品や、抱えた秘密が効く作品が強く薦められています。",
      recommendations: [
        "あの夏の囚人",
        "何度だって青い月に火を灯した",
        "この闇をあなたと",
        "英国探偵とウォルターの遺産",
      ],
    },
    {
      typeCode: "TRLI",
      lead: "トリッキーで印象的な動きや、ひらめきで卓の見え方を変えるタイプとして読まれていました。",
      insight:
        "独特の雰囲気や構造の妙を楽しめる作品が並び、ちょっとした異物感まで魅力に変える推薦になっています。",
      recommendations: [
        "この闇をあなたと",
        "年輪",
        "英国探偵とウォルターの遺産",
        "月の御殿",
        "ランドルフ・ローレンスの追憶",
      ],
    },
  ] satisfies SurveyTrendFeaturedType[],
  compactTypes: [
    {
      typeCode: "TFEP",
      summary:
        "本音が出る空気を整えるタイプらしく、卓の熱や空気づくりが似合う作品が並びました。",
      recommendations: [
        "天使のエルと時計仕掛けの国",
        "限界の向こう側",
        "シュレディンガーの密室",
        "狂気山脈シリーズ",
      ],
    },
    {
      typeCode: "OREP",
      summary:
        "感情を物語へつなぎ直すようなタイプとして、余韻や人物感情の強い作品が挙がっています。",
      recommendations: [
        "鬼哭館の殺人事件",
        "Lost/Remembrance",
        "夢ノ棺ノ時間ドロボウ",
        "天使のエルと時計仕掛けの国",
        "エイダ",
      ],
    },
    {
      typeCode: "ORLP",
      summary:
        "見えない前提を組み立てていくタイプとして、構造や真相の地図を描く楽しさがある作品が目立ちます。",
      recommendations: [
        "七色の結婚式",
        "英国探偵とウォルターの遺産",
        "この闇をあなたと",
        "ヴァンピ！",
      ],
    },
    {
      typeCode: "TFLP",
      summary:
        "盤面整理と推理の強さがそのまま出るような、謎解きの手触りが前に出る作品が並びました。",
      recommendations: [
        "魔笛伝説殺人事件",
        "シュレディンガーの密室",
        "幻想推理",
        "赤の導線",
      ],
    },
    {
      typeCode: "TREP",
      summary:
        "動機や背景に着目するタイプとして、人物の事情や心の動きが強い作品に票が集まりました。",
      recommendations: [
        "鬼哭館の殺人事件",
        "絆の永逝",
        "オオカミ少年の晩歌",
        "そらとくじらのエンゲ",
      ],
    },
    {
      typeCode: "OFEP",
      summary:
        "誰も口にしない気配を見届けるタイプらしく、反応や雰囲気を読む楽しさがありそうな作品が挙がっています。",
      recommendations: ["赤の導線", "天使は花明かりの下で", "女皇の書架"],
    },
    {
      typeCode: "TRLP",
      summary:
        "仮説で盤面を変えるタイプとして、構造の妙や逆転の手筋が印象的な作品に集まりました。",
      recommendations: ["ARCANA/REVERSED", "殺意の特異点", "円蓋の向日葵"],
    },
    {
      typeCode: "OFLP",
      summary:
        "静かに材料を見極めるタイプとして、少数回答でも相性の見えやすい作品名が挙がっています。",
      recommendations: ["ふわふわクリームさらにジューシー"],
    },
  ] satisfies SurveyTrendCompactType[],
  feedback: {
    concerns: [
      "「推理重視」は「推論重視」のほうが伝わりやすいかもしれない",
      "何を想定した質問なのか掴みにくい設問がある",
      "引いた役やキャラクターによって回答がぶれやすい",
      "憑依型 RP の人には答えにくい質問もありそう",
    ],
    positives: [
      "面白い診断だった",
      "自分のタイプが分かって楽しかった",
      "結果に納得感があった",
      "話題作りにちょうどよかった",
    ],
    futureIdeas: [
      "作品との相性より、どんな役が好きかとの相性のほうが大きいかもしれない",
      "キャラクターへの共感を軸に遊んでいる人も多い",
    ],
  },
  closingSummary: [
    "多かったのは 扇動役者・大女優・潜入記者。",
    "全体でよく名前が挙がったのは「この闇をあなたと」「ふわふわクリームさらにジューシー」「シュレディンガーの密室」「鬼哭館の殺人事件」「エイダ」。",
    "診断そのものは好評で、次に伸ばす余地としては設問の分かりやすさが大きなテーマでした。",
  ],
} as const;
