# マダミスタイプ診断 Edge Requests 増加源メモ

## 1. 目的

現行実装で、Vercel の Edge Requests を増やしていそうな箇所を特定する。  
ここでいう Edge Requests は、Vercel の公式ドキュメントにある通り、静的アセットも Functions も含む「サイトに対する全リクエスト」を指す。

参考:

- [Vercel: Manage and optimize CDN usage](https://vercel.com/docs/pricing/networking)
- [Vercel: Account Plans](https://vercel.com/docs/plans)
- [Next.js 16 local docs: Prefetching](../node_modules/next/dist/docs/01-app/02-guides/prefetching.md)
- [Next.js 16 local docs: Image Component](../node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md)

## 2. 先に結論

現行コードを見る限り、主な増加源は次の 4 つである。

1. ホームの大量な `Link` による production 時の自動 prefetch
2. `next/image` による `/_next/image` リクエスト
3. 共有結果ページ `'/types/[typeCode]/[key]'` の動的 URL 増殖
4. crawler による `sitemap.xml` 経由の公開ページ巡回

逆に、Vercel 公式が典型例として挙げる「過剰な polling / SWR / React Query 再取得」は、現行コードでは確認できなかった。

## 3. 現状で強そうな増加源

### 3.1 ホーム `/` の type detail prefetch

ホームでは次のリンク群が同時に描画される。

- ヒーローカードのタイプ導線 1 件
- 注目タイプ 4 件
- 16 タイプ一覧 16 件

実装:

- [components/home/home-page/home-hero-section.tsx](../components/home/home-page/home-hero-section.tsx)
- [components/home/home-page/featured-types-section.tsx](../components/home/home-page/featured-types-section.tsx)
- [components/home/home-page/all-types-section.tsx](../components/home/home-page/all-types-section.tsx)

重複を除いても、ホームには 16 個の固有な `/types/[typeCode]` リンクが並ぶ。  
Next.js 16 の `Link` は production で viewport 内リンクを自動 prefetch するため、ホーム閲覧だけで type detail 側の追加リクエストが先に走る可能性が高い。

補足:

- `#axes` などのページ内アンカーは同一ドキュメント内移動なので、Edge Requests 増加源ではない
- `Link` は重複 URL をある程度まとめるが、少なくとも「ホームに大量の prefetch 対象がある」構造はそのまま残る

### 3.2 ホーム `/` の `next/image`

ホームでは `TypeArtwork` が 5 回描画される。

- ヒーロー用 1 件
- 注目タイプ用 4 件

実装:

- [components/type/type-artwork/type-artwork.tsx](../components/type/type-artwork/type-artwork.tsx)
- [components/home/home-page/home-hero-section.tsx](../components/home/home-page/home-hero-section.tsx)
- [components/home/home-page/featured-types-section.tsx](../components/home/home-page/featured-types-section.tsx)

`TypeArtwork` は `next/image` を使っており、現行設定では `unoptimized` でも custom loader でもない。  
Next.js のドキュメント上、これはデフォルトで `/_next/image` 経由の最適化リクエストになる。

つまり、ホーム 1 訪問あたり少なくとも次が発生しやすい。

- ドキュメント本体 1 リクエスト
- タイプ画像 5 リクエスト前後
- type detail prefetch がさらに追加

### 3.3 公開タイプ詳細 `/types/[typeCode]` の画像と prefetch

タイプ詳細ページでは、通常 4 枚の `next/image` 対象が出る。

- メイン立ち絵 1 件
- チビ画像 1 件
- 相性カード画像 2 件

相性カード数は 16 タイプすべてで 2 件固定だった。

実装:

- [components/type/type-detail-page-content/type-detail-hero-section.tsx](../components/type/type-detail-page-content/type-detail-hero-section.tsx)
- [components/type/type-detail-page-content/type-compatibility-section.tsx](../components/type/type-detail-page-content/type-compatibility-section.tsx)

加えて、公開タイプ詳細ページには内部リンクもある。

- トップ `/` への導線
- 相性タイプ 2 件への導線

これらも `Link` なので、閲覧時に追加 prefetch を生みうる。

### 3.4 共有結果 `/types/[typeCode]/[key]` の URL 増殖

`next build` の結果では、現行で動的ルートになっているのは共有結果ページだけである。

- `/` は Static
- `/diagnosis` は Static
- `/types/[typeCode]` は SSG
- `/types/[typeCode]/[key]` は Dynamic

実装:

- [app/(types)/types/[typeCode]/[key]/page.tsx](../app/(types)/types/[typeCode]/[key]/page.tsx)

このルートが増やしやすい理由は 2 つある。

1. `key` ごとに URL が無限に増える
2. `cookies()` 利用で request-time レンダリングになっている

人間のアクセスだけなら「1 回開く」だけで済むが、URL が固有なので次のような再訪がすべて別リクエストになる。

- 診断後の自分の再読込
- コピペされた URL の再訪
- チャットアプリや bot のリンク展開
- crawler や監視ツールによるアクセス

共有キーの中身は URL だけで復元できるので、Edge Requests 削減の観点ではこのルートが最も改善余地が大きい。

### 3.5 crawler が取りにくる補助ファイルと公開ページ

SEO 上必要なので削る対象ではないが、Edge Requests の発生源としては把握しておくべきである。

該当:

- `/robots.txt`
- `/sitemap.xml`
- `/manifest.webmanifest`
- `/favicon.ico`
- `/apple-icon.png`
- 公開タイプ詳細 16 ページ

実装:

- [app/robots.ts](../app/robots.ts)
- [app/sitemap.ts](../app/sitemap.ts)
- [app/manifest.ts](../app/manifest.ts)
- [app/layout.tsx](../app/layout.tsx)

特に `sitemap.xml` は 16 個の公開タイプ詳細を列挙しているため、bot はそこから `'/types/[typeCode]'` を順に巡回しやすい。  
これは意図されたトラフィックであり、異常ではない。

## 4. 現時点で「主因ではなさそう」なもの

### 4.1 polling / 再取得ライブラリ

Vercel 公式は、Edge Requests が増える典型例として polling や SWR / React Query の再取得を挙げている。  
しかし、現行の `app/`, `components/`, `lib/`, `data/` 配下では次は見つからなかった。

- `useSWR`
- React Query / TanStack Query
- `fetch()` を使うクライアント再取得
- `axios`
- `setInterval()` による定期通信

したがって、現行実装では「API を叩きすぎている」より、「静的ページと静的アセットを細かく取りにいっている」方が実態に近い。

### 4.2 analytics / beacon 系

現時点では次も確認できなかった。

- Google Analytics
- Vercel Analytics
- `navigator.sendBeacon`
- Plausible / PostHog / Mixpanel など

計測 SDK 由来のリクエスト増加は、現行では主因ではなさそうである。

## 5. ページ別の見立て

### 5.1 ホーム `/`

増加源として強いもの:

- 16 タイプ詳細への自動 prefetch
- `TypeArtwork` 5 枚分の `/_next/image`

優先度:

- 最優先で `prefetch={false}` を検討
- 次に画像の `unoptimized` 化または plain `<img>` 化を検討

### 5.2 公開タイプ詳細 `/types/[typeCode]`

増加源として強いもの:

- 立ち絵
- チビ画像
- 相性カード 2 枚
- 相性タイプとトップへの内部リンク

優先度:

- 画像最適化の見直し
- 相性リンクの prefetch 制御

### 5.3 共有結果 `/types/[typeCode]/[key]`

増加源として強いもの:

- URL の固有化
- dynamic route
- 画像 4 枚前後

優先度:

- 最優先で hash ベースへの移行を検討

## 6. 実装ファクトまとめ

### 6.1 画像ファイルの状況

`public/types/` には、各タイプごとに次が存在する。

- 立ち絵 PNG
- チビ PNG
- OGP PNG

つまり、現行の画像表示は「画像がないので fallback が多い」のではなく、「画像が揃っているので実際に取りにいく」構造になっている。

### 6.2 相性カードの件数

`data/types/*.json` を確認したところ、全 16 タイプで `goodWithTypeCodes` は 2 件固定だった。  
そのため、タイプ詳細ページでは相性カード由来の画像 2 件とリンク 2 件が毎回発生する前提で見てよい。

## 7. このプロジェクトでの優先順位

Edge Requests だけに絞るなら、現行コードベースでは次の順が妥当である。

1. ホームとタイプ詳細の `Link` prefetch を止める
2. `next/image` のデフォルト最適化を止める
3. 共有結果ルートを `'/types/[typeCode]/[key]'` から外す
4. 画像 URL を versioned asset にして再検証頻度を下げる

3 は長期的には最重要だが、1 と 2 は最短で効きやすい。

## 8. 関連文書

- [vercel-request-reduction-plan.md](./vercel-request-reduction-plan.md)
