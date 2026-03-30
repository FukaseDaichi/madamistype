# マダミスタイプ診断 フロントエンド構成設計書

## 1. 文書の目的

本書は、現行ソースコードのディレクトリ構成と責務分離を整理するための文書である。
過去の移行計画ではなく、2026-03-30 時点で実装済みの構成を説明する。

参照:

- [specification.md](./specification.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`

## 2. 現行方針

### 2.1 `app/` はルート入口に寄せる

`app/` には主に以下を置く。

- `page.tsx`
- `layout.tsx`
- `not-found.tsx`
- metadata files (`manifest.ts`, `robots.ts`, `sitemap.ts`)
- route-specific `page.tsx`

大きな JSX 本文は `components/` 側へ寄せる。

### 2.2 `components/` は機能 / ドメイン単位

現行の大分類:

- `home`
- `diagnosis`
- `type`
- `layout`

### 2.3 CSS Module は所有コンポーネント横

例:

- `components/home/home-page/home-page.tsx`
- `components/home/home-page/home-page.module.css`

## 3. 現行ディレクトリ構成

### 3.1 `app/`

```text
app/
  (marketing)/
    page.tsx
  (diagnosis)/
    diagnosis/
      page.tsx
  (types)/
    types/
      [typeCode]/
        page.tsx
        [key]/
          page.tsx
  apple-icon.png
  favicon.ico
  globals.css
  layout.tsx
  manifest.ts
  not-found.tsx
  robots.ts
  sitemap.ts
```

補足:

- Route Group `(marketing)`, `(diagnosis)`, `(types)` は URL に出ない
- 専用の `/types` index route は現行構成に存在しない

### 3.2 `components/`

```text
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
```

### 3.3 `lib/`

```text
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
```

## 4. 役割分担

### 4.1 `app/` の責務

- 公開 URL の定義
- `params` の受け取り
- `generateMetadata`
- `notFound()` 判定
- 必要データの読み込み
- 本文コンポーネントへの props 受け渡し

### 4.2 `components/` の責務

- 実際の画面本文
- UI セクションの構成
- CSS Module を伴う見た目
- クライアント状態管理を持つ部品

### 4.3 `lib/` の責務

- ビジネスロジック
- マスタ読み込み
- URL / metadata / share key の補助
- ブラウザ保存や cookie の管理

## 5. 依存方向

基本ルール:

- `app` → `components`, `lib` は可
- `components` → `lib` は可
- `components/home` → `components/type`, `components/layout` は可
- feature 同士の相互依存は必要最小限にする
- `lib` は React UI へ依存しない

## 6. Route Group の使い方

現行実装では Route Group を「URL を変えずに見通しを良くするため」に使っている。

### 6.1 `(marketing)`

- `/` を担当

### 6.2 `(diagnosis)`

- `/diagnosis` を担当

### 6.3 `(types)`

- `/types/[typeCode]`
- `/types/[typeCode]/[key]`

## 7. 主要ファイルの役割

### 7.1 トップページ

- `app/(marketing)/page.tsx`
  データ取得と `HomePage` 呼び出し
- `components/home/home-page/home-page.tsx`
  トップページ本文全体

### 7.2 診断

- `app/(diagnosis)/diagnosis/page.tsx`
  質問マスタ取得
- `components/diagnosis/diagnosis-flow/diagnosis-flow.tsx`
  診断 UI 本体

### 7.3 タイプ詳細

- `app/(types)/types/[typeCode]/page.tsx`
  公開詳細ページの入口
- `app/(types)/types/[typeCode]/[key]/page.tsx`
  共有結果ページの入口
- `components/type/type-detail-page-content/type-detail-page-content.tsx`
  両ページ共通の本文

## 8. データ / アセット配置

### 8.1 データ

- `data/question-master.json`
- `data/types/*.json`

### 8.2 公開アセット

- `public/main-ogp.png`
- `public/favicons/*`
- `public/types/*`

### 8.3 生成物

- `output/character-images/`

アプリ本体は `output/` を読まず、公開に使う画像は `public/` を正とする。

## 9. この構成で維持したいこと

- `app/` をルーティング入口として保つ
- コンポーネント本文は `components/` に寄せる
- CSS Module は所有者の横に置く
- マスタデータは `data/` に固定する
- 補助ロジックは `lib/` に閉じる

## 10. 現行構成の注意点

- `/types` 一覧ページを前提にしたリンクや文書は現行構成と齟齬が出る
- shared page は cookie 利用のため動的ルートになる
