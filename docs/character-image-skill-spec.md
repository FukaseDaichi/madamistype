# キャラクター画像一括生成 Codex Skill 仕様・設計書

## 1. 文書の目的

本書は、`data/types/*.json` に定義された16タイプのキャラクターデータをもとに、各タイプの通常キャラクター画像とチビキャラ画像を一括生成する Codex Skill の仕様、設計方針、実装タスクを整理するための文書である。

初期スコープでは以下を対象とする。

- 各タイプごとの通常キャラクター画像の生成
- 各タイプごとのチビキャラ画像の生成
- オプションで背景透過 PNG の生成
- バッチ実行、再実行、生成ログ保存

将来拡張として、LINE スタンプ生成を見据えた設計上の余白も含める。

## 2. 前提と現状整理

### 2.1 入力データの現状

2026-03-23 時点で、`data/types/` 配下に 16 件のタイプ JSON が存在する。

各 JSON には少なくとも以下が揃っている。

- `typeCode`
- `typeName`
- `visualProfile`
- `imagePrompt`
- `negativePrompt`
- `shareText`

このため、スキル側で新しいマスタを持たず、既存タイプ JSON を唯一の入力ソースとして扱う方針が妥当である。

### 2.2 既存プロンプトの注意点

既存の `imagePrompt` は結果カード向けイラスト前提になっており、実際に以下の傾向がある。

- 背景ありの前提が入っている
- 上半身構図の指定が入っている
- 結果カード用途の文脈が含まれている

したがって、本スキルでは `imagePrompt` をそのまま API に送るのではなく、透過素材向けの構図と出力要件に合わせて再構成する必要がある。

## 3. スキルのゴール

### 3.1 主要ゴール

- 16 タイプの通常キャラクター画像を一括生成できること
- 16 タイプのチビキャラ画像を一括生成できること
- 必要な場合のみ背景透過 PNG を生成できること
- 失敗したタイプのみ再実行できること
- 後続の SNS 画像生成や LINE スタンプ生成に再利用できること

### 3.2 非ゴール

初期版では以下は対象外とする。

- 表情差分の大量生成
- セリフ入りスタンプの自動組版
- LINE 申請用パッケージの最終書き出し
- 完全自動の品質審査

## 4. 想定スキル名と役割

暫定スキル名は `madamistype-character-images` とする。

このスキルは、Codex が以下のような依頼を受けたときに使う想定とする。

- タイプごとのキャラ画像をまとめて生成したい
- `data/types` をもとにイメージ画像を一括生成したい
- チビキャラ化した透過 PNG をまとめて作りたい
- スタンプ素材用のベースキャラを作りたい

## 5. 要求仕様

### 5.1 機能要件

- `data/types/*.json` を自動検出して処理対象を決定できること
- 特定の `typeCode` のみを対象に絞って実行できること
- 各タイプについて `standard` と `chibi` の 2 バリアントを生成できること
- 各バリアントで `raw` を保存できること
- オプション有効時のみ `transparent` を保存できること
- API リクエスト、レスポンス、生成結果 URL、ローカル保存先をメタデータとして残せること
- スキップ、上書き、リトライを制御できること
- バッチ全体の成功件数と失敗件数をレポートできること

### 5.2 非機能要件

- 同一設定で再実行しても出力場所が安定すること
- 途中失敗しても再開しやすいこと
- API クレジット消費の状況を把握しやすいこと
- 将来の LINE スタンプ用派生生成に転用しやすい構成であること

## 6. 外部 API 前提

### 6.1 採用方針

画像生成 API は NanoBanana を利用する。

2026-03-23 時点で確認した公式ドキュメントでは、`Nanobanana 2` 系エンドポイントに以下の特徴がある。

- テキストプロンプト `prompt` を受け取れる
- 参照画像 URL 配列 `imageUrls` を受け取れる
- `aspectRatio`、`resolution`、`outputFormat` を指定できる
- `callBackUrl` は任意で、非同期完了はポーリングでも扱える
- 生成後は `taskId` を用いてタスク状態と `resultImageUrl` を取得できる

このため、初期版では `Nanobanana 2` を第一候補とする。

### 6.2 API 連携上の重要な設計判断

- Codex ローカル実行では公開コールバック URL を常に用意できるとは限らないため、初期版はポーリングを標準とする
- `imageUrls` は URL 配列であり、ローカルファイルパスを直接渡す前提ではない
- 標準キャラ生成の `resultImageUrl` をチビキャラ生成の参照画像として再利用する
- 生成完了後は速やかにローカルへダウンロードし、ローカル成果物を正とする

### 6.3 背景透過に関する前提

公式ドキュメントでは `outputFormat` として `png` は確認できるが、alpha チャンネル付き透過背景の保証や背景除去機能は明示されていない。

推論:
背景透過を扱う場合は、「NanoBanana によるグリーンバック画像生成」と「ローカルでのクロマキー背景除去」を分離して設計する必要がある。

## 7. 出力仕様

### 7.1 出力先

初期版では以下の出力構成を推奨する。

```text
output/character-images/
  batch-report.json
  OFEI/
    standard/
      prompt.txt
      negative_prompt.txt
      request.json
      task.json
      raw.png
      transparent.png   # 背景透過オプション有効時のみ
      meta.json
    chibi/
      prompt.txt
      negative_prompt.txt
      request.json
      task.json
      raw.png
      transparent.png   # 背景透過オプション有効時のみ
      meta.json
  ...
```

### 7.2 ファイルの役割

- `prompt.txt`: 実際に送った最終プロンプト
- `negative_prompt.txt`: 実際に送ったネガティブプロンプト
- `request.json`: API 送信 payload
- `task.json`: API の task 追跡結果
- `raw.png`: 生成直後の画像
- `transparent.png`: 背景透過オプション有効時の完成素材
- `meta.json`: 型情報、保存先、使用設定、エラー情報
- `batch-report.json`: バッチ単位の総括

## 8. 画像仕様

### 8.1 標準キャラクター画像

初期版では、将来の再利用性を優先して以下を標準仕様とする。

- 1 人のみ
- 全身寄り
- 1:1 キャンバス
- 余白あり
- シルエットが欠けない
- 文字なし
- ロゴなし
- PNG 出力

### 8.2 チビキャラ画像

チビキャラは以下を満たすことを目標とする。

- 同一タイプの標準キャラと見て同一人物だと分かる
- 髪型、服装、主要小物、配色を維持する
- 頭身を下げる
- 立ち絵やスタンプ素材に使いやすい単体シルエットにする
- PNG 出力

### 8.3 背景透過画像

背景透過版はオプション機能とし、有効時は以下を満たすことを最低条件とする。

- 背景領域に alpha がある
- 1 キャラクターのみが残る
- 手足や髪の切れが強すぎない
- 文字やロゴが残らない

## 9. プロンプト設計

### 9.1 基本方針

プロンプトは JSON 内の既存文言をそのまま使わず、以下の 3 層で再構成する。

1. タイプ固有情報
2. バリアント固有情報
3. 出力品質ルール

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

`imagePrompt` は補助材料として扱い、背景付きカード向けの記述は除外または置換する。

### 9.3 標準キャラ向け差し替えルール

既存 `imagePrompt` のうち、以下は素材向けに書き換える。

- 「結果カード用イラスト」などの用途文脈を除去する
- 背景透過オプション無効時は「背景」を極力単純な無地に寄せる
- 背景透過オプション有効時は「完全に均一な明るい緑色の背景」に置換する
- 「上半身構図」を「全身寄り」「キャラ全体が収まる構図」に置換する
- 「文字なし・ロゴなし」は維持する

背景透過オプション有効時には、以下のクロマキー前提指示を追加する。

- 背景は完全に均一な明るい緑色 `#00FF00`
- 背景にグラデーション、影、模様を入れない
- 被写体に緑色を使わない
- 被写体と背景の境界を明確にする

### 9.4 チビキャラ向け差し替えルール

チビキャラ用では、標準キャラの特徴を維持しつつ以下を追加する。

- super deformed / chibi style
- simplified proportions
- oversized head
- clean silhouette
- sticker-friendly pose

ただし、幼児化しすぎる表現やギャグ寄りすぎる表情は避ける。

### 9.5 ネガティブプロンプト

各 JSON の `negativePrompt` をベースにしつつ、透過素材向けの共通禁止事項を加える。

- multiple characters
- text
- logo
- watermark
- cropped head
- cropped feet
- bad hands
- background clutter

## 10. 生成フロー設計

### 10.1 標準フロー

1. 対象タイプ JSON を読み込む
2. 必須項目を検証する
3. 標準キャラ用プロンプトを組み立てる
4. NanoBanana に生成依頼する
5. `taskId` を使って完了までポーリングする
6. `resultImageUrl` を取得して `raw.png` を保存する
7. 背景透過オプション有効時のみ `raw.png` から `transparent.png` を作る
8. 標準キャラの `resultImageUrl` を参照画像としてチビキャラ生成に使う
9. チビキャラ用プロンプトを組み立てる
10. NanoBanana に生成依頼する
11. 完了までポーリングする
12. `raw.png` を保存する
13. 背景透過オプション有効時のみ `transparent.png` を作る
14. メタデータとバッチレポートを更新する

### 10.2 再実行ルール

- 既存 `raw.png` があれば既定ではスキップする
- 背景透過オプション時は既存 `transparent.png` があれば既定ではスキップする
- `--overwrite` 指定時のみ上書きする
- `--retry-failed` 指定時は失敗したタイプのみ再実行する

## 11. 背景透過処理の設計

### 11.1 初期方針

背景透過はオプション機能とし、画像生成工程と分けた専用の後処理ステップとして扱う。

採用方式は、指定記事の方針に沿ったグリーンバック + クロマキー合成とする。

処理の流れ:

1. NanoBanana に対して、背景を完全に均一なクロマキーグリーン `#00FF00` にした画像を生成させる
2. ローカルで画像を読み込む
3. BGR から HSV に変換する
4. 緑色範囲を使って背景マスクを作る
5. エッジ向けの緩い緑判定を別に作る
6. 形態学処理で境界を整理する
7. ガウシアンブラーでフェザリングする
8. 緑かぶりに対してデスピル処理を行う
9. alpha チャンネルを付与して PNG 保存する

### 11.2 この分離が必要な理由

- NanoBanana 公式仕様上、透過背景の保証が読み取れない
- モデルに「transparent background」と書いても、市松模様や白背景など擬似的な表現になる可能性がある
- LINE スタンプ用途では alpha の実在が重要で、見た目だけの擬似透過では不足する

### 11.3 採用技術詳細

背景透過オプションでは、OpenCV ベースのクロマキー処理を用いる。

最低限の依存ライブラリ:

- `opencv-python`
- `numpy`
- `pillow`

初期パラメータは、指定記事の例をベースにする。

- 背景の緑判定: `lower_green = [40, 150, 100]`, `upper_green = [80, 255, 255]`
- エッジ検出の緩い緑判定: `lower_edge = [35, 80, 80]`, `upper_edge = [85, 255, 255]`
- 形態学処理カーネル: `3x3`
- フェザリング: `GaussianBlur(5, 5)`
- デスピル閾値: `green_excess > 20`

### 11.4 注意点

- キャラクター衣装や小物に強い緑が含まれると誤透過のリスクがある
- そのため、背景透過オプション有効時はプロンプト側で「被写体に緑を使わない」を強めに指示する
- それでも緑系デザインが必須なタイプが出た場合は、将来拡張としてブルーバック切り替えを検討する

## 12. スクリプト設計

### 12.1 採用言語

初期版スクリプトは Python を前提とする。

理由:

- JSON 処理が容易
- HTTP リクエスト処理が容易
- 画像ダウンロードとファイル整理が容易
- 背景除去ライブラリの選択肢が多い
- OpenCV ベースのクロマキー実装と相性が良い

### 12.2 想定スクリプト構成

```text
skills/madamistype-character-images/
  SKILL.md
  agents/
    openai.yaml
  scripts/
    generate_character_batch.py
    prompt_builder.py
    nanobanana_client.py
    background_remover.py
    write_manifest.py
  references/
    io-schema.md
    prompt-rules.md
    nanobanana-notes.md
    line-stamp-extension.md
```

### 12.3 スクリプト責務

- `generate_character_batch.py`: CLI エントリ、全体オーケストレーション
- `prompt_builder.py`: JSON から標準キャラ用とチビキャラ用の最終プロンプトを生成
- `nanobanana_client.py`: 認証、生成依頼、ポーリング、画像ダウンロード
- `background_remover.py`: グリーンバック画像に対するクロマキー透過処理
- `write_manifest.py`: 実行結果の集約

## 13. CLI / 実行インターフェース案

### 13.1 最低限の実行例

```bash
python scripts/generate_character_batch.py --all
python scripts/generate_character_batch.py --types OFEI,TRLP
python scripts/generate_character_batch.py --all --overwrite
python scripts/generate_character_batch.py --retry-failed
python scripts/generate_character_batch.py --all --with-transparent
```

### 13.2 主な引数案

- `--all`
- `--types`
- `--overwrite`
- `--retry-failed`
- `--output-dir`
- `--poll-interval`
- `--resolution`
- `--dry-run`
- `--with-transparent`

### 13.3 環境変数案

- `NANOBANANA_API_KEY`
- `NANOBANANA_API_BASE`

repo ルートに `.env.character-images` を置いて設定できるようにする。

## 14. 品質担保

### 14.1 自動検証

- JSON 必須項目が揃っているか
- 出力ファイルが所定パスにあるか
- 背景透過オプション有効時は `transparent.png` が PNG であるか
- 背景透過オプション有効時は `transparent.png` に alpha があるか
- 実行レポートに成功可否が記録されているか

### 14.2 目視確認

最低限、各バッチで以下を人間が確認する。

- 顔が崩れていないか
- 手が大きく崩れていないか
- 小物や衣装の特徴が残っているか
- チビキャラ化しても元タイプらしさが残っているか
- 背景透過オプション有効時は、背景除去で髪先や服端が削れすぎていないか

## 15. LINE スタンプ拡張を見据えた設計方針

### 15.1 今の時点で先に揃えておくべきもの

- 全身寄りで欠けない元絵
- 背景透過済み PNG
- タイプごとの見た目ルール
- 小物、配色、髪型など識別要素の明文化

### 15.2 将来追加する機能

- 表情差分生成
- ポーズ差分生成
- セリフ付きスタンプ台紙生成
- スタンプ用余白ルール適用
- 一括エクスポート

### 15.3 拡張上の注意

LINE スタンプでは感情差分の量産が必要になるため、初期版から「キャラクター同一性を保つ仕組み」を意識する必要がある。

そのため、チビキャラ生成は可能なら標準キャラの `resultImageUrl` を参照画像として使い、見た目の連続性を確保する。

## 16. 実装タスク一覧

### 16.1 フェーズ 0: 仕様確定

- スキル名を確定する
- 出力先ディレクトリを確定する
- 背景除去方式を確定する
- 標準キャラを全身にするか半身にするかを最終決定する
- 背景透過オプションの既定値を OFF にすることを確定する

### 16.2 フェーズ 1: スキルひな型作成

- `init_skill.py` でスキルひな型を生成する
- `SKILL.md` の frontmatter を作る
- `agents/openai.yaml` を生成する
- `scripts/` と `references/` を作る

### 16.3 フェーズ 2: 参照資料整備

- 入力 JSON の簡易スキーマを文書化する
- プロンプト再構成ルールを文書化する
- NanoBanana API の利用メモを文書化する

### 16.4 フェーズ 3: スクリプト実装

- JSON ローダーを作る
- プロンプトビルダーを作る
- NanoBanana クライアントを作る
- ポーリング処理を作る
- ダウンロード処理を作る
- 背景除去処理を作る
- 出力メタデータ作成処理を作る
- バッチレポート作成処理を作る

### 16.5 フェーズ 4: 検証

- 1 タイプだけで疎通確認する
- 標準キャラ生成の品質を確認する
- チビキャラ生成の同一性を確認する
- 背景透過品質を確認する
- 16 タイプ全件バッチを実行する

### 16.6 フェーズ 5: 改善

- 失敗しやすいタイプのプロンプト調整
- 背景除去品質の調整
- 命名規則と出力構成の微調整
- 将来のスタンプ差分生成用の設計追加

## 17. 受け入れ条件

- 1 回の実行で 16 タイプ分の `standard` と `chibi` を処理できること
- 背景透過オプション有効時のみ、各タイプで `transparent.png` が生成されること
- 出力先がタイプごと、バリアントごとに整理されること
- 失敗時に原因が `meta.json` または `batch-report.json` に残ること
- 再実行時に不要な再生成を避けられること

## 18. 現時点の判断まとめ

- 入力ソースは `data/types/*.json` を正とする
- 既存 `imagePrompt` はそのまま使わず透過素材向けに再構成する
- 画像生成 API は NanoBanana を使う
- 初期版の実行方式はコールバックではなくポーリングを標準とする
- 背景透過はオプション機能とし、グリーンバック生成 + OpenCV クロマキー後処理として扱う
- チビキャラ生成では標準キャラの結果 URL を参照画像として再利用する設計を優先する

## 19. 参考リンク

- NanoBanana API docs: <https://docs.nanobananaapi.ai/cn>
- Generate Image (Nanobanana 2): <https://docs.nanobananaapi.ai/cn/nanobanana-api/generate-image-2>
- Get Task Details: <https://docs.nanobananaapi.ai/cn/nanobanana-api/get-task-details>
- 背景透過の技術方針: <https://zenn.dev/dotback/articles/19b36ebb33bd9d>
