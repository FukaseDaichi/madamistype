# マダミスタイプ診断 診断ロジック仕様書

## 1. 文書の目的

本書は [specification.md](./specification.md) の診断ロジック部分を、現行実装に合わせて具体化した文書である。

対象:

- 質問マスタの前提
- 回答値の数値化
- 4 軸スコア計算
- 同点処理
- 16 タイプへの変換
- 4 軸サマリと共有キー

## 2. 前提

### 2.1 設問数とページ構成

- 全 32 問
- 1 ページ 8 問
- 全 4 ページ
- 各軸 8 問ずつ

### 2.2 軸順

軸順は固定で、`data/question-master.json` の `meta.axisOrder` と `lib/axis.ts` に合わせる。

1. A1: 発言型 / 観察型
2. A2: 事実重視 / 推理重視
3. A3: 論理派 / 感情派
4. A4: 計画型 / 即興型

### 2.3 コード対応

| 軸 | 正方向 | 負方向 |
| --- | --- | --- |
| A1 | `T` = 発言型 | `O` = 観察型 |
| A2 | `F` = 事実重視 | `R` = 推理重視 |
| A3 | `L` = 論理派 | `E` = 感情派 |
| A4 | `P` = 計画型 | `I` = 即興型 |

## 3. 質問マスタ

### 3.1 必須項目

各質問は次を持つ。

- `questionId`
- `questionText`
- `axis`
- `direction`
- `displayOrder`
- `pageNo`
- `weight`
- `isActive`
- `tieBreakerPriority`

### 3.2 運用ルール

- 現行実装では全問 `weight = 1.0`
- 集計対象は `isActive = true` の設問のみ
- ページ表示は `pageNo` に従う

## 4. 回答値

### 4.1 回答と数値

| 回答 | 値 |
| --- | --- |
| とてもそう思う | 5 |
| ややそう思う | 4 |
| どちらでもない | 3 |
| あまりそう思わない | 2 |
| まったくそう思わない | 1 |

### 4.2 内部変換

スコア計算では、回答値を `-2` から `+2` の差分値へ変換する。

- `forward`: `answerValue - 3`
- `reverse`: `3 - answerValue`

| 回答 | `forward` | `reverse` |
| --- | --- | --- |
| 5 | +2 | -2 |
| 4 | +1 | -1 |
| 3 | 0 | 0 |
| 2 | -1 | +1 |
| 1 | -2 | +2 |

## 5. 4 軸スコア計算

軸スコアは次で求める。

```text
axisScore = Σ(delta × weight)
```

現行では `weight = 1.0` 固定のため、実質は `delta` の単純合計である。

各軸 8 問のため、理論上の軸スコア範囲は `-16` から `+16`。

## 6. 軸の確定ロジック

### 6.1 通常判定

- `score > 0`: 正方向
- `score < 0`: 負方向
- `score = 0`: 同点処理へ進む

### 6.2 同点処理

同点時は `tieBreakerPriority` 降順で設問を見て、最初に `delta != 0` となる設問の向きで決める。

処理順:

1. 同軸の設問を `tieBreakerPriority` 降順で並べる
2. 回答済み設問だけを見る
3. `delta > 0` なら正方向
4. `delta < 0` なら負方向
5. 全設問が `0` の場合は軸既定値を使う

軸既定値:

- A1: `O`
- A2: `F`
- A3: `L`
- A4: `P`

## 7. タイプコード決定

4 軸の resolved code を順に連結して 4 文字の `typeCode` を作る。

例:

- A1 = `T`
- A2 = `F`
- A3 = `L`
- A4 = `P`

この場合、結果は `TFLP`。

## 8. 4 軸サマリ

結果ページでは各軸について以下を持つ。

- `axis`
- `positiveLabel`
- `negativeLabel`
- `positiveCode`
- `negativeCode`
- `score`
- `positivePercent`
- `negativePercent`
- `resolvedCode`
- `resolvedLabel`

表示用パーセントは次で計算する。

```text
positivePercent = round(((score + 16) / 32) * 100)
negativePercent = 100 - positivePercent
```

最終値は `0` から `100` に clamp する。

## 9. 共有キー

### 9.1 現行仕様

現行の `createShareKey()` は `v3` のみを生成し、shared page も `v3` だけを受け付ける。

```json
{
  "v": 3,
  "n": "ユーザー名",
  "t": [27, 14, 33, 8]
}
```

`t` は 4 軸のトレンド状態を表す compact state 配列で、回答全文ではない。
0 点の軸でも、最終的に正側に倒れたか負側に倒れたかは状態として保持する。

### 9.2 エンコード方式

- 共有キーは Base64URL で表現する
- 名前バイト列 + 4 軸トレンド状態を 3 byte に pack した compact 形式を使う

### 9.3 共有ページでの復元

- `v3`: 格納済みトレンド状態から 4 軸サマリを展開する

## 10. 実装ファイル

診断ロジックの主要実装:

- `lib/diagnosis.ts`
- `lib/axis.ts`
- `lib/share-key.ts`
- `data/question-master.json`
- `app/(types)/types/[typeCode]/[key]/page.tsx`

## 11. 検証観点

- 質問数が 32 問であること
- 各軸 8 問ずつであること
- `pageNo` が 1〜4 に収まること
- 同じ回答セットで同じ `typeCode` になること
- 同点時処理が決定的に動くこと
- `positivePercent` / `negativePercent` が 0〜100 に収まること
- `v3` 共有キーから shared page の軸サマリが復元できること

## 12. 現行実装上の注意

- `v3` は回答全文を持たないため、共有結果ページは「4 軸の傾向復元」が中心になる
- 診断途中状態は `localStorage` のみで保持し、サーバー保存はしない
