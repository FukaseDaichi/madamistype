# マダミスタイプ診断 タイプ定義仕様書

## 1. 文書の目的

本書は `data/types/*.json` に格納された 16 タイプ定義を、現行実装ベースで整理した文書である。  
タイプ名、タイプコード、表示項目、画像生成向け補助項目の扱いを定義する。

関連文書:

- [specification.md](./specification.md)
- [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- [character-image-skill-spec.md](./character-image-skill-spec.md)
- [type-ogp-image-spec.md](./type-ogp-image-spec.md)

## 2. タイプコード規則

タイプコードは 4 文字固定で、各文字は診断軸に対応する。

1. 1文字目: 発言型 `T` / 観察型 `O`
2. 2文字目: 事実重視 `F` / 推理重視 `R`
3. 3文字目: 論理派 `L` / 感情派 `E`
4. 4文字目: 計画型 `P` / 即興型 `I`

例:

- `TFLP` = 発言型 / 事実重視 / 論理派 / 計画型
- `OREI` = 観察型 / 推理重視 / 感情派 / 即興型

## 3. 現在の 16 タイプ

| コード | 名称 | タグライン |
| --- | --- | --- |
| `OFEI` | 潜入記者 | するっと懐に入って、必要な本音だけ持って帰る。 |
| `OFEP` | 観測メイド | 誰も口にしない気配まで、そっと見届けている。 |
| `OFLI` | 潜伏刑事 | 誰も拾わなかった違和感を、ずっと追い続けている。 |
| `OFLP` | 沈黙の鑑識官 | 静かに見ていて、判断は誰より正確。 |
| `OREI` | 余白の魔術師 | 沈黙の余白にある本音を、誰より先に拾い上げる。 |
| `OREP` | 感情の翻訳者 | 言葉にならない気持ちを、物語の輪郭に変える。 |
| `ORLI` | 潜伏スパイ | 目立たず潜って、核心だけを持ち帰る。 |
| `ORLP` | 安楽椅子探偵 | 見えない前提まで、真相の設計図に変える。 |
| `TFEI` | 扇動役者 | ひと言で、沈んだ空気に火を灯す。 |
| `TFEP` | 証言調律師 | 本音が出る空気を、気づけば作っている。 |
| `TFLI` | 尋問官 | 矛盾を見た瞬間、もう切り込んでいる。 |
| `TFLP` | 名探偵 | 散らかった盤面ほど、この人の出番だ。 |
| `TREI` | 大女優 | 感情が揺れた瞬間、物語の幕が上がる。 |
| `TREP` | 動機脚本家 | なぜそうしたのか――そこに、真相の入口がある。 |
| `TRLI` | 奇術師 | 常識の外から、逆転の筋を持ち込む。 |
| `TRLP` | 黒幕参謀 | 仮説ひとつで、盤面の見え方を変える。 |

## 4. `data/types/*.json` の項目

各タイプ JSON は少なくとも次を持つ。

| 項目 | 用途 |
| --- | --- |
| `typeId` | タイプ識別子。現行データでは `typeCode` と同値 |
| `typeCode` | 4 文字のタイプコード |
| `typeName` | 表示名 |
| `tagline` | ヒーローで使う短いコピー |
| `summary` | 一段落の概要説明 |
| `detailDescription` | 詳細説明本文 |
| `strengths` | 強みの箇条書き |
| `cautions` | 注意点の箇条書き |
| `recommendedPlaystyle` | 向いている立ち回り |
| `suitableRoles` | 向いている役回り |
| `compatibility` | 相性情報 |
| `shareText` | SNS 共有文面のベース |
| `axis` | 4 軸ラベルのネストオブジェクト |
| `visualProfile` | 画像生成向けの見た目補助情報 |
| `imagePrompt` | 画像生成向けの元プロンプト |
| `negativePrompt` | 画像生成向けの禁止条件 |

## 5. `axis` オブジェクト

`axis` は各タイプの 4 軸ラベルを保持する。

```json
{
  "axis": {
    "axis1": "発言型",
    "axis2": "事実重視",
    "axis3": "論理派",
    "axis4": "計画型"
  }
}
```

使いどころ:

- shared page の 4 軸サマリ表示
- タイプ固有の軸ラベル表示
- 画像生成スキルでの補助情報

## 6. `compatibility` オブジェクト

`compatibility` は次の形を取る。

```json
{
  "summary": "相性の総評",
  "goodWithTypeCodes": ["OREI", "TREI"],
  "goodWithDescription": "補足説明"
}
```

補足:

- `summary` は本文セクションで表示する
- `goodWithTypeCodes` は公開ページで相性のよいタイプ一覧を引くために使う
- `goodWithDescription` は補足説明として表示する

## 7. `visualProfile` と画像生成補助項目

`visualProfile` はアプリ本体の表示ロジックと画像生成スキルの両方で使われる。

主な項目:

- `genderPresentation`
- `ageRange`
- `characterArchetype`
- `characterDescription`
- `outfitDescription`
- `colorPalette`
- `pose`
- `expression`
- `background` 任意

現在の利用先:

- `TypeArtwork` のプレースホルダー配色
- キャラクター画像生成スキル
- タイプ別 OGP 画像生成スキル

`imagePrompt` / `negativePrompt` はアプリ本体の描画では直接使わず、スキル側の入力として扱う。

## 8. 画面との対応

公開タイプ詳細ページ `/types/[typeCode]` では主に次を使う。

- `typeName`
- `typeCode`
- `tagline`
- `summary`
- `detailDescription`
- `strengths`
- `cautions`
- `recommendedPlaystyle`
- `suitableRoles`
- `compatibility`

共有結果ページ `/types/[typeCode]/[key]` では上記に加えて、共有キーから復元した 4 軸サマリを表示する。

## 9. アセットとの対応

タイプコードごとに、アプリ本体が参照する配信用アセットは次の通り。

- `public/types/{typeCode}.png`
- `public/types/{typeCode}_chibi.png`
- `public/types/{typeCode}-ogp.png`

画像ファイルが存在しない場合、`TypeArtwork` は `visualProfile.colorPalette` を使ってプレースホルダーを描画する。
