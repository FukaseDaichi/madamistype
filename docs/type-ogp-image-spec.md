# タイプ別OGP一括生成 Codex Skill 仕様・設計書

## 1. 文書の目的

本書は、`data/types/*.json` と既存の chibi 素材をもとに、各タイプの X 向け OGP 画像を
**API 経由で一括生成する Codex Skill** の仕様、設計方針、実装タスクを整理するための文書である。

初期スコープでは以下を対象とする。

- 各タイプごとの OGP ベースビジュアルの生成
- 各タイプごとの最終 OGP 画像の書き出し
- 候補案の複数生成、採用案の保存
- バッチ実行、再実行、生成ログ保存

今回の重要な前提は以下とする。

- OGP は `1200 x 630px`
- 用途は X の `summary_large_image`
- 既存 `public/types/{typeCode}_chibi.png` は完成素材ではなく、**参照画像**として使う
- 各 chibi は API で **よりダイナミックなポーズに再生成**する
- `typeName` と `typeCode` は API 生成画像の中にデザインとして含める
- ローカル後処理は右下の小さな `マダミスタイプ診断` 表記だけに限定する

本書は、主仕様書である [specification.md](./specification.md) に付随する制作・運用系の補助仕様書である。
ユーザー向け MVP 要件を上書きするものではなく、タイプ別 OGP 制作の実行方式を定める。

参照文書:

- [specification.md](./specification.md)
- [type-design-spec.md](./type-design-spec.md)
- [ui-design-spec.md](./ui-design-spec.md)
- [character-image-skill-spec.md](./character-image-skill-spec.md)

## 2. 前提と現状整理

### 2.1 OGP 要件の現状

2026年3月27日時点で、X 向け OGP 制作の前提は以下とする。

- 画像サイズは `1200 x 630px`
- X では `summary_large_image` 前提で設計する
- 最終画像は `5MB` 未満を目標とする
- タイムラインで最初に見えるのは本文より画像なので、視認性は `typeName` とキャラの強さが優先される

### 2.2 入力データの現状

`data/types/` 配下に 16 件のタイプ JSON が存在し、少なくとも以下が揃っている。

- `typeCode`
- `typeName`
- `visualProfile`
- `imagePrompt`
- `negativePrompt`
- `shareText`

また `public/types/` 配下には、各タイプの既存 chibi 画像が存在する。

- `public/types/{typeCode}_chibi.png`

このため、OGP 生成スキルでは新たなマスタを持たず、以下を唯一の入力ソースとして扱う。

- タイプ定義: `data/types/*.json`
- 参照 chibi: `public/types/*_chibi.png`

### 2.3 既存方式の課題

固定テンプレートへ既存 chibi を貼り込むだけの方式には、以下の課題がある。

- 全タイプが同じ立ち姿に見えやすい
- キャラの運動感が弱く、シェア画像として止まりにくい
- 「そのタイプの瞬間」を感じる絵になりにくい
- 既存 chibi の可愛さはあるが、OGP の主役としては静的すぎる

したがって本スキルでは、
**既存 chibi を anchor にして API で OGP 向けポーズ差分を再生成する**
方針を採る。

## 3. スキルのゴール

### 3.1 主要ゴール

- 16 タイプの OGP ベースビジュアルを一括生成できること
- 各タイプで「同一人物性を保ったまま、より動きのある chibi」を作れること
- 基本は 1 案で低コストに生成し、必要時のみ複数候補を出せること
- 最終 OGP を `1200 x 630px` で書き出せること
- 後続の X シェア、OGP 差し替え、季節バリエーション制作に再利用できること

### 3.2 非ゴール

初期版では以下は対象外とする。

- request-time のリアルタイム OGP 生成
- 複数 SNS 向けの同時量産
- 自動採点だけでの完全無人選定

## 4. 想定スキル名と役割

暫定スキル名は `madamistype-type-ogp-images` とする。

このスキルは、Codex が以下のような依頼を受けたときに使う想定とする。

- タイプごとの OGP をまとめて生成したい
- chibi をベースに、もっと動きのある X 用 OGP を量産したい
- API を使ってタイプ別シェア画像を再制作したい
- 既存 OGP を static template から作り直したい

## 5. 要求仕様

### 5.1 機能要件

- `data/types/*.json` を自動検出して処理対象を決定できること
- 特定の `typeCode` のみを対象に絞って実行できること
- 各タイプについて OGP 候補を `1案` を基本として生成できること
- 必要に応じて複数候補へ増やせること
- 各候補について prompt / request / 生成結果を保存できること
- 採用したベースビジュアルから最終 OGP を合成できること
- API リクエスト、レスポンス、保存先、採用結果をメタデータとして残せること
- スキップ、上書き、リトライを制御できること
- バッチ全体の成功件数と失敗件数をレポートできること

### 5.2 非機能要件

- 同一設定で再実行しても出力場所が安定すること
- 途中失敗しても再開しやすいこと
- API コストと採用率を把握しやすいこと
- 同一人物性の維持とポーズの差分が両立できること
- `typeName` と `typeCode` の可読性と綴りが API 出力で破綻しにくいこと

## 6. 外部 API 前提

### 6.1 採用方針

画像生成 API は **NanoBanana API** を利用する。

2026年3月27日時点で確認した資料では、以下を前提にできる。

- `POST /api/v1/nanobanana/generate-2`
- `GET /api/v1/nanobanana/record-info?taskId=...`
- `imageUrls` による参照画像指定
- `resultImageUrl` からの成果物取得

したがって本書では以下のように扱う。

- チーム内呼称: NanoBanana
- API ベース URL: `https://api.nanobananaapi.ai`

### 6.2 API 連携上の重要な設計判断

- 主生成は `generate-2` を利用する
- 参照画像には `public/types/{typeCode}_chibi.png` に対応する公開 URL を使う
- `imageUrls` には 1 枚だけ参照 chibi を渡し、同一人物性を保つ
- `typeName` と `typeCode` はモデルに画像内テキストとして描かせる
- ローカル処理では右下の小さな `マダミスタイプ診断` 表記だけを追加する
- OGP は request-time 生成ではなく、**事前生成アセット**として保存する

### 6.3 参照付き `generate-2` を優先する理由

- 既存 chibi の顔、髪型、服装、小物を維持しやすい
- 別人化の事故を減らせる
- NanoBanana 側でも参照画像 URL を使う方が同一人物性を保ちやすい
- 「同じキャラのままポーズだけ変える」という今回の目的に合う

### 6.4 prompt-only fallback を使う場面

以下の場合のみ参照画像なしで実行する。

- 参照 chibi が存在しない
- 公開参照 URL を一時的に利用できない
- 背景込みの OGP ベースアートだけを別系統で試したい

基本方針としては、v1 では `edit` を正道とする。

## 7. 出力仕様

### 7.1 出力先

初期版では以下の出力構成を推奨する。

```text
output/type-ogp/
  batch-report.json
  OFEI/
    reference/
      chibi.png
    candidates/
      prompt-01.txt
      prompt-02.txt
      prompt-03.txt
      request-01.json
      request-02.json
      request-03.json
      candidate-01.png
      candidate-02.png
      candidate-03.png
    selected/
      hero.png
      selection-note.txt
    final/
      ogp.png
      meta.json
  ...
public/types/
  OFEI-ogp.png
  ...
```

### 7.2 ファイルの役割

- `reference/chibi.png`: 元の参照 chibi
- `prompt-*.txt`: 実際に送った最終 prompt
- `request-*.json`: API 送信 payload
- `candidate-*.png`: API が返した候補画像
- `selected/hero.png`: 採用した主役ビジュアル
- `selection-note.txt`: 採用理由の簡易メモ
- `final/ogp.png`: 最終 OGP
- `meta.json`: タイプ情報、採用候補、使用設定、保存先、エラー情報
- `batch-report.json`: バッチ単位の総括

## 8. 画像仕様

### 8.1 最終 OGP 画像

最終出力の仕様は以下とする。

- サイズ: `1200 x 630px`
- 形式: PNG
- 用途: X の `summary_large_image`
- 文字: API 生成画像内の `typeName` と `typeCode`、およびローカル追加の小さな `マダミスタイプ診断`

### 8.2 API 生成ベース画像

API から直接作るのは、
**タイプ名とタイプコードを含んだ、ほぼ完成形の OGP ビジュアル**とする。

推奨仕様:

- サイズ: landscape で十分広いもの
- キャラは 1 人のみ
- `typeName` と `typeCode` を含む
- ロゴなし
- watermark なし
- 右下に小さなサービス名を後から載せる余地を残す

### 8.3 OGP 向け構図ルール

API 生成ベース画像には、以下を必須ルールとして与える。

- 主役キャラは大きく
- 直立正面ポーズは禁止
- 画面に斜め方向の流れを作る
- `typeName` と `typeCode` を片側に統合して配置する
- 背景情報は多すぎず、文字の可読性を邪魔しない
- 右下には小さなサービス名が載るだけの余白を残す

### 8.4 既存 chibi から維持すべき要素

- 顔立ち
- 髪型
- 服装
- 主要小物
- 主要配色
- キャラクターの印象

## 9. プロンプト設計

### 9.1 基本方針

プロンプトは以下の 4 層で再構成する。

1. タイプ固有の identity 情報
2. OGP 向けの構図情報
3. 画像内に入れる文字情報
4. 今回だけ変えるポーズ / アクション情報
5. 出力品質ルール

### 9.2 タイプ固有情報

タイプ JSON から以下を優先利用する。

- `typeName`
- `visualProfile.genderPresentation`
- `visualProfile.ageRange`
- `visualProfile.characterArchetype`
- `visualProfile.characterDescription`
- `visualProfile.outfitDescription`
- `visualProfile.colorPalette`
- `visualProfile.pose`
- `visualProfile.expression`

`imagePrompt` は補助材料として扱い、カード用途や静的立ち絵向けの記述はそのまま使わない。

### 9.3 OGP 共通の固定条件

毎回必ず入れる条件:

- same character identity as the reference chibi
- preserve face, hairstyle, outfit, props, and core color palette
- single character only
- dynamic pose
- render the exact `typeName`
- render the exact `typeCode`
- keep the spelling exact
- no logo
- no watermark
- clean silhouette
- keep a small clean bottom-right safe area for the local service label
- suitable for X OGP visual

### 9.4 ポーズ設計ルール

各タイプの再生成ポーズには、以下を必須ルールとして課す。

- 正面直立は禁止
- 左右対称ポーズは禁止
- 体幹のひねり、手の動き、視線の流れのいずれかを必ず入れる
- そのタイプらしい小物アクションを入れる
- 「今まさに動いている瞬間」を作る

### 9.5 ポーズ案の作り方

1タイプにつき、少なくとも以下の異なる方向性で複数案を出す。

- `action-forward`: 前へ踏み込む
- `reaction-side`: 横方向へ反応する
- `secretive-turn`: 振り返りや横目を使う
- `prop-led`: 小物が主導する

例: `OFEI / 潜入記者`

- 手帳を掲げながら一歩踏み込む
- 身体を半分ひねり、後方を確認しながら視線だけこちらへ返す
- カメラとメモ帳を使って「情報を回収している瞬間」を作る

### 9.6 ネガティブ条件

各 JSON の `negativePrompt` をベースにしつつ、OGP 向けの共通禁止事項を加える。

- multiple characters
- static standing pose
- symmetrical pose
- extra text beyond the exact requested title and type code
- wrong spelling in the requested title or type code
- logo
- watermark
- cluttered background
- tiny character
- unreadable silhouette
- redesigned outfit
- missing props

## 10. 生成フロー設計

### 10.1 標準フロー

1. 対象タイプ JSON を読み込む
2. 参照 chibi を読む
3. タイプ情報から OGP 用 prompt を組み立てる
4. ポーズ差分 prompt を基本 `1案`、必要時のみ複数案で生成する
5. NanoBanana `generate-2` を順次実行し、task polling を行う
6. 生成候補を保存する
7. 候補から採用案を 1 枚選ぶ
8. 採用案に対して右下ブランド表記のみの最終 OGP 合成を行う
9. `public/types/{typeCode}-ogp.png` へ保存する
10. メタデータとバッチレポートを更新する

### 10.2 採用選定ルール

最低限、以下を満たす案を採用候補とする。

- 既存 chibi と同一人物に見える
- 動きがある
- `typeName` と `typeCode` の文字が読める
- 背景がうるさすぎない
- 小物や服装が崩れていない

### 10.3 最終合成の役割

最終 OGP 合成では、以下のみをローカルで決定論的に行う。

- `1200 x 630` へのリサイズ / トリミング
- 右下の小さな `マダミスタイプ診断` 表記

この分離が必要な理由:

- ブランド名だけはローカル固定にしてシリーズ感を揃えたい
- API 生成結果の主要デザインを極力そのまま使いたい

## 11. スクリプト設計

### 11.1 採用言語

初期版スクリプトは Python を前提とする。

理由:

- JSON 処理が容易
- NanoBanana API クライアント実装が容易
- バッチ実行、ファイル整理、ログ保存が容易
- OGP 合成処理も Python で閉じやすい

### 11.2 想定スクリプト構成

```text
skills/madamistype-type-ogp-images/
  SKILL.md
  agents/
    openai.yaml
  scripts/
    generate_type_ogp_batch.py
    ogp_prompt_builder.py
    nanobanana_client.py
    candidate_selector.py
    ogp_compositor.py
    write_manifest.py
  references/
    io-schema.md
    prompt-rules.md
    nanobanana-notes.md
    ogp-layout-rules.md
```

### 11.3 スクリプト責務

- `generate_type_ogp_batch.py`: CLI エントリ、全体オーケストレーション
- `ogp_prompt_builder.py`: JSON と参照 chibi から OGP 用 prompt を構築
- `nanobanana_client.py`: NanoBanana API の呼び出し、polling、画像ダウンロード
- `candidate_selector.py`: 候補管理と採用処理
- `ogp_compositor.py`: 右下ブランド表記と最終 OGP 合成
- `write_manifest.py`: 実行結果の集約

## 12. CLI / 実行インターフェース案

### 12.1 最低限の実行例

```bash
python skills/madamistype-type-ogp-images/scripts/generate_type_ogp_batch.py --all
python skills/madamistype-type-ogp-images/scripts/generate_type_ogp_batch.py --types OFEI,TRLP
python skills/madamistype-type-ogp-images/scripts/generate_type_ogp_batch.py --all --overwrite
python skills/madamistype-type-ogp-images/scripts/generate_type_ogp_batch.py --retry-failed
python skills/madamistype-type-ogp-images/scripts/generate_type_ogp_batch.py --all --candidates 3
```

### 12.2 主な引数案

- `--all`
- `--types`
- `--overwrite`
- `--retry-failed`
- `--output-dir`
- `--candidates`
- `--aspect-ratio`
- `--resolution`
- `--reference-url-base`
- `--dry-run`
- `--publish`

### 12.3 環境変数案

- `NANOBANANA_API_KEY`
- `NANOBANANA_API_BASE`（必要時のみ）
- `NANOBANANA_REFERENCE_BASE_URL`（必要時のみ）

repo ルートに `.env.character-images` を置いて設定できるようにする。

## 13. 品質担保

### 13.1 自動検証

- JSON 必須項目が揃っているか
- 参照 chibi が存在するか
- 候補画像が所定パスに保存されているか
- 最終 OGP が `1200 x 630` か
- 最終 OGP が `5MB` 未満か
- 実行レポートに成功可否が記録されているか

### 13.2 目視確認

最低限、各バッチで以下を人間が確認する。

- 元 chibi と同一人物に見えるか
- 動きが十分にあるか
- `typeName` が読めるか
- 文字置き場が潰れていないか
- 背景やエフェクトがうるさすぎないか
- 全 16 タイプを並べても単調に見えないか

## 14. 将来拡張を見据えた設計方針

### 14.1 今の時点で先に揃えておくべきもの

- タイプごとの identity 固定ルール
- ポーズ差分テンプレート群
- 文字入れ後処理
- 候補保存と採用ログ

### 14.2 将来追加する機能

- 季節イベント版 OGP
- キャンペーン別 OGP
- LINE / Instagram / note 向けの派生比率生成
- 採用候補の半自動スコアリング

### 14.3 拡張上の注意

シーズン差分やキャンペーン差分を増やす場合でも、
キャラ同一性が崩れるとシリーズ資産にならない。

そのため、初期版から以下を守る。

- 参照 chibi を毎回使う
- 不変条件を毎回 prompt に明記する
- 参照付き `generate-2` 優先の運用を崩さない

## 15. 実装タスク一覧

### 15.1 フェーズ 0: 仕様確定

- スキル名を確定する
- 出力先ディレクトリを確定する
- OGP 合成方式を確定する
- API 候補数の既定値を確定する
- 採用フローを半自動にするか手動にするか決める

### 15.2 フェーズ 1: スキルひな型作成

- `init_skill.py` でスキルひな型を生成する
- `SKILL.md` の frontmatter を作る
- `agents/openai.yaml` を生成する
- `scripts/` と `references/` を作る

### 15.3 フェーズ 2: 参照資料整備

- 入力 JSON の簡易スキーマを文書化する
- OGP 用 prompt 再構成ルールを文書化する
- NanoBanana API の利用メモを文書化する
- OGP タイトル安全領域ルールを文書化する

### 15.4 フェーズ 3: スクリプト実装

- JSON ローダーを作る
- prompt ビルダーを作る
- NanoBanana API クライアントを作る
- 候補保存処理を作る
- 採用選定処理を作る
- OGP 合成処理を作る
- 出力メタデータ作成処理を作る
- バッチレポート作成処理を作る

### 15.5 フェーズ 4: 検証

- 1 タイプだけで疎通確認する
- ポーズ差分の品質を確認する
- 同一人物性を確認する
- `typeName` / `typeCode` の綴りと可読性を確認する
- 16 タイプ全件バッチを実行する

### 15.6 フェーズ 5: 改善

- 崩れやすいタイプの prompt を調整する
- 候補数と採用率のバランスを調整する
- OGP 合成の見た目を微調整する
- 派生フォーマット向けの設計を追加する

## 16. 受け入れ条件

- 1 回の実行で 16 タイプ分の候補生成と最終 OGP 書き出しを処理できること
- 各タイプで `public/types/{typeCode}-ogp.png` が生成されること
- 最終 OGP が `1200 x 630` であること
- 各 OGP で `typeName` と `typeCode` が読めること
- API 候補が保存され、採用理由が追跡できること
- 失敗時に原因が `meta.json` または `batch-report.json` に残ること
- 再実行時に不要な再生成を避けられること

## 17. 現時点の判断まとめ

- 入力ソースは `data/types/*.json` と `public/types/*_chibi.png` を正とする
- OGP は static template 貼り込みではなく API 生成をベースにする
- 既存 chibi は完成画像ではなく参照 anchor として使う
- 画像生成 API は NanoBanana API を前提にする
- 初期版は参照付き `generate-2` を標準とする
- `typeName` と `typeCode` は API 生成画像に含める
- ローカル後処理は右下の `マダミスタイプ診断` に限定する
- OGP は request-time 生成ではなく事前生成アセットとして運用する

## 18. 参考リンク

- [NanoBanana API Docs Home](https://docs.nanobananaapi.ai/cn)
- [NanoBanana Generate Image 2](https://docs.nanobananaapi.ai/cn/nanobanana-api/generate-image-2)
- [NanoBanana Get Task Details](https://docs.nanobananaapi.ai/cn/nanobanana-api/get-task-details)
- [Next.js: Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js: opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
