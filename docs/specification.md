# マダミスタイプ診断 仕様書

## 1. 文書の位置づけ

本書は、現行ソースコードを正として整理した主仕様書である。  
`docs/` 配下の他文書は補助資料とし、本書に反する場合は実装確認を優先する。

関連文書:

- [diagnosis-logic-spec.md](./diagnosis-logic-spec.md)
- [type-design-spec.md](./type-design-spec.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- [ui-design-spec.md](./ui-design-spec.md)
- [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)
- [character-image-skill-spec.md](./character-image-skill-spec.md)
- [type-ogp-image-spec.md](./type-ogp-image-spec.md)

## 2. サービス概要

マーダーミステリーのプレイヤーが 32 問に答え、卓上での立ち回り傾向を 4 軸 16 タイプで可視化する Web サービスである。

重視している点:

- 卓上での発言・推理・感情・進行スタイルに特化した診断体験
- 診断直後に読める共有結果ページ
- 検索流入と SNS 共有を受ける公開タイプ詳細ページ
- ブラウザ内だけで完結する途中保存

## 3. 公開ルート

| ルート | 役割 | 検索エンジン向け扱い |
| --- | --- | --- |
| `/` | トップページ | index |
| `/diagnosis` | 診断フロー | `noindex` |
| `/types/[typeCode]` | 公開タイプ詳細ページ | index / canonical |
| `/types/[typeCode]/[key]` | 共有結果ページ | `noindex`、canonical は公開ページ |

補足:

- 専用の `/types` 一覧ページは未実装
- 16 タイプ一覧はトップページ内に配置している

## 4. ユーザーフロー

1. ユーザーが `/` にアクセスする
2. トップページで名前を入力し、診断を開始する
3. `/diagnosis` で 32 問を 4 ページに分けて回答する
4. 診断結果を計算し、`/types/[typeCode]/[key]` に遷移する
5. 共有結果ページで 4 軸サマリとタイプ本文を読む
6. 必要に応じて結果 URL をコピーし、SNS 共有は公開ページ `/types/[typeCode]` を使う
7. 公開タイプ詳細ページは検索流入と再訪導線の受け皿になる

## 5. 画面仕様

### 5.1 トップページ

トップページは以下を 1 ページにまとめて提供する。

- ケースファイル風のヒーローエリア
- 診断開始フォーム
- 4 軸の説明
- 注目タイプ表示
- 16 タイプ一覧
- LINE スタンプ導線
- JSON-LD `WebSite`

診断開始フォームの仕様:

- ユーザー名は 10 文字以内
- 入力値は trim したうえで共有キーと結果ページに反映する
- 既存ドラフトがある場合は「前回の続きから再開する」を表示する

LINE スタンプ導線:

- `NEXT_PUBLIC_LINE_STAMP_URL` が設定されている場合のみ外部リンクを有効化する
- 未設定時は準備中表示にする

### 5.2 診断フロー

診断フローの仕様:

- 質問数は 32 問
- 1 ページ 8 問、全 4 ページ
- 回答は 5 段階
- 各ページの 8 問すべてに回答しないと次へ進めない
- 前ページへ戻れる
- 回答進捗を表示する
- URL クエリ `?page=` と現在ページを同期する
- `localStorage` に保存した途中状態を復元する
- ユーザー名がない状態で直接 `/diagnosis` を開いた場合は、トップページへ戻す導線を表示する

保存する途中状態:

- `userName`
- `answers`
- `currentPage`
- `updatedAt`

### 5.3 公開タイプ詳細ページ

公開タイプ詳細ページ `/types/[typeCode]` は、タイプごとの固定情報を表示する。

表示内容:

- タイプ名
- タイプコード
- タグライン
- サマリー
- タイプ画像
- チビ画像があれば補助表示
- 強み
- 注意したい点
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
- 公開ページと共通の本文セクション
- 共有パネル
- 結果 URL コピー導線

検索 / canonical 方針:

- `noindex`
- canonical は `/types/[typeCode]`

共有導線の挙動:

- SNS 共有の URL は常に公開ページ `/types/[typeCode]`
- 結果 URL `/types/[typeCode]/[key]` はコピー導線でのみ扱う
- 診断完了直後に書き込んだ cookie が一致する場合、ヒーロー上部に「共有」と Google フォームへの「おすすめマダミス」ボタンを表示する
- それ以外の shared page では「自分でも診断する」を表示する

### 5.5 シェアと OGP

現行の共有仕様:

- 診断直後の URL は `/types/[typeCode]/[key]`
- SNS 共有の正規 URL は `/types/[typeCode]`
- X 共有時は `#マダミスタイプ診断` を付与する
- トップページ OGP は `/main-ogp.png`
- タイプ別 OGP は `/types/{typeCode}-ogp.png`

現行アプリは `next/og` による動的 OGP ルートを使わず、静的アセットを参照する。

### 5.6 メタデータ / サイト補助ファイル

実装済み:

- `app/layout.tsx` の `metadata` / `viewport`
- `app/manifest.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/json-ld.ts`

`NEXT_PUBLIC_SITE_URL` が未設定の場合、絶対 URL は `http://localhost:3000` を基準に生成される。

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

アプリ本体が参照する配信用アセット:

- `public/types/{typeCode}.png`
- `public/types/{typeCode}_chibi.png`
- `public/types/{typeCode}-ogp.png`

画像生成スキルの中間生成物は `output/` 配下に置き、アプリ本体はそこを参照しない。

## 7. 非機能 / 運用前提

### 7.1 パフォーマンス

- 公開ページはできる限り静的配信する
- `/`、`/diagnosis`、`/types/[typeCode]` は静的生成される
- `/types/[typeCode]/[key]` は cookie 判定のため動的ルートになる

### 7.2 保存とプライバシー

- 診断途中データはブラウザ内の `localStorage` のみ
- サーバー側に回答履歴は保存しない
- 認証機能、会員機能、DB 永続化は現行実装に含まない

### 7.3 表現方針

- MBTI を名乗らず、独自の 4 軸 16 タイプ診断として扱う
- 医学的 / 心理学的診断を装う表現は採らない

## 8. 現行実装の制約

- `/types` 一覧ページはない
- 質問マスタとタイプマスタは静的 JSON 前提で、運用画面から更新できない
- 共有キー `v3` は回答全文を持たないため、共有結果ページでは 4 軸サマリ中心の復元になる
- タイプ別 OGP の生成スキルはあるが、アプリ本体が参照する配信用 OGP アセット更新は別途反映が必要
