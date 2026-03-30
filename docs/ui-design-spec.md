# マダミスタイプ診断 UIデザイン仕様書

## 1. 文書の目的

本書は、2026-03-30 時点の現行 UI 実装をもとに、画面の見え方と表現ルールを整理した文書である。
理想案ではなく、現在のコードに存在する表現を基準にまとめる。

参照:

- [specification.md](./specification.md)
- [frontend-directory-structure-spec.md](./frontend-directory-structure-spec.md)

## 2. 現行デザインコンセプト

現行 UI の核は、**「やわらかい証拠書類 / ケースファイル」** である。

特徴:

- アイボリー基調の背景
- グリッドとラジアルグラデーションを重ねた紙面風の下地
- ケースファイル、封筒、証拠写真を思わせるレイアウト
- 4 種類のフォントを使った雑誌的 / 記録物的な見せ方
- 黒一色のノワールではなく、あたたかい紙色と差し色でまとめる構成

## 3. カラー

`app/globals.css` の現行トークンを正とする。

主要色:

- 背景: `#f7f2ed`
- 表面: `#fff9f6`
- 文字: `#2b2430`
- 補助文字: `#6d6471`
- 主アクセント: `#c97b92` / `#b86881`
- アクセント: `#2f6f74`
- セカンダリ: `#7fa8c9`

運用ルール:

- ページ全体は明るいアイボリー基調
- 主アクションは rose 系
- 補助アクションやフォーカスは teal / blue 系
- 診断フローの 5 段階スケールだけは肯定側を red、否定側を teal で分ける

## 4. タイポグラフィ

### 4.1 ルートフォント

`app/layout.tsx` で読み込む。

- `Noto Sans JP`
- `Shippori Mincho B1`

### 4.2 画面固有フォント

トップ / 診断 / タイプ詳細では次を追加で使う。

- `Bebas Neue`
- `Special Elite`
- `Noto Serif JP`
- `Caveat`

### 4.3 使い分け

- 大見出し: `Bebas Neue`
- 補助英字 / メタ情報: `Special Elite`
- 日本語本文: `Noto Serif JP` または `Noto Sans JP`
- 手書き注記: `Caveat`

## 5. 共通 UI 要素

### 5.1 共通クラス

`app/globals.css` に以下の共通部品がある。

- `surface-panel`
- `page-shell`
- `primary-button`
- `secondary-button`
- `text-field`
- `eyebrow`
- `section-title`
- `illustration-frame`

### 5.2 背景表現

`body` は次の重ね合わせで構成する。

- 2 つのラジアルグラデーション
- 縦方向の薄い線形グラデーション
- 固定グリッド風オーバーレイ

### 5.3 アクセシビリティ

- `skip-link` を配置する
- `:focus-visible` を明示する
- `prefers-reduced-motion: reduce` でアニメーションを抑制する

## 6. 画面別ルール

### 6.1 トップページ

主な構成:

1. マストヘッド
2. ケースファイル風ヒーロー
3. プレビュータイプのサイドカード
4. 診断開始フォーム
5. 軸解説セクション
6. 注目タイプ
7. 16 タイプ一覧
8. フッター

ヒーローの特徴:

- 封筒 / ケースファイル風の大きな面を使う
- 32 問 / 4 ページ / 16 タイプ / 4 軸を統計バッジで見せる
- `Start Diagnosis` の着地点を同一ページ内に持つ

### 6.2 診断フロー

主な構成:

1. 古紙風のヘッダーパネル
2. 進捗バー
3. 黒系の質問パネル
4. 5 段階のペン先アイコン選択 UI
5. 前へ / 次へボタン

現行 UI の要点:

- 1 画面 8 問
- 各質問は `fieldset` + `legend`
- 回答はペン先アイコンの 5 段階
- 未回答時はエラー表示し、最初の未回答設問へフォーカス

### 6.3 公開タイプ詳細ページ

主な構成:

1. ヘッダー
2. 被疑者カード風ヒーロー
3. Type Signature セクション
4. 強み / 注意点
5. 詳しい見立て
6. 立ち回り / 役回り
7. 相性
8. 共有パネル
9. フッター

ヒーローの要素:

- タイプ画像
- チビ画像があれば併記
- タイプコード / タイプ名 / タグライン / summary
- 共有導線

### 6.4 共有結果ページ

公開タイプ詳細ページと本文構成は共通で、以下だけ差分がある。

- 見出しが「[ユーザー名]さんの診断結果」になる
- shared page 用のスタンプ表現になる
- `isPostDiagnosisResult` のときだけ「共有」+「ご意見」ボタンを出す
- 結果 URL コピーを提供する

## 7. コンポーネント別の役割

### 7.1 ホーム

- `HomeHeroSection`: ヒーロー、統計、開始導線
- `AxisCompositionSection`: 4 軸の説明
- `FeaturedTypesSection`: 注目タイプ
- `AllTypesSection`: トップページ内の 16 タイプ一覧

### 7.2 診断

- `StartDiagnosisForm`: 名前入力
- `DiagnosisFlow`: 診断 UI 全体

### 7.3 タイプ詳細

- `TypeArtwork`: 通常画像またはプレースホルダー
- `TypeDetailHeroSection`: ファーストビュー
- `TypeSignatureSection`: 4 軸サマリ可視化
- `TypeListSection`: 強み / 注意点 / 立ち回り / 役回り
- `TypeCompatibilitySection`: 相性
- `ShareActions`: 共有導線

## 8. 画像ルール

- 通常画像は `public/types/{typeCode}.png`
- チビ画像は `public/types/{typeCode}_chibi.png`
- OGP は `public/types/{typeCode}-ogp.png`
- 画像未配置時は `TypeArtwork` がプレースホルダーを描画する

## 9. レスポンシブ方針

- モバイル優先
- トップページは大画面で非対称レイアウト
- 診断フローは常に 1 カラム中心
- タイプ詳細は 1 カラムベース、必要部分のみ 2 カラム

## 10. 現行仕様として見なさないもの

次は現行コードには存在しないため、本書の仕様には含めない。

- 黒背景固定のノワール全面デザイン
- `next/og` 前提の動的 OGP レイアウト
- 専用 `/types` 一覧ページ
- Motion ライブラリ依存の演出

## 11. 確認ポイント

UI 改修時は最低限次を確認する。

- トップページから診断開始まで迷わない
- 診断フローで 8 問すべて回答しないと進めない
- shared page と public page の役割差が維持されている
- 画像未設定時もプレースホルダーで破綻しない
- `prefers-reduced-motion` に配慮している
