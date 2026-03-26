# マダミスタイプ診断 フロントエンド配置整理設計書

## 1. このドキュメントの目的

このドキュメントは、`app/` と `components/` の責務を整理し、今後の改修で迷いにくいフロントエンド構成を定義するための設計書である。

今回の整理で達成したいことは、以下の 4 点である。

- `app/` を Next.js のルーティング責務に集中させる
- `components/` を機能やドメインごとに見つけやすくする
- CSS Module を所有コンポーネントの近くへ戻す
- 既存 URL や画面挙動を変えずに、構成だけを整える

本書は、以下の資料を前提にしている。

- [specification.md](./specification.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`

---

## 2. 現状の課題

### 2.1 `components/` がフラットで責務が混在している

現在の `components/` には、以下の異なる責務が同居している。

- トップページ専用 UI
- 診断フロー専用 UI
- タイプ詳細専用 UI
- レイアウト部品

この状態だと、コンポーネント追加時に置き場所の判断がぶれやすく、修正時も探索コストが高い。

### 2.2 `app/` 配下に実質コンポーネントが残っている

以下は Next.js のルート定義というより、実質的に UI コンポーネントである。

- `app/page.tsx`
- `app/types/[typeCode]/type-detail-page-content.tsx`

特に `type-detail-page-content.tsx` は公開ページと共有ページの両方から使われており、`app/` に置くより `components/` に置く方が責務に合っている。

### 2.3 CSS の配置が責務と一致していない

`app/types/[typeCode]/[key]/page.module.css` は共有ページ専用に見えるが、実際には `type-detail-page-content.tsx` の見た目全体を担っている。  
このように「スタイルの所有者」と「ファイルの置き場所」がずれているため、追跡しづらい。

### 2.4 ルートと UI の境界が曖昧

`app/` には本来、以下だけが残る状態が分かりやすい。

- `page.tsx`
- `layout.tsx`
- `not-found.tsx`
- `opengraph-image.tsx`
- `robots.ts`
- `sitemap.ts`
- `generateMetadata` や `generateStaticParams` を持つルートエントリ

現状は、ルート定義と大きな UI 実装が混ざっている。

---

## 3. 設計方針

### 3.1 `app/` は「公開ルートの入口」だけを置く

`app/` には Next.js の file convention に該当するファイルだけを残す。

- `page.tsx`
- `layout.tsx`
- `not-found.tsx`
- `opengraph-image.tsx`
- `robots.ts`
- `sitemap.ts`

これらのファイルの責務は、以下に限定する。

- URL とルートの定義
- `params` の解決
- `generateMetadata`
- `generateStaticParams`
- データ取得
- `notFound()` 判定
- コンポーネントへの props 受け渡し

### 3.2 UI は原則 `components/` に移す

以下に当てはまるものは `components/` に置く。

- JSX を主責務とする
- CSS Module を持つ
- ルート外から再利用できる
- ルート内専用でも、見た目や状態管理を担う

### 3.3 `components/` は機能/ドメイン単位で分類する

今回は過度に細かい atomic 設計にはせず、現状の機能単位で分類する。

- `home`
- `diagnosis`
- `type`
- `layout`

### 3.4 各コンポーネントは専用フォルダを持つ

1 コンポーネントにつき 1 フォルダを基本とする。  
フォルダ内に以下を同居させる。

- コンポーネント本体
- CSS Module
- 将来必要になった場合の小さな helper / subcomponent

### 3.5 URL は変えない

今回の整理は構成変更であり、URL 設計変更ではない。  
そのため、以下の公開 URL は維持する。

- `/`
- `/diagnosis`
- `/types/[typeCode]`
- `/types/[typeCode]/[key]`

### 3.6 `app/` の整理には Route Groups を使う

Next.js の Route Groups を使い、URL を変えずに `app/` の見通しだけを改善する。

ただし、グループごとの `layout.tsx` は今回作らない。  
トップレベル `app/layout.tsx` を維持し、不要な full page reload の条件を増やさない。

---

## 4. 配置ルール

### 4.1 `app/` に置いてよいもの

- Next.js の file convention に該当するファイル
- ルート専用の metadata / params / data loading
- OGP 生成や sitemap 生成など、ルーティング起点の処理

### 4.2 `app/` に置かないもの

- 大きな見た目コンポーネント
- 共有 UI
- CSS Module を伴う表示ロジック
- 共有ページと公開ページで使い回すページ本文

### 4.3 `components/` に置くもの

- 画面の section
- フォーム UI
- 結果表示 UI
- レイアウト部品
- 画像表示 UI
- シェア UI

### 4.4 CSS の扱い

- ページ本文の見た目を担う CSS Module は、その本文コンポーネントのフォルダへ置く
- `globals.css` は引き続き `app/` に残す
- 共通 utility class や design token は `globals.css`
- 個別コンポーネント専用の装飾は各 component folder の CSS Module

### 4.5 依存方向

- `app` → `components`, `lib`, `data` は可
- `components/home` → `components/type`, `components/layout`, `lib` は可
- `components/diagnosis` → `components/home` は不可
- `components/type` → `components/home` は不可
- `components/layout` → feature folder への依存は避ける

要するに、トップページは他 feature を組み合わせてもよいが、feature 同士が相互依存し始めない構成にする。

---

## 5. 目標ディレクトリ構成

### 5.1 `app/`

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
        opengraph-image.tsx
        [key]/
          page.tsx
  favicon.ico
  globals.css
  layout.tsx
  not-found.tsx
  opengraph-image.tsx
  robots.ts
  sitemap.ts
```

### 5.2 `components/`

```text
components/
  diagnosis/
    diagnosis-flow/
      diagnosis-flow.tsx
      diagnosis-flow.module.css
    start-diagnosis-form/
      start-diagnosis-form.tsx
  home/
    axis-composition-section/
      axis-composition-section.tsx
      axis-composition-section.module.css
    home-page/
      home-page.tsx
      home-page.module.css
  layout/
    site-footer/
      site-footer.tsx
      site-footer.module.css
  type/
    axis-balance-bars/
      axis-balance-bars.tsx
    share-actions/
      share-actions.tsx
    type-artwork/
      type-artwork.tsx
    type-detail-page-content/
      type-detail-page-content.tsx
      type-detail-page-content.module.css
```

### 5.3 この構成にした理由

- `home`: トップページでのみ意味を持つ UI
- `diagnosis`: 診断開始と診断フロー
- `type`: タイプ詳細、結果表示、タイプ画像、共有
- `layout`: グローバルなフッター

`share-actions` は一般化も可能だが、現時点ではタイプ詳細ページ専用の props 形状であり、`type/` 配下の方が分かりやすい。

---

## 6. 現行ファイルと移行先の対応

| 現在 | 移行先 | 役割 |
| --- | --- | --- |
| `app/page.tsx` | `app/(marketing)/page.tsx` + `components/home/home-page/home-page.tsx` | ルート入口とトップページ本文を分離 |
| `app/page.module.css` | `components/home/home-page/home-page.module.css` | トップページ本文の CSS を所有コンポーネントへ移動 |
| `app/diagnosis/page.tsx` | `app/(diagnosis)/diagnosis/page.tsx` | Route Group へ移動。責務はそのまま |
| `app/types/[typeCode]/page.tsx` | `app/(types)/types/[typeCode]/page.tsx` | Route Group へ移動。公開タイプページ入口 |
| `app/types/[typeCode]/opengraph-image.tsx` | `app/(types)/types/[typeCode]/opengraph-image.tsx` | Route Group へ移動。OGP ルートは `app` に残す |
| `app/types/[typeCode]/[key]/page.tsx` | `app/(types)/types/[typeCode]/[key]/page.tsx` | Route Group へ移動。共有結果ページ入口 |
| `app/types/[typeCode]/type-detail-page-content.tsx` | `components/type/type-detail-page-content/type-detail-page-content.tsx` | 公開/共有両ページから使う本文 UI を `components` へ移動 |
| `app/types/[typeCode]/[key]/page.module.css` | `components/type/type-detail-page-content/type-detail-page-content.module.css` | 本文 UI の CSS を所有コンポーネントへ移動 |
| `components/axis-composition-section.tsx` | `components/home/axis-composition-section/axis-composition-section.tsx` | ホーム専用 section |
| `components/axis-composition-section.module.css` | `components/home/axis-composition-section/axis-composition-section.module.css` | 上記 CSS |
| `components/diagnosis-flow.tsx` | `components/diagnosis/diagnosis-flow/diagnosis-flow.tsx` | 診断フロー本体 |
| `components/diagnosis-flow.module.css` | `components/diagnosis/diagnosis-flow/diagnosis-flow.module.css` | 上記 CSS |
| `components/start-diagnosis-form.tsx` | `components/diagnosis/start-diagnosis-form/start-diagnosis-form.tsx` | 診断開始フォーム |
| `components/type-artwork.tsx` | `components/type/type-artwork/type-artwork.tsx` | タイプ画像表示 |
| `components/share-actions.tsx` | `components/type/share-actions/share-actions.tsx` | タイプ結果の共有 UI |
| `components/site-footer.tsx` | `components/layout/site-footer/site-footer.tsx` | グローバルフッター |
| `components/site-footer.module.css` | `components/layout/site-footer/site-footer.module.css` | 上記 CSS |
| `components/axis-balance-bars.tsx` | `components/type/axis-balance-bars/axis-balance-bars.tsx` | タイプ結果系の補助 UI。現状未使用でも type 配下で保全 |

---

## 7. ルートファイルの責務定義

### 7.1 `app/(marketing)/page.tsx`

責務は以下に限定する。

- `getAllTypes()`
- `getQuestionMaster()`
- `metadata`
- `HomePage` への props 受け渡し

トップページ本文の JSX と `page.module.css` は `components/home/home-page/` に移す。

### 7.2 `app/(diagnosis)/diagnosis/page.tsx`

現状の薄い構成を維持する。

- `getQuestionMaster()`
- `metadata`
- `<DiagnosisFlow />` を描画

### 7.3 `app/(types)/types/[typeCode]/page.tsx`

責務は以下に限定する。

- `generateStaticParams`
- `generateMetadata`
- `getTypeByCode()`
- `hasChibiImage()`
- `notFound()`
- `<TypeDetailPageContent />` への props 受け渡し

### 7.4 `app/(types)/types/[typeCode]/[key]/page.tsx`

責務は以下に限定する。

- 共有キーの decode
- `notFound()` 判定
- 必要なら axis summary 計算
- `generateMetadata`
- `<TypeDetailPageContent />` への props 受け渡し

---

## 8. コンポーネント分割の基準

### 8.1 まず移動だけを優先する対象

以下は、まずフォルダ整理だけを行えば十分である。

- `AxisCompositionSection`
- `DiagnosisFlow`
- `StartDiagnosisForm`
- `TypeArtwork`
- `ShareActions`
- `SiteFooter`
- `AxisBalanceBars`

### 8.2 移動と同時に「app から切り出す」対象

以下は `app/` に残すと責務がぶれるため、今回必ず切り出す。

- `HomePage`
- `TypeDetailPageContent`

### 8.3 将来さらに分割してよい対象

以下は移動後もファイルが大きい場合、同じ component folder 内で section 単位に分割してよい。

- `home-page.tsx`
- `type-detail-page-content.tsx`

ただし初回の整理では、まず「置き場所を正す」ことを優先し、過度な分割は行わない。

---

## 9. 実施手順

### 9.1 推奨順序

1. `app/` に Route Group を作る
2. ルートファイルを新しい `app/` 配置へ移す
3. `components/` に feature/domain フォルダを作る
4. フラットな component と CSS Module を新配置へ移す
5. `app/page.tsx` から `HomePage` を切り出す
6. `app/types/[typeCode]/type-detail-page-content.tsx` を `components/type/` へ移す
7. すべての import を更新する
8. `npm run lint` で静的確認する
9. `/`, `/diagnosis`, `/types/[typeCode]`, `/types/[typeCode]/[key]` を手動確認する

### 9.2 検証観点

- URL が変わっていないこと
- metadata の出力が壊れていないこと
- OGP 画像ルートが動くこと
- トップページの見た目が変わっていないこと
- 診断の開始から共有結果ページまで遷移できること

---

## 10. 今回の整理でやらないこと

以下は今回のスコープ外とする。

- `lib/` の feature 分割
- `data/` 配置の変更
- 画面デザインの刷新
- URL 設計変更
- 共有キー仕様の変更

---

## 11. 最終判断

今回の整理では、以下を最終ルールとする。

- `app/` は Next.js の公開ルート入口だけにする
- 大きな JSX は `components/` へ出す
- `components/` は feature/domain ごとに分類する
- 各コンポーネントは専用フォルダを持つ
- CSS Module は所有コンポーネントの横へ置く
- Route Group を使って `app/` の見通しを改善する

この設計により、今後コンポーネント追加時の判断基準が明確になり、`app` と `components` の責務もぶれにくくなる。
