# マダミスタイプ診断 技術スタック設計書

## 1. このドキュメントの目的

このドキュメントは、マダミスタイプ診断のMVPを実装するための技術スタックと、その採用理由を整理するための設計書である。

単に技術名を並べるのではなく、以下を明確にする。

- それぞれの技術を何に使うのか
- このサービスと相性が良い理由は何か
- 採用時に気を付けるべき点は何か
- 必要な補足提案や修正は何か

本書は [specification.md](./specification.md) の「9.4 技術方針」や MVP 範囲を、実装観点で具体化する補助仕様書である。要件の主文書は [specification.md](./specification.md) とし、本書はそれを単独で上書きしない。

参照文書:

- [specification.md](./specification.md)
- [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- [type-design-spec.md](./type-design-spec.md)
- [ui-design-spec.md](./ui-design-spec.md)

---

## 2. 採用方針の結論

今回のサービスでは、以下の構成を推奨する。

| 領域 | 採用技術 | 主な役割 |
| --- | --- | --- |
| アプリ基盤 | Next.js 16.2.1（App Router / TypeScript） | 画面ルーティング、描画、メタデータ、OGP、SEO基盤 |
| 配信基盤 | Vercel | 本番公開、Preview Deployments、環境分離 |
| スタイリング | Tailwind CSS 4 | 画面レイアウト、デザイントークン、レスポンシブ対応 |
| フォーム管理 | React useState / useEffect | 診断回答の状態管理、段階遷移、入力制御 |
| SEO/シェア | Next.js Metadata API | title、description、canonical、OG/Twitter metadata |
| OGP画像生成 | `next/og` | タイプ別の動的OGP画像生成 |
| 構造化データ | JSON-LD | 検索エンジン向けの補助情報提供 |
| クローラ制御 | sitemap / robots | 公開URL一覧とクロール方針の明示 |

この構成は、診断サービスに必要な「表示速度」「運用の軽さ」「SEO」「SNSシェア」のバランスが良い。

### 2.1 当初検討したが現時点で未導入のもの

以下は設計段階で採用候補として検討されたが、MVP 実装では導入していない。将来必要になった時点で追加する。

- **shadcn/ui**: ボタン・カード・入力などの基礎コンポーネント。現在は `globals.css` の共通クラスで代替。
- **Motion**: 診断体験の遷移演出。現在は CSS transition のみで実装。
- **React Hook Form**: 大規模フォームの状態管理。現在は `useState` で実装。
- **Zod**: 回答データ・マスタデータの検証。現在は手動バリデーション。
- **@hookform/resolvers**: React Hook Form と Zod の接続。

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

### 3.4 shadcn/ui（未導入・将来候補）

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

### 3.5 Motion（未導入・将来候補）

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

### 3.6 React Hook Form（未導入・将来候補）

#### 何に使うか

- 32問の回答状態管理
- 診断開始前のユーザー名入力
- ページ送り時の入力保持
- バリデーション連携
- 再描画の抑制

#### このサービスでの使いどころ

- 1画面8問のステップ形式
- ユーザー名入力
- 回答変更
- 戻る操作
- 未回答チェック

#### 採用理由

設問数が多いフォームは、状態管理が雑だと描画負荷と実装負荷が上がる。React Hook Form は大きめのフォームでも扱いやすく、今回の診断UIに向いている。

#### 注意点

- Zod と組み合わせるなら `@hookform/resolvers` を追加採用する
- shadcn/ui の独自入力コンポーネントとつなぐ箇所では `Controller` の使用を前提に設計する
- 「回答状態」と「診断ロジック」を同じコンポーネントに詰め込まない

### 3.7 Zod（未導入・将来候補）

#### 何に使うか

- フォーム入力値の検証
- 質問マスタの検証
- タイプマスタの検証
- URLクエリや route params の検証

#### このサービスでの使いどころ

- 診断回答の構造定義
- ユーザー名入力値の検証
- `data/question-master.json` の妥当性確認
- 将来追加するタイプマスタの型安全化
- 結果ページの不正な `typeCode` や `KEY` の防止

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
- ` /diagnosis ` や ` /types/[typeCode]/[key] ` のような個別結果ページは、検索流入の主戦場にしない設計が扱いやすい

### 3.12 localStorage と共有KEY

#### 何に使うか

- 診断中の入力状態の保持
- ブラウザの戻る・進む・再読み込み時の復元
- シェアURL用の可逆な共有KEY生成

#### このサービスでの使いどころ

- ユーザー名、回答内容、現在ページを `localStorage` に保存する
- 診断完了時に、ユーザー名を含むペイロードから `KEY` を生成する
- 将来拡張で `KEY` に回答内容も含められるよう、バージョン付きの構造にする

#### 採用理由

このサービスではログインやサーバー保存を前提にしないため、診断途中の状態保持は `localStorage` が最も軽量で相性が良い。共有用の `KEY` も、強固な暗号ではなく簡易な可逆圧縮/エンコードで十分に要件を満たせる。

#### 注意点

- `localStorage` はブラウザ単位の保持であり、端末やブラウザをまたいだ復元は行えない
- `KEY` は秘匿用途ではなく、あくまで共有用の可逆文字列として扱う
- 実装時はバージョン番号をペイロードに含め、将来の回答内容追加に備える
- 具体方式は `JSON -> 可逆圧縮 -> URL安全文字列化` を基本とする

---

## 4. このサービス向けの実装方針

### 4.1 推奨ルーティング

| URL | 役割 | 推奨方針 |
| --- | --- | --- |
| `/` | サービス紹介トップ | index対象 |
| `/diagnosis` | 診断回答フロー | ユーザー名入力 + 質問回答。基本はアプリ導線用 |
| `/types/[typeCode]` | 固定の公開用タイプ詳細ページ | index対象、canonical対象 |
| `/types/[typeCode]/[key]` | 個別結果 / シェアページ | 診断完了後の遷移先。noindex推奨 |

### 4.2 なぜ共有KEY付き結果ページと公開詳細ページを分けるのか

これは今回の技術構成で最も重要な提案である。

- 診断完了後の結果画面は、ユーザー名や将来的な回答内容を含む個別データに依存する
- 一方で、SEOや検索流入は「誰でも見られる固定URL」である `/types/[typeCode]` に寄せた方が運用しやすい
- そのため、ユーザー共有用は `/types/[typeCode]/[key]`、一般公開用は `/types/[typeCode]` として役割を分けるのがよい

この分離により、以下が整理しやすくなる。

- Metadata API の管理
- `next/og` によるタイプ別OGP
- sitemap への登録
- JSON-LD の設置
- 再訪導線
- 個別結果ページの noindex / canonical 制御

### 4.3 データ配置

- `data/question-master.json`
- `data/types/<typeCode>.json`
- `lib/diagnosis.ts` — スコア計算・軸判定・同点処理
- `lib/types.ts` — TypeScript 型定義
- `lib/data.ts` — 質問マスタ・タイプマスタの読み込み
- `lib/draft-storage.ts` — localStorage による途中保存・復元
- `lib/share-key.ts` — 共有キーのエンコード・デコード
- `lib/json-ld.ts` — JSON-LD 構造化データ生成
- `lib/site.ts` — サイト定数・ユーティリティ

マスタデータは JSON ファイルで管理し、`lib/data.ts` から React の `cache` でキャッシュしながら読み込む。

### 4.4 ファイル構成

```text
app/
  layout.tsx                            ルートレイアウト
  page.tsx                              トップページ
  page.module.css                       トップページ専用スタイル
  globals.css                           デザイントークン・共通スタイル
  opengraph-image.tsx                   トップページ用 OGP 画像
  sitemap.ts                            XML サイトマップ生成
  robots.ts                             クローラ制御
  not-found.tsx                         404 ページ
  diagnosis/
    page.tsx                            診断フロー画面
  types/
    page.tsx                            16 タイプ一覧ページ
    [typeCode]/
      page.tsx                          タイプ詳細ページ（公開用）
      type-detail-page-content.tsx      タイプ詳細のコンテンツ
      opengraph-image.tsx               タイプ別 OGP 画像
      [key]/
        page.tsx                        診断結果ページ（共有キー付き）
        page.module.css                 結果ページ専用スタイル
components/
  start-diagnosis-form.tsx              ユーザー名入力・診断開始
  diagnosis-flow.tsx                    診断フロー本体
  axis-balance-bars.tsx                 4 軸バランス表示
  share-actions.tsx                     SNS シェアボタン
  type-artwork.tsx                      タイプ別アートワーク
  site-footer.tsx                       フッター
lib/
  diagnosis.ts                          診断ロジック
  types.ts                              TypeScript 型定義
  data.ts                               マスタデータ読み込み
  draft-storage.ts                      localStorage 管理
  share-key.ts                          共有キー生成・復元
  json-ld.ts                            JSON-LD 生成
  site.ts                               サイト定数
data/
  question-master.json                  32 問の質問マスタ
  types/
    TFLP.json                           各タイプの定義データ
    ...
```

### 4.5 レンダリング方針

- トップページ: Server Component 中心
- 診断画面: Client Component 中心
- 共有KEY付き結果ページ: `key` を受け取る構成を前提にしつつ、必要に応じて Client Component を併用する
- 固定のタイプ詳細ページ: Server Component 中心
- OGP画像: `next/og`

---

## 5. 提案・修正事項

### 5.1 このスタックは基本的に妥当

指定された技術スタックは、MVPの診断サービスとしてかなり相性が良い。大きな入れ替えは不要である。

### 5.2 フォーム管理について

現在は React Hook Form / Zod を使わず、`useState` と手動バリデーションで診断フローを実装している。質問数が増えたりバリデーションが複雑化した場合は、React Hook Form + Zod + `@hookform/resolvers` の導入を検討する。

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

- `Next.js + Tailwind CSS` で画面骨格を作り、共通スタイルは `globals.css` のユーティリティクラスで管理する
- 診断フォームは `useState` + `useEffect` で状態管理し、手動バリデーションで組む
- 診断中の入力状態は `localStorage` に保存する（`lib/draft-storage.ts`）
- 共有キーは Base64URL エンコードで生成する（`lib/share-key.ts`）
- シェア導線は `/types/[typeCode]/[key]` を正とし、固定詳細ページ `/types/[typeCode]` を canonical の基準にする
- SEO は Next.js 標準機能で完結させる
- アニメーションは CSS transition で対応し、必要に応じて Motion の追加を検討する

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
