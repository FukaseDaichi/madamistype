# マダミスタイプ診断 技術スタック設計書

## 1. 文書の目的

本書は、現行ソースコードで採用している技術と、その使い方を整理するための文書である。
将来案ではなく、2026-03-30 時点で実装済みの内容を優先して記載する。

参照:

- [specification.md](./specification.md)
- [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)

## 2. 現行スタック

| 領域 | 採用技術 | 現在の用途 |
| --- | --- | --- |
| アプリ基盤 | Next.js 16.2.1 | App Router、Metadata、Route Handlers 相当の metadata files |
| UI | React 19.2.4 | ページ描画、診断フローの状態管理 |
| 言語 | TypeScript | 型定義、データ構造の明確化 |
| スタイル | Tailwind CSS 4 + CSS Modules | 共通ユーティリティ、ページごとの装飾 |
| 静的解析 | ESLint 9 | ソースコード lint |
| データ管理 | JSON ファイル | 質問マスタ、タイプマスタ |
| 画像運用 | `public/` 静的アセット | 通常画像、チビ画像、OGP 画像、favicon |

## 3. ルーティング

### 3.1 App Router 構成

現行の `app/` は Route Group を使って構成している。

```text
app/
  (marketing)/page.tsx
  (diagnosis)/diagnosis/page.tsx
  (types)/types/[typeCode]/page.tsx
  (types)/types/[typeCode]/[key]/page.tsx
```

Route Group は URL に出さない。
つまり実際の公開 URL は `/`, `/diagnosis`, `/types/[typeCode]`, `/types/[typeCode]/[key]` である。

### 3.2 ビルド時の出力

2026-03-30 に `npm run build` を実行した結果:

- `/`: Static
- `/diagnosis`: Static
- `/types/[typeCode]`: SSG
- `/types/[typeCode]/[key]`: Dynamic

共有結果ページが動的になる理由は、`app/(types)/types/[typeCode]/[key]/page.tsx` で `cookies()` を使っているため。

## 4. メタデータと SEO

### 4.1 ルートメタデータ

`app/layout.tsx` で以下を定義している。

- `metadataBase`
- title template
- description
- Open Graph
- Twitter Card
- viewport themeColor

### 4.2 ページ単位の metadata

- `/`: `metadata`
- `/diagnosis`: `metadata` + `robots.noindex`
- `/types/[typeCode]`: `generateMetadata`
- `/types/[typeCode]/[key]`: `generateMetadata` + `robots.noindex` + canonical to public page

### 4.3 OGP 運用

現行アプリは `next/og` による実行時 OGP 生成を使っていない。
OGP は静的アセットを参照する。

- トップページ: `/main-ogp.png`
- タイプ詳細: `/types/{typeCode}-ogp.png`

### 4.4 JSON-LD

`lib/json-ld.ts` で手組みしている。

- トップページ: `WebSite`
- タイプ詳細 / 共有結果: `WebPage`

### 4.5 sitemap / robots / manifest

実装済み:

- `app/sitemap.ts`
- `app/robots.ts`
- `app/manifest.ts`

`manifest.ts` は `public/favicons/manifest.json` を読み込んで返す。

## 5. アプリケーションデータ

### 5.1 マスタデータ

保存場所:

- `data/question-master.json`
- `data/types/*.json`

読み込み:

- `lib/data.ts`

`lib/data.ts` は `react` の `cache()` を使って同一リクエスト内の重複読み込みを抑えている。

### 5.2 型定義

`lib/types.ts` に以下を持つ。

- 質問マスタ型
- タイプマスタ型
- 診断結果型
- 共有キー型
- 4 軸サマリ型

### 5.3 診断ロジック

`lib/diagnosis.ts` が担当する。

- 回答の数値化
- 4 軸集計
- 同点処理
- `typeCode` 決定
- パーセント正規化

### 5.4 共有キー

`lib/share-key.ts` が担当する。

- `v3` compact key の生成
- shared page 用の axis summary 展開

## 6. クライアント状態管理

### 6.1 診断途中状態

`lib/draft-storage.ts` を使い、`localStorage` に保存する。

保存項目:

- `userName`
- `answers`
- `currentPage`
- `updatedAt`

### 6.2 shared result 判定状態

`lib/post-diagnosis-result.ts` で cookie を扱う。

用途:

- shared result page を「本人の結果URLかどうか」で分岐する
- 診断完了時に結果URL単位の cookie を保存し、再訪やリロードでも同じ URL なら判定を維持する

## 7. スタイリング

### 7.1 共通基盤

`app/globals.css` で以下を管理する。

- CSS 変数
- 共通クラス
- body 背景
- ボタン / 入力 / パネルの基礎スタイル
- reduced motion 対応

### 7.2 局所スタイル

各コンポーネント横の CSS Module を使う。

例:

- `components/home/home-page/home-page.module.css`
- `components/diagnosis/diagnosis-flow/diagnosis-flow.module.css`
- `components/type/type-detail-page-content/type-detail-page-content.module.css`

### 7.3 フォント

`next/font/google` を使用している。

- ルート: `Noto Sans JP`, `Shippori Mincho B1`
- トップ / 診断 / タイプ詳細: `Bebas Neue`, `Special Elite`, `Noto Serif JP`, `Caveat`

## 8. 環境変数

### 8.1 本体

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_LINE_STAMP_URL`

### 8.2 問題になりやすい点

`lib/site.ts` は `NEXT_PUBLIC_SITE_URL` 未設定時に `http://localhost:3000` へフォールバックする。
このため、本番で環境変数を入れないと canonical / sitemap / JSON-LD の絶対 URL が誤る。

## 9. 画像生成スキル

本体アプリとは別に、`skills/` 配下に以下を持つ。

- `skills/madamistype-character-images/`
- `skills/madamistype-type-ogp-images/`

これらは Python スクリプト + 外部 API を前提とした制作系スキルであり、通常のアプリ実行には不要。

## 10. 現時点で採用していないもの

現行ソースには以下は入っていない。

- データベース
- 認証基盤
- Headless CMS
- React Hook Form
- Zod
- Zustand / Redux などの状態管理ライブラリ
- `next/og` による動的 OGP 生成

## 11. 開発コマンド

```bash
npm run dev
npm run build
npm run start
npm run lint
```

2026-03-30 時点では `npm run lint` と `npm run build` の通過を確認済み。

## 12. 補助文書

- 画面 / 表現: [ui-design-spec.md](./ui-design-spec.md)
- ルーティングと構成: [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)
- 既知課題: [current-source-issues.md](./current-source-issues.md)
