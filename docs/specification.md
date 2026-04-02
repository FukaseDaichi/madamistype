# マダミスタイプ診断 仕様書

## 1. 文書の位置づけ

本書は、2026-03-30 時点の現行ソースコードを正として整理した主仕様書である。
`docs/` 配下の他文書は本書の補助資料とし、本書に反する場合は実装確認のうえで本書を優先する。

関連文書:

- [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- [type-design-spec.md](./type-design-spec.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- [ui-design-spec.md](./ui-design-spec.md)
- [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)
- [character-image-skill-spec.md](./character-image-skill-spec.md)
- [type-ogp-image-spec.md](./type-ogp-image-spec.md)

## 2. サービス概要

マーダーミステリーのプレイヤーが 32 問の質問に答え、自身の卓上での立ち回り傾向を 4 軸 16 タイプで可視化する Web サービスである。

本サービスは次を重視する。

- 卓上での振る舞いに特化した診断体験
- 診断後すぐ読めるタイプ詳細ページ
- SNS 共有しやすい公開 URL と OGP
- ブラウザ内だけで完結する途中保存

## 3. 公開ルート

| ルート | 役割 | 検索エンジン向け扱い |
| --- | --- | --- |
| `/` | トップページ | index 対象 |
| `/diagnosis` | 診断フロー | `noindex` |
| `/types/[typeCode]` | 公開タイプ詳細ページ | index / canonical 対象 |
| `/types/[typeCode]/[key]` | 共有結果ページ | `noindex`、canonical は公開詳細ページ |

補足:

- 専用の `/types` 一覧ページは現行実装には存在しない
- 16 タイプ一覧はトップページ内に表示する

## 4. ユーザーフロー

1. ユーザーが `/` にアクセスする
2. トップページでユーザー名を入力し、診断を開始する
3. `/diagnosis` で 32 問を 4 ページに分けて回答する
4. 診断結果を計算し、`/types/[typeCode]/[key]` に遷移する
5. 共有結果ページからタイプ詳細を読む、結果 URL をコピーする、または公開詳細ページを SNS 共有する
6. 公開詳細ページ `/types/[typeCode]` を再訪導線・検索流入の受け皿にする

## 5. 機能仕様

### 5.1 トップページ

トップページは以下を 1 ページで提供する。

- ケースファイル風のヒーローエリア
- 診断開始フォーム
- 注目タイプ表示
- 16 タイプ一覧
- LINE スタンプ導線
- JSON-LD `WebSite`

診断開始フォームの仕様:

- ユーザー名は 10 文字以内
- 入力したユーザー名は結果ページと共有キーに反映される
- 既存ドラフトのユーザー名が残っている場合は「前回の続きから再開する」を表示する

LINE スタンプ導線:

- `NEXT_PUBLIC_LINE_STAMP_URL` が設定されている場合のみ有効化する
- 未設定時は準備中表示にする

### 5.2 診断フロー

診断フローの仕様:

- 質問数は 32 問
- 1 ページ 8 問、全 4 ページ
- 5 段階回答
- 各ページの 8 問すべてに回答しないと次へ進めない
- 前ページへ戻れる
- 進捗表示を行う
- URL クエリ `?page=` で現在ページを同期する
- `localStorage` に保存した途中状態を復元する
- ユーザー名がない状態で直接 `/diagnosis` を開いた場合は、トップページへ戻す導線を出す

保存する途中状態:

- `userName`
- `answers`
- `currentPage`
- `updatedAt`

### 5.3 タイプ詳細ページ

公開タイプ詳細ページ `/types/[typeCode]` は、タイプごとの固定情報を表示する。

表示内容:

- タイプ名
- タイプコード
- タグライン
- 概要
- タイプ別アートワーク
- 強み
- 注意点
- 詳しい見立て
- 向いている立ち回り
- 向いている役回り
- 相性の傾向
- 「自分でも診断する」導線
- JSON-LD `WebPage`

SEO / シェア方針:

- index 対象
- canonical は自分自身
- OGP は `public/types/{typeCode}-ogp.png`

### 5.4 共有結果ページ

共有結果ページ `/types/[typeCode]/[key]` は、診断直後の着地先であり、ユーザー固有要素を含む。

表示内容:

- 共有ユーザー名
- タイプ名 / タイプコード / タグライン
- 4 軸サマリ
- 公開詳細ページと共通の本文セクション
- 結果 URL コピー導線

検索 / canonical 方針:

- `noindex`
- canonical は `/types/[typeCode]`

共有導線の挙動:

- SNS 共有は公開詳細ページ `/types/[typeCode]` を使う
- 共有結果 URL はコピー導線でのみ扱う

### 5.5 シェアと OGP

現行の共有仕様は次の通り。

- 診断直後の URL は `/types/[typeCode]/[key]`
- SNS 共有 URL は `/types/[typeCode]`
- X 共有時は `#マダミスタイプ診断` を付与する
- トップページ OGP は `/main-ogp.png`
- タイプ別 OGP は `/types/{typeCode}-ogp.png`

現行実装では、`next/og` を使った動的 OGP ルートは採用していない。

### 5.6 メタデータ / サイト補助ファイル

実装済み:

- `app/layout.tsx` の `metadata` / `viewport`
- `app/manifest.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/json-ld.ts`

`NEXT_PUBLIC_SITE_URL` が設定されていない場合、絶対 URL は `http://localhost:3000` を基準に生成される。

## 6. データ仕様

### 6.1 質問マスタ

`data/question-master.json` に保持する。

主な項目:

- `meta.title`
- `meta.version`
- `meta.questionCount`
- `meta.pageCount`
- `meta.questionsPerPage`
- `meta.axisOrder`
- `questions[].questionId`
- `questions[].questionText`
- `questions[].axis`
- `questions[].direction`
- `questions[].displayOrder`
- `questions[].pageNo`
- `questions[].weight`
- `questions[].isActive`
- `questions[].tieBreakerPriority`

### 6.2 タイプマスタ

`data/types/*.json` に 16 件保持する。

主な項目:

- `typeId`
- `typeCode`
- `typeName`
- `tagline`
- `summary`
- `detailDescription`
- `strengths`
- `cautions`
- `recommendedPlaystyle`
- `suitableRoles`
- `compatibility`
- `shareText`
- `axis`
- `visualProfile`
- `imagePrompt`
- `negativePrompt`

### 6.3 共有キー

共有キーの詳細は [diagnosis-logic-spec.md](./diagnosis-logic-spec.md) を参照する。
現行は `v3` のみを扱い、ユーザー名と 4 軸トレンド状態をコンパクトに保持する。

### 6.4 画像アセット

`public/types/` に以下を保持する。

- `{typeCode}.png`
- `{typeCode}_chibi.png`
- `{typeCode}-ogp.png`

## 7. 非機能 / 運用前提

### 7.1 パフォーマンス

- 公開ページはできる限り静的配信する
- `npm run build` 時点では `/`、`/diagnosis`、`/types/[typeCode]` が静的出力される
- `/types/[typeCode]/[key]` は動的ルートとして扱う

### 7.2 保存とプライバシー

- 診断途中データはブラウザ内の `localStorage` のみ
- サーバー側に回答履歴を保存しない
- 認証機能、会員機能、DB 永続化は現行実装に含まない

### 7.3 法務・表現方針

- MBTI そのものを名乗らず、独自の 4 軸 16 タイプ診断として扱う
- 医学的 / 心理学的診断を装う表現は避ける

## 8. 現行実装の制約

- `/types` 一覧ページは未実装
- 診断ロジックは静的マスタ前提で、運用画面から更新できない
- 共有キー `v3` は回答全文を持たないため、共有結果ページでは軸サマリ中心の復元になる
- 画像生成スキルはアプリ本体とは別運用で、実行に外部 API キーが必要

## 9. 補助文書の使い分け

- 診断ロジックの詳細: [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- タイプ定義: [type-design-spec.md](./type-design-spec.md)
- 技術構成 / SEO / ルーティング: [tech-stack-spec.md](./tech-stack-spec.md)
- UI / 表現ルール: [ui-design-spec.md](./ui-design-spec.md)
- ディレクトリ構成: [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)
- 既知の実装課題: [current-source-issues.md](./current-source-issues.md)
