# マダミスタイプ診断

マーダーミステリーのプレイヤーが質問に答えることで、自分の卓上での立ち回りを 4 軸 16 タイプで可視化する Web サービスのリポジトリです。

このリポジトリには、Next.js アプリ本体、MVP 仕様書、診断ロジック、タイプマスタ、質問マスタ、キャラクター画像生成スキルが含まれています。

## 現在の状況

- 診断トップページ、診断フロー（32 問 / 4 ページ）、結果表示、タイプ詳細ページ、16 タイプ一覧ページが実装済みです。
- 診断ロジック（4 軸スコアリング・同点処理・バランス表示）は `lib/diagnosis.ts` に実装されています。
- 共有キー（ユーザー名＋回答内容を含む Base64URL エンコード）による結果ページの共有が動作します。
- `localStorage` による途中保存・復元、ブラウザの戻る/進む/再読み込みへの対応も実装済みです。
- タイプ別 OGP 画像、JSON-LD 構造化データ、sitemap、robots が設定済みです。

## MVP で目指す体験

- 診断トップページから診断を開始できる
- 32 問を 4 ページに分けて 5 段階で回答できる
- 4 軸の集計結果から 16 タイプを判定できる
- 結果画面でタイプ名、キャッチコピー、強み、注意点、相性、向いている役回りを表示できる
- タイプ別のシェア文面と OGP を用意できる

詳しい要件は [docs/specification.md](./docs/specification.md) を起点に確認してください。

## 技術構成

- Next.js 16.2.1（App Router）
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- ESLint

フォームや診断ロジックは React 標準の `useState` / `useEffect` で実装しており、外部のフォームライブラリやバリデーションライブラリは使用していません。

技術選定の経緯は [docs/tech-stack-spec.md](./docs/tech-stack-spec.md) を参照してください。

## セットアップ

Node.js 20.9 以上が前提です。

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認します。

## 利用可能なスクリプト

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## ディレクトリ構成

```text
app/                                    Next.js App Router の実装
  layout.tsx                            ルートレイアウト（Noto Sans JP / Shippori Mincho B1）
  page.tsx                              トップページ（診断開始フォーム・注目タイプ・一覧）
  globals.css                           デザイントークン・共通スタイル
  opengraph-image.tsx                   トップページ用 OGP 画像
  sitemap.ts / robots.ts               SEO 用メタデータファイル
  not-found.tsx                         404 ページ
  diagnosis/page.tsx                    診断フロー画面
  types/page.tsx                        16 タイプ一覧ページ
  types/[typeCode]/page.tsx             タイプ詳細ページ（公開用）
  types/[typeCode]/opengraph-image.tsx  タイプ別 OGP 画像
  types/[typeCode]/[key]/page.tsx       診断結果ページ（共有キー付き）
components/                             React コンポーネント
  start-diagnosis-form.tsx              ユーザー名入力・診断開始フォーム
  diagnosis-flow.tsx                    診断フロー本体（8 問 × 4 ページ）
  axis-balance-bars.tsx                 4 軸バランス表示
  share-actions.tsx                     SNS シェアボタン
  type-artwork.tsx                      タイプ別キャラクターアートワーク
  site-footer.tsx                       フッター
lib/                                    ビジネスロジック・ユーティリティ
  diagnosis.ts                          診断ロジック（スコア計算・軸判定・同点処理）
  types.ts                              TypeScript 型定義
  data.ts                               質問マスタ・タイプマスタの読み込み
  draft-storage.ts                      localStorage による途中保存・復元
  share-key.ts                          共有キーのエンコード・デコード
  json-ld.ts                            JSON-LD 構造化データ生成
  site.ts                               サイト定数・ユーティリティ
data/question-master.json               32 問の質問マスタ
data/types/*.json                       16 タイプの定義データ
public/types/                           公開用のタイプ画像置き場
output/character-images/                画像生成の出力先
skills/madamistype-character-images/    タイプ画像一括生成スキル
docs/                                   仕様書・設計書
```

## まず読むドキュメント

- [docs/specification.md](./docs/specification.md)
  サービス全体の目的、スコープ、機能要件、MVP 範囲
- [docs/diagnosis-logic-spec.md](./docs/diagnosis-logic-spec.md)
  32 問の配分、5 段階回答のスコアリング、16 タイプへの変換ルール
- [docs/type-design-spec.md](./docs/type-design-spec.md)
  16 タイプの正式名称、コード規則、表示方針
- [docs/ui-design-spec.md](./docs/ui-design-spec.md)
  UI トーン、色、タイポグラフィ、画面別ルール
- [docs/tech-stack-spec.md](./docs/tech-stack-spec.md)
  技術選定、推奨構成、実装方針
- [docs/character-image-skill-spec.md](./docs/character-image-skill-spec.md)
  キャラクター画像生成スキルの要件と出力仕様

## データの見方

### 質問マスタ

`data/question-master.json` には以下が定義されています。

- 32 問
- 4 軸 × 各 8 問
- `forward` / `reverse` の方向
- 表示順、ページ番号、重み、同点時の優先度
- メタ情報（`title`, `version`, `questionCount`, `pageCount`, `questionsPerPage`, `axisOrder`）

### タイプマスタ

`data/types/*.json` には以下が入っています。

- `typeId` / `typeCode` / `typeName`
- キャッチコピー（`tagline`）、概要（`summary`）、詳細説明（`detailDescription`）
- 強み（`strengths`）、注意点（`cautions`）、推奨立ち回り（`recommendedPlaystyle`）、向いている役回り（`suitableRoles`）
- 相性情報（`compatibility`: `summary`, `goodWithTypeCodes`, `goodWithDescription`）
- シェア文面（`shareText`）
- 軸情報（`axis`: `{ axis1, axis2, axis3, axis4 }` のネストオブジェクト）
- ビジュアル設定（`visualProfile`: `genderPresentation`, `ageRange`, `characterArchetype`, `characterDescription`, `outfitDescription`, `colorPalette`, `pose`, `expression`, `background`）
- 画像生成プロンプト（`imagePrompt` / `negativePrompt`: それぞれ `{ ja, en }` の多言語ペア）

## キャラクター画像生成

タイプ画像の一括生成は `skills/madamistype-character-images/` のスキルと Python スクリプトで行います。

### 事前準備

1. `.env.character-images.example` をコピーして `.env.character-images` を作成する
2. `NANOBANANA_API_KEY` を設定する
3. 背景透過 PNG まで作る場合は `opencv-python` と `numpy` を入れる

### 実行例

```bash
python skills/madamistype-character-images/scripts/generate_character_batch.py --all
python skills/madamistype-character-images/scripts/generate_character_batch.py --types OFEI,TRLP
python skills/madamistype-character-images/scripts/generate_character_batch.py --all --with-transparent
```

出力先はデフォルトで `output/character-images/` です。

詳しいルールは [skills/madamistype-character-images/SKILL.md](./skills/madamistype-character-images/SKILL.md) と [docs/character-image-skill-spec.md](./docs/character-image-skill-spec.md) を参照してください。

## 開発時の前提

- Next.js 関連の変更を行う前に、`node_modules/next/dist/docs/` の該当ガイドを読む
- 挙動や画面を変える前に、`docs/` の要件定義と補助仕様を確認する
- 特に最初は [docs/specification.md](./docs/specification.md) を起点に、必要に応じて診断ロジック・UI・技術設計の文書へ進む
