# マダミスタイプ診断

Next.js 16 App Router で実装された、マーダーミステリー向けの 4 軸 16 タイプ診断アプリです。
この README は、2026-03-30 時点の現行ソースコードを正として整理しています。

## 公開ルート

- `/`
  トップページ。診断開始フォーム、注目タイプ表示、16タイプ一覧を同一ページに持つ
- `/diagnosis`
  診断フロー。32問を 4 ページに分けて回答する
- `/types/[typeCode]`
  タイプごとの公開詳細ページ。SEO / OGP / canonical の基準ページ
- `/types/[typeCode]/[key]`
  診断直後の着地先兼共有結果ページ。`noindex`、canonical は公開詳細ページ

現行コードには、専用の `/types` 一覧ページはありません。16タイプ一覧はトップページ内に配置されています。

## 現在の実装内容

- ユーザー名を入力して診断を開始する
- 32問を 8 問ずつ 4 ページで回答する
- 5 段階回答を 4 軸へ集計し、16タイプへ判定する
- 診断途中の `userName` / `answers` / `currentPage` を `localStorage` に保存し、復元する
- 診断完了後は `/types/[typeCode]/[key]` に遷移する
- 公開詳細ページ `/types/[typeCode]` ではタイプ概要・強み・注意点・立ち回り・相性を表示する
- 共有結果ページ `/types/[typeCode]/[key]` では共有ユーザー名と 4 軸サマリを表示する
- SNS 共有は公開詳細ページ `/types/[typeCode]` に集約し、共有結果ページでは別途「結果URLをコピー」を提供する
- OGP 画像は `public/main-ogp.png` と `public/types/{typeCode}-ogp.png` の静的アセットを使用する
- JSON-LD、`sitemap.xml`、`robots.txt`、`manifest.webmanifest` を実装している

## 共有キーの現行仕様

共有キーは `v3` のみをサポートします。

- `v3`
  ユーザー名 + 4軸トレンド状態を持つ現行形式

`v3` は、回答全文ではなく 4 軸の傾向をコンパクトに保持します。  
旧 `v1` / `v2` URL はサポートしません。

## 技術構成

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- ESLint `9`

スタイリングは `app/globals.css` の CSS 変数 + 共通クラスと、各コンポーネント横の CSS Module を併用しています。
フォーム管理ライブラリや状態管理ライブラリは導入していません。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 環境変数

### アプリ本体

- `NEXT_PUBLIC_SITE_URL`
  本番で必須。`metadataBase`、canonical、JSON-LD、sitemap の絶対 URL 生成に使う
- `NEXT_PUBLIC_LINE_STAMP_URL`
  任意。設定するとトップページの LINE スタンプ導線が有効になる

`NEXT_PUBLIC_SITE_URL` を設定しない場合、`lib/site.ts` のフォールバックにより `http://localhost:3000` が使われます。

### 画像生成スキル

画像生成系スクリプトは `.env.character-images` を使用します。

- `NANOBANANA_API_KEY`
- 必要に応じて `NANOBANANA_API_BASE`

## 利用可能なコマンド

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## ディレクトリ構成

```text
app/
  (marketing)/
    page.tsx                             トップページ
  (diagnosis)/
    diagnosis/
      page.tsx                           診断フロー入口
  (types)/
    types/
      [typeCode]/
        page.tsx                         公開詳細ページ
        [key]/
          page.tsx                       共有結果ページ
  apple-icon.png
  favicon.ico
  globals.css
  layout.tsx
  manifest.ts
  not-found.tsx
  robots.ts
  sitemap.ts

components/
  diagnosis/
    diagnosis-flow/
    start-diagnosis-form/
  home/
    axis-composition-section/
    home-page/
  layout/
    site-footer/
  type/
    share-actions/
    type-artwork/
    type-detail-page-content/

lib/
  axis.ts
  data.ts
  diagnosis.ts
  draft-storage.ts
  json-ld.ts
  post-diagnosis-result.ts
  share-key.ts
  site.ts
  types.ts

data/
  question-master.json                   32問の質問マスタ
  types/*.json                           16タイプの定義データ

public/
  main-ogp.png                           トップページ OGP
  favicons/*                             PWA / favicon 用アセット
  types/
    {typeCode}.png                       通常キャラ画像
    {typeCode}_chibi.png                 チビ画像
    {typeCode}-ogp.png                   タイプ別 OGP

skills/
  madamistype-character-images/          キャラクター画像一括生成スキル
  madamistype-type-ogp-images/           タイプ別 OGP 一括生成スキル

docs/
  specification.md                       主仕様書
  diagnosis-logic-spec.md                診断ロジック詳細
  tech-stack-spec.md                     技術設計
  ui-design-spec.md                      UI / 表現ルール
  frontend-directory-structure-spec.md   フロントエンド構成ガイド
  current-source-issues.md               現行ソースコードの問題点
```

## まず読むドキュメント

- [docs/specification.md](./docs/specification.md)
  現行実装ベースの主仕様
- [docs/diagnosis-logic-spec.md](./docs/diagnosis-logic-spec.md)
  32問、4軸、同点処理、共有キーの扱い
- [docs/tech-stack-spec.md](./docs/tech-stack-spec.md)
  現在の技術構成、ルーティング、メタデータ運用
- [docs/ui-design-spec.md](./docs/ui-design-spec.md)
  現行 UI のビジュアル方針
- [docs/frontend-directory-structure-spec.md](./docs/frontend-directory-structure-spec.md)
  Route Group を含む現在の構成整理
- [docs/current-source-issues.md](./docs/current-source-issues.md)
  実装上の既知課題

## 検証状況

2026-03-30 時点で以下を実行済みです。

- `npm run lint`
- `npm run build`

`next build` の結果、静的な公開ルートは `/`、`/diagnosis`、`/types/[typeCode]` で、共有結果ページ `/types/[typeCode]/[key]` は動的ルートとして出力されます。
