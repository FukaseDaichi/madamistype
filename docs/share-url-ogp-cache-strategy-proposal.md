# 共有URL / OGPキャッシュ戦略 提案

## 1. この文書の目的

本書は、`/types/[typeCode]/[key]` を使う共有URLと、OGP画像配信の運用コストを整理し、`Vercel` 無料枠を圧迫しにくい共有戦略を提案するための文書である。

本書は提案書であり、現行の主仕様書をただちに上書きしない。採用する場合は、[specification.md](./specification.md) と [tech-stack-spec.md](./tech-stack-spec.md) を更新する。

参照文書:

- [specification.md](./specification.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- [type-ogp-image-spec.md](./type-ogp-image-spec.md)

## 2. 現状確認

### 2.1 現在のルーティング

- 公開ページ: `/types/[typeCode]`
- 共有ページ: `/types/[typeCode]/[key]`

### 2.2 `KEY` の意味

現状の `KEY` は、少なくとも以下を含む共有用文字列として生成されている。

- ユーザー名
- 4軸の傾向サマリ

つまり、同じ `typeCode` でもユーザーごとにURLが増える構造になっている。

### 2.3 2026年3月30日時点のビルド結果

`next build` の出力では、次のように判定された。

- `/types/[typeCode]`: `SSG`
- `/types/[typeCode]/[key]`: `Dynamic`
- `/types/[typeCode]/opengraph-image`: `Dynamic`

このため、現状は「共有ページURLの数」がそのままボットアクセス対象の数になりやすい。

### 2.4 重要な観察

- `key` は `og:image` のURL自体には含まれていない
- ただし、SNSクローラはまず共有先ページURLを取得する
- 共有先ページURLが無限に増えると、HTML取得コストとキャッシュ分散は避けにくい
- 画像URLがタイプ単位で共通でも、共有ページURLが増え続ける限り運用は安定しにくい

## 3. 問題整理

### 3.1 無限に増える共有URL

`/types/[typeCode]/[key]` をSNS共有の正規URLにすると、同じタイプでもユーザーごとに別URLになる。結果として、クローラ視点ではほぼ毎回新規URLになる。

### 3.2 キャッシュ効率が読みにくい

共有URLごとにHTMLの取得が走るため、`og:image` を共通化していても、ページ側のキャッシュ効率は安定しない。

### 3.3 現状の OGP 画像ルートも動的

現在の `/types/[typeCode]/opengraph-image` は `next/og` の動的ルートとして動いている。タイプ数は16件なので、ここを実行時生成にしておく合理性は薄い。

### 3.4 マーケティング用途と個人結果URLの役割が混ざっている

SNSで拡散したいのは「このタイプの魅力」であり、毎回固有の `key` を持つページである必要は薄い。一方で、診断直後の本人向け結果表示には `key` 付きURLが便利である。

## 4. 方針候補

| 案 | 概要 | 長所 | 短所 |
| --- | --- | --- | --- |
| A | 共有URLも `/types/[typeCode]/[key]` のまま維持する | 実装変更が少ない | URL数が無限に増える。HTMLアクセスが分散する |
| B | 診断結果URLは `/types/[typeCode]/[key]`、SNS共有URLは `/types/[typeCode]` に分離する | 共有先URLを16件に収束できる。役割分離が明快 | SNS上ではユーザー名や軸詳細をURLに含められない |
| C | 共有専用の永続IDをDBやKVで発行する | 将来的に個別共有と安定URLを両立できる | MVPには重い。永続化基盤が必要 |

## 5. 推奨案

### 5.1 結論

MVPでは **案B** を推奨する。

- 診断直後に遷移するURLは `/types/[typeCode]/[key]` のまま維持する
- SNS共有ボタンが使うURLは `/types/[typeCode]` に変更する
- `key` 付きURLは「本人向け結果URL」として扱い、マーケティング用共有URLから外す

### 5.2 共有URLの役割分離

#### `/types/[typeCode]`

- SNS共有の正規URL
- `canonical` の基準URL
- `index` 対象
- 16タイプぶんに収束する固定URL

#### `/types/[typeCode]/[key]`

- 診断直後の着地URL
- ユーザー名や軸サマリを含んだ本人向け結果URL
- `noindex`
- SNS共有のデフォルトURLには使わない

### 5.3 OGP画像の方針

OGP画像は `next/og` 実行時生成ではなく、タイプごとの事前生成アセットを正とする。

推奨パス:

- `/types/{typeCode}-ogp.png`

理由:

- タイプ数が16件で固定的
- `docs/type-ogp-image-spec.md` の事前生成方針と整合する
- クローラごとの再取得が発生しても、静的配信の方が読みやすく安い
- OGP画像URLも16件に収束する

### 5.4 SNS本文で個別性を担保する

URLを固定ページに寄せても、個別感はシェア文面で補える。

例:

- `私は「潜入記者 (OFEI)」でした`
- `○○さんの結果は「潜入記者 (OFEI)」`

MVPでは、個別性は本文で表現し、URLまで個別化しない方が運用に向く。

### 5.5 個別URLはコピー専用アクションに分離する

`/types/[typeCode]/[key]` を完全に捨てる必要はない。必要であれば、共有ページ上に別アクションを用意する。

- `SNSで共有する`: `/types/[typeCode]`
- `この結果URLをコピー`: `/types/[typeCode]/[key]`

この分離により、通常のSNS拡散は固定URLに寄せつつ、深い共有も残せる。

## 6. 実装提案

### 6.1 フェーズ1: URL戦略の分離

- 診断完了後の遷移先は引き続き `/types/[typeCode]/[key]`
- `shared` モードの `ShareActions` に渡す `shareUrl` は `publicUrl` ベースへ変更
- `key` 付きURLを共有したい場合だけ、別のコピー導線を追加

### 6.2 フェーズ2: OGP画像の静的化

- タイプ別OGPを事前生成して `public/types/{typeCode}-ogp.png` に配置
- `generateMetadata` の `openGraph.images` / `twitter.images` は静的画像URLを明示
- `/types/[typeCode]/opengraph-image` への依存をやめる

### 6.3 フェーズ3: メタデータの責務整理

- `/types/[typeCode]` は公開用メタデータを持つ
- `/types/[typeCode]/[key]` は `noindex` を維持する
- `canonical` は常に `/types/[typeCode]`
- OGPタイトルやdescriptionはタイプ単位の固定文言を使う

## 7. この案で得られる効果

- SNS共有先URLが16件に収束する
- クローラが巡回する主要URL数を抑えられる
- OGP画像のキャッシュ戦略が単純になる
- `Vercel` 無料枠の読みにくさを減らせる
- 公開ページと本人向け結果ページの責務が明確になる

## 8. 採用しない方がよい案

### 8.1 `key` 付きURLをSNS共有の標準にする

MVPでは非推奨とする。

理由:

- 同じタイプでもURLが無限に増える
- キャッシュ最適化よりURL増加の問題が大きい
- ユーザーにとっての価値に対して運用コストが重い

### 8.2 回答内容まで含んだ重い共有URLを急いで採用する

将来拡張としてはあり得るが、MVPでは避ける。

理由:

- URLがさらに長くなりやすい
- 共有の安定性より個別再現を優先する設計になる
- まずは「タイプページ共有」と「本人結果表示」の分離を先に固めるべき

## 9. 将来拡張

もし将来的に「個別結果URLそのものをSNS共有の主役にしたい」要件が強くなった場合は、`key` 埋め込み方式ではなく永続ID方式を検討する。

例:

- `share_results` テーブル
- `KV / Edge Config / Blob` などの永続化
- `/share/[shareId]` のような共有専用URL

ただしこれはMVPの範囲外とする。

## 10. 最終提案

MVPでは次のルールに統一するのがよい。

1. 診断直後の本人向けURLは `/types/[typeCode]/[key]`
2. SNS共有の正規URLは `/types/[typeCode]`
3. OGP画像は `/types/{typeCode}-ogp.png` の静的アセット
4. `key` 付きURLは `noindex` のまま維持
5. 個別性は本文で表現し、URLでは増やしすぎない

この方針なら、いまの実装資産を大きく崩さず、共有導線と運用コストのバランスを取りやすい。
