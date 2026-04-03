# マダミスタイプ診断 診断ロジック仕様書

## 1. 文書の目的

本書は [specification.md](./specification.md) の診断ロジック部分を、現行実装に合わせて具体化した文書である。

対象:

- 質問マスタの前提
- 回答値の数値化
- 4 軸スコア計算
- 同点処理
- 16 タイプへの変換
- 4 軸サマリ
- 共有キー `v3`

## 2. 前提

### 2.1 設問数とページ構成

- 全 32 問
- 1 ページ 8 問
- 全 4 ページ
- 各軸 8 問ずつ

### 2.2 軸順

軸順は `data/question-master.json` の `meta.axisOrder` と `lib/axis.ts` に合わせる。

1. A1: 発言型 / 観察型
2. A2: 事実重視 / 推理重視
3. A3: 論理派 / 感情派
4. A4: 計画型 / 即興型

### 2.3 コード対応

| 軸 | 正方向 | 負方向 | 既定値 |
| --- | --- | --- | --- |
| A1 | `T` = 発言型 | `O` = 観察型 | `O` |
| A2 | `F` = 事実重視 | `R` = 推理重視 | `F` |
| A3 | `L` = 論理派 | `E` = 感情派 | `L` |
| A4 | `P` = 計画型 | `I` = 即興型 | `P` |

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

- 集計対象は `isActive = true` の設問のみ
- 現行マスタでは全問 `weight = 1.0`
- ページ表示は `pageNo` に従う
- `tieBreakerPriority` 未設定時は `0` として扱う

## 4. 回答値

### 4.1 表示上の回答

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
各軸 8 問なので、理論上の軸スコア範囲は `-16` から `+16`。

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

## 9. ユーザー名の扱い

- 診断開始時と共有キー生成時に trim する
- 最大 10 文字に切り詰める
- 共有キーでは UTF-8 バイト列として保持し、40 byte を上限にする

## 10. 共有キー `v3`

### 10.1 論理構造

`createShareKey()` は `v3` のみを生成し、shared page も `v3` だけを受け付ける。

```json
{
  "v": 3,
  "n": "ユーザー名",
  "t": [27, 14, 33, 8]
}
```

- `n`: 正規化済みユーザー名
- `t`: 4 軸のトレンド状態を表す compact state 配列

`t` は回答全文ではなく、共有ページ再現に必要な軸状態だけを保持する。  
0 点の軸でも、最終的に正側に倒れたか負側に倒れたかは状態として保持する。

### 10.2 エンコード方式

- 共有キーは Base64URL で表現する
- 内部表現は `1 byte の名前長 + 名前 UTF-8 bytes + 3 byte の packed trend states`
- trend state は 4 軸ぶんの 6 bit 値を 24 bit に pack する

### 10.3 trend state の扱い

- 通常のスコアは `score + 16` に変換する
- `score = 0` のときだけ専用 state を使う
- `0` かつ正側確定は `33`
- `0` かつ負側確定は `16`

### 10.4 共有ページでの復元

- shared page は `decodeShareKey()` で payload を復元する
- `expandShareKeyAxisSummaries()` で 4 軸サマリに展開する
- 復元した `resolvedCode` の連結結果が URL の `typeCode` と一致しない場合は `notFound()` にする

## 11. 実装ファイル

診断ロジックの主要実装:

- `lib/diagnosis.ts`
- `lib/axis.ts`
- `lib/share-key.ts`
- `lib/draft-storage.ts`
- `data/question-master.json`
- `app/(types)/types/[typeCode]/[key]/page.tsx`

## 12. 検証観点

- 質問数が 32 問であること
- 各軸 8 問ずつであること
- `pageNo` が 1〜4 に収まること
- 同じ回答セットで同じ `typeCode` になること
- 同点時処理が決定的に動くこと
- `positivePercent` / `negativePercent` が 0〜100 に収まること
- `v3` 共有キーから shared page の軸サマリが復元できること
