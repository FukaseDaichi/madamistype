# マダミスタイプ診断

マーダーミステリーのプレイヤーが質問に答えることで、自分の卓上での立ち回りを 4 軸 16 タイプで可視化する Web サービスのリポジトリです。

このリポジトリには、Next.js アプリの土台だけでなく、MVP 仕様書、診断ロジック、タイプマスタ、質問マスタ、キャラクター画像生成スキルが含まれています。

## 現在の状況

- `docs/` と `data/` の整備が先行しており、仕様とマスターデータはかなり具体化されています。
- フロントエンド本体はまだ初期段階で、`app/page.tsx` は create-next-app の初期画面のままです。
- そのため、この README では「このプロジェクトが目指しているもの」と「今リポジトリに入っているもの」を分けて把握できるようにしています。

## MVP で目指す体験

- 診断トップページから診断を開始できる
- 32 問を 4 ページに分けて 5 段階で回答できる
- 4 軸の集計結果から 16 タイプを判定できる
- 結果画面でタイプ名、キャッチコピー、強み、注意点、相性、向いている役回りを表示できる
- タイプ別のシェア文面と OGP を用意できる

詳しい要件は [docs/specification.md](./docs/specification.md) を起点に確認してください。

## 技術構成

### 現在導入済み

- Next.js 16.2.1（App Router）
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- ESLint

### 設計上の採用候補

- shadcn/ui
- Motion
- React Hook Form
- Zod
- Next.js Metadata API
- `next/og`
- Vercel

採用理由や実装方針は [docs/tech-stack-spec.md](./docs/tech-stack-spec.md) を参照してください。

## セットアップ

Next.js 16 のローカル docs では、Node.js 20.9 以上が前提です。

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認します。

現時点では診断画面は未実装のため、表示されるのは初期テンプレート画面です。

## 利用可能なスクリプト

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## ディレクトリ構成

```text
app/                                    Next.js App Router の実装置き場
data/question-master.json               32 問の質問マスタ
data/types/*.json                       16 タイプの定義データ
docs/                                   仕様書・設計書
public/types/                           公開用のタイプ画像置き場
output/character-images/                画像生成の出力先
skills/madamistype-character-images/    タイプ画像一括生成スキル
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

### タイプマスタ

`data/types/*.json` には以下が入っています。

- タイプコードとタイプ名称
- キャッチコピー、概要、詳細説明
- 強み、注意点、向いている役回り
- 相性情報
- 画像生成用のビジュアル設定とプロンプト

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

このプロジェクトは仕様書先行で進んでいるため、実装だけを見て判断すると意図を取り違えやすい構成です。変更前に `docs/` を確認する前提で進めてください。
