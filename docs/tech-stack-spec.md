# マダミスタイプ診断 技術スタック設計書

## 1. このドキュメントの目的

このドキュメントは、マダミスタイプ診断のMVPを実装するための技術スタックと、その採用理由を整理するための設計書である。

単に技術名を並べるのではなく、以下を明確にする。

- それぞれの技術を何に使うのか
- このサービスと相性が良い理由は何か
- 採用時に気を付けるべき点は何か
- 必要な補足提案や修正は何か

---

## 2. 採用方針の結論

今回のサービスでは、以下の構成を推奨する。

| 領域 | 採用技術 | 主な役割 |
| --- | --- | --- |
| アプリ基盤 | Next.js（App Router / TypeScript） | 画面ルーティング、描画、メタデータ、OGP、SEO基盤 |
| 配信基盤 | Vercel | 本番公開、Preview Deployments、環境分離 |
| スタイリング | Tailwind CSS | 画面レイアウト、デザイントークン、レスポンシブ対応 |
| UI部品 | shadcn/ui | ボタン、カード、入力、進捗表示などの基礎コンポーネント |
| アニメーション | Motion | 診断体験の遷移演出、表示アニメーション |
| フォーム管理 | React Hook Form | 診断回答の状態管理、段階遷移、入力制御 |
| バリデーション | Zod | 回答データ、マスタデータ、URLパラメータの検証 |
| SEO/シェア | Next.js Metadata API | title、description、canonical、OG/Twitter metadata |
| OGP画像生成 | `next/og` | タイプ別の動的OGP画像生成 |
| 構造化データ | JSON-LD | 検索エンジン向けの補助情報提供 |
| クローラ制御 | sitemap / robots | 公開URL一覧とクロール方針の明示 |

この構成は、診断サービスに必要な「表示速度」「運用の軽さ」「SEO」「SNSシェア」のバランスが良い。

---

## 3. 各技術の役割と採用理由

### 3.1 Next.js（App Router / TypeScript）

#### 何に使うか

- 画面ルーティング
- ページ描画
- レイアウト共通化
- Metadata API
- OGP画像ルート
- sitemap / robots の生成

#### このサービスでの使いどころ

- トップページは静的に高速配信する
- 診断質問画面はクライアントコンポーネント中心で操作性を担保する
- タイプ詳細ページは静的ページとして配信し、SEOとSNSシェアの受け皿にする
- 各タイプごとに metadata と OGP を切り替える

#### 採用理由

Next.js は App Router 上で、ページ設計、SEO、メタデータ、OGP、配信の相性が非常に良い。今回のように「診断UI」と「公開ページ」の両方が必要なサービスに向いている。

TypeScript を前提にすることで、質問マスタ、タイプマスタ、診断ロジック、URLパラメータの整合性を保ちやすい。

#### 注意点

- Server Components を基本にし、質問UIやアニメーションが必要な箇所だけ Client Components に寄せる
- 診断ロジックは UI と分離し、`lib/diagnosis` のような純粋関数として持つ
- Metadata API を使う前提で、ルートレイアウトに `metadataBase` を設定する

### 3.2 Vercel

#### 何に使うか

- 本番デプロイ
- Preview Deployments
- 環境ごとの変数管理
- Next.js の標準機能を素直に動かす配信基盤

#### このサービスでの使いどころ

- 本番環境とプレビュー環境を分ける
- デザインやOGPの確認をURL単位で素早く行う
- マーケティング系ページの更新確認を簡単にする

#### 採用理由

Vercel は Next.js と最も相性が良く、MVP段階で運用コストを増やしにくい。特に、ブランチ単位やPR単位でプレビューURLを持てるため、トップページ、結果ページ、OGP画像の確認がしやすい。

#### 注意点

- 本番用URLとPreview URLで `metadataBase` や canonical の扱いを崩さない
- 環境変数は Production / Preview / Local で分けて管理する

### 3.3 Tailwind CSS

#### 何に使うか

- 画面全体のスタイリング
- 余白、タイポグラフィ、色、レスポンシブ制御
- コンポーネントの見た目調整

#### このサービスでの使いどころ

- スマホ中心の縦長レイアウト
- 診断カード、回答ボタン、結果セクションのスタイル
- タイプ別の色分けやアクセント表現

#### 採用理由

Tailwind CSS は MVP の立ち上がりが速く、細かいUI調整とレスポンシブ対応に強い。shadcn/ui との相性も良く、デザインシステムの土台にしやすい。

#### 注意点

- `globals.css` と CSS変数で色・余白・角丸を整理し、クラスの場当たり運用を避ける
- タイプ別デザイン差分を増やしすぎると保守性が落ちるため、基本トークンは統一する

### 3.4 shadcn/ui

#### 何に使うか

- ボタン
- カード
- ラジオやセレクトなどの入力UI
- プログレス
- ダイアログ
- トースト

#### このサービスでの使いどころ

- 診断開始ボタン
- 回答UI
- 進捗表示
- 結果カード
- シェア導線

#### 採用理由

shadcn/ui は「完成済みの部品をライブラリとして使う」のではなく、「コンポーネントコードを自分のアプリ側に取り込んで育てる」前提の仕組みである。今回のように、診断サービスの世界観に合わせて見た目や挙動を調整したい場合に相性が良い。

#### 注意点

- デフォルト見た目のまま終わらせず、サービスのトーンに合わせてトークンを調整する
- shadcn/ui はベース部品として使い、最終的な診断体験はアプリ独自コンポーネントで組む

### 3.5 Motion

#### 何に使うか

- 画面表示アニメーション
- ステップ遷移
- 結果表示の演出
- ボタンやカードの軽いインタラクション

#### このサービスでの使いどころ

- 診断トップのヒーロー表現
- 8問ごとの遷移演出
- 進捗バーの変化
- 結果画面の段階表示

#### 採用理由

診断サービスは、情報量そのものより「気持ちよく答え進められる体験」が重要である。Motion を使うと、重すぎない範囲で体験価値を上げやすい。

#### 注意点

- パッケージ名は `motion`、React での import は `motion/react` を前提にする
- App Router では Client Component 側で利用する
- `prefers-reduced-motion` を考慮し、動きは必須ではなく補助にとどめる
- 多用するとスマホで重くなるため、診断体験に直結する箇所だけに使う

### 3.6 React Hook Form

#### 何に使うか

- 32問の回答状態管理
- ページ送り時の入力保持
- バリデーション連携
- 再描画の抑制

#### このサービスでの使いどころ

- 1画面8問のステップ形式
- 回答変更
- 戻る操作
- 未回答チェック

#### 採用理由

設問数が多いフォームは、状態管理が雑だと描画負荷と実装負荷が上がる。React Hook Form は大きめのフォームでも扱いやすく、今回の診断UIに向いている。

#### 注意点

- Zod と組み合わせるなら `@hookform/resolvers` を追加採用する
- shadcn/ui の独自入力コンポーネントとつなぐ箇所では `Controller` の使用を前提に設計する
- 「回答状態」と「診断ロジック」を同じコンポーネントに詰め込まない

### 3.7 Zod

#### 何に使うか

- フォーム入力値の検証
- 質問マスタの検証
- タイプマスタの検証
- URLクエリや route params の検証

#### このサービスでの使いどころ

- 診断回答の構造定義
- `data/question-master.json` の妥当性確認
- 将来追加するタイプマスタの型安全化
- 結果ページの不正な type code の防止

#### 採用理由

Zod は「実行時バリデーション」と「TypeScript 型推論」を一緒に扱えるため、MVPでありがちなデータ定義のズレを減らしやすい。

#### 注意点

- TypeScript の `strict: true` を前提にする
- フォーム用途だけでなく、静的マスタデータの検証にも使う

### 3.8 Next.js Metadata API

#### 何に使うか

- `<title>`
- description
- canonical
- Open Graph
- Twitter Card

#### このサービスでの使いどころ

- トップページのSEO最適化
- タイプ詳細ページごとのタイトル差し替え
- SNSシェア時のメタ情報切り替え

#### 採用理由

App Router と標準で統合されているため、別ライブラリを増やさずSEOとSNS向け設定を管理できる。

#### 注意点

- ルートの `layout.tsx` で `metadataBase` を設定する
- 相対URLで metadata を書く場合、`metadataBase` 未設定だとビルドエラーになる
- shared metadata と route-specific metadata の責務を分ける

### 3.9 `next/og` による動的OGP生成

#### 何に使うか

- タイプ別のOGP画像生成
- シェア時の見た目出し分け

#### このサービスでの使いどころ

- `/types/[typeCode]/opengraph-image.tsx` のような構成で、各タイプ専用の画像を生成する
- タイプ名、キャッチコピー、ビジュアルカラーを反映する

#### 採用理由

診断サービスはシェア体験が重要であり、タイプごとに画像を出し分ける価値が高い。Next.js 標準の `next/og` を使えば、App Router の流れのまま実装できる。

#### 注意点

- `ImageResponse` は flexbox 中心で、通常のブラウザCSSをそのまま使えるわけではない
- `display: grid` のような高度なレイアウトは避ける
- 日本語フォントを使う場合は、OGP用フォント読み込みを最初に設計する

### 3.10 JSON-LD 構造化データ

#### 何に使うか

- 検索エンジンへページの意味を補助的に伝える

#### このサービスでの使いどころ

- トップページに `WebSite`
- 運営情報を出す場合は `Organization`
- タイプ詳細ページに `WebPage`
- パンくずがある場合は `BreadcrumbList`

#### 採用理由

診断サービス自体がリッチリザルト化されるわけではないが、トップページや公開詳細ページの意味を補足できる。特にタイプ詳細ページを独立URLで公開する場合に有効である。

#### 注意点

- JSON-LD は `next/script` ではなく、通常の `<script type="application/ld+json">` で出力する
- `JSON.stringify` の結果は `<` を `\\u003c` に置換するなど、埋め込み時の安全性を確保する
- 実際に存在しないFAQやレビューを無理に構造化データ化しない

### 3.11 sitemap / robots の整備

#### 何に使うか

- 公開ページ一覧の通知
- クロール対象の整理

#### このサービスでの使いどころ

- `app/sitemap.ts` でトップページとタイプ詳細ページを列挙する
- `app/robots.ts` でクロール方針を返す

#### 採用理由

App Router 標準の metadata files で扱えるため、別ライブラリを追加せずに運用できる。

#### 注意点

- SEO対象は ` / ` と ` /types/[typeCode] ` のような公開ページに寄せる
- ` /diagnosis ` や ` /diagnosis/result ` のような途中導線は、検索流入の主戦場にしない設計が扱いやすい

---

## 4. このサービス向けの実装方針

### 4.1 推奨ルーティング

| URL | 役割 | 推奨方針 |
| --- | --- | --- |
| `/` | サービス紹介トップ | index対象 |
| `/diagnosis` | 診断回答フロー | 基本はアプリ導線用 |
| `/diagnosis/result` | 回答直後の結果画面 | noindex推奨 |
| `/types/[typeCode]` | 公開用タイプ詳細ページ | index対象、シェア先URL |

### 4.2 なぜ結果画面とタイプ詳細ページを分けるのか

これは今回の技術構成で最も重要な提案である。

- 診断直後の結果画面は、回答に依存するUIや4軸バランス表示を持ちやすい
- 一方で、SNSシェアやSEOは「誰でも見られる固定URL」の方が運用しやすい
- そのため、共有先は `/types/[typeCode]` のような公開ページに寄せるのがよい

この分離により、以下が整理しやすくなる。

- Metadata API の管理
- `next/og` によるタイプ別OGP
- sitemap への登録
- JSON-LD の設置
- 再訪導線

### 4.3 推奨データ配置

- `data/question-master.json`
- `data/types/<typeCode>.json`
- `src/lib/diagnosis/score.ts`
- `src/lib/diagnosis/types.ts`
- `src/lib/seo/json-ld.ts`

現状すでに `data/question-master.json` があるため、MVPではJSON管理を継続してよい。タイプ定義も `data/types/<typeCode>.json` のように分割管理して問題ない。ただし、アプリ起動時または参照時に Zod で必ず検証する。

### 4.4 推奨ファイル構成

```text
src/
  app/
    layout.tsx
    page.tsx
    diagnosis/
      page.tsx
      result/
        page.tsx
    types/
      [typeCode]/
        page.tsx
        opengraph-image.tsx
    sitemap.ts
    robots.ts
  components/
    diagnosis/
    result/
    ui/
  lib/
    diagnosis/
    seo/
data/
  question-master.json
  types/
    TFLP.json
    ...
```

### 4.5 レンダリング方針

- トップページ: Server Component 中心
- 診断画面: Client Component 中心
- 結果直後画面: Client Component 中心
- タイプ詳細ページ: Server Component 中心
- OGP画像: `next/og`

---

## 5. 提案・修正事項

### 5.1 このスタックは基本的に妥当

指定された技術スタックは、MVPの診断サービスとしてかなり相性が良い。大きな入れ替えは不要である。

### 5.2 追加推奨: `@hookform/resolvers`

React Hook Form と Zod を素直につなぐために、`@hookform/resolvers` は追加した方がよい。

### 5.3 修正推奨: 「結果ページ」と「シェアページ」を同一視しない

診断直後の結果画面と、SNS・SEO向けの公開詳細ページは分けて考える方が実装も運用も安定する。

### 5.4 修正推奨: OGPはタイプ詳細ページを基準に設計する

各タイプに固定URLがあれば、Metadata API、OGP、sitemap、JSON-LD が一気に整いやすい。

### 5.5 追加候補: `schema-dts`

JSON-LD を TypeScript で安全に扱いたい場合は、`schema-dts` の追加を検討してよい。ただしMVP必須ではない。

### 5.6 今回は見送ってよいもの

- Headless CMS
- データベース
- 外部SEO専用ライブラリ

MVP段階では、静的マスタデータ + Next.js 標準機能で十分に成立する。

---

## 6. 実装時の短い指針

- まずは `Next.js + Tailwind CSS + shadcn/ui` で画面骨格を作る
- 診断フォームは `React Hook Form + Zod + @hookform/resolvers` で組む
- シェア導線は `/types/[typeCode]` を正とする
- SEOは Next.js 標準機能で完結させる
- Motion は最後に必要箇所へ薄く足す

---

## 7. 参考リンク

- Next.js Metadata and OG Images
  - https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js generateMetadata
  - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js JSON-LD
  - https://nextjs.org/docs/app/guides/json-ld
- Vercel Environments
  - https://vercel.com/docs/deployments/environments
- Tailwind CSS with Next.js
  - https://tailwindcss.com/docs/installation/framework-guides/nextjs
- shadcn/ui Introduction
  - https://ui.shadcn.com/docs
- shadcn/ui for Next.js
  - https://ui.shadcn.com/docs/installation/next
- Motion for React
  - https://motion.dev/docs/react-installation
- React Hook Form
  - https://react-hook-form.com/
- Zod
  - https://zod.dev/
