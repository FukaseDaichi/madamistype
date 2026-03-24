# マダミスタイプ診断 UIデザインルール仕様書

## 1. 文書目的

本書は、マダミスタイプ診断のUIデザイン方針を定義するための仕様書である。

本書で定義する内容は以下の通りとする。

- スマートフォンを主対象とした画面設計方針
- ブランド体験に基づく色・文字・余白のルール
- トップ、設問、結果画面における情報の優先順位
- 長文、欠損、ゼロ件など実運用を前提としたUIの扱い
- アクセシビリティとパフォーマンスの設計基準
- 3層デザイントークンアーキテクチャ
- マイクロインタラクションとアニメーション仕様
- OGP画像とSNSシェア最適化

## 2. デザイン方針

### 2.1 前提

- 主対象は、スマートフォンで診断コンテンツを楽しむ20〜30代女性
- 対象ユーザーは、性格診断の高揚感と、マーダーミステリーの物語性・緊張感の両方を好む
- 利用文脈は、SNS流入から短時間で診断を始め、結果に納得して共有する流れを想定する
- ユーザーの80%以上がスマートフォンからアクセスする前提で設計する

### 2.2 目指す体験

本サービスのUIは、ただ整っているだけの無難な診断UIではなく、以下の感情を同時に成立させる。

- 診断を始める前の「自分のタイプを知りたい」期待感
- マーダーミステリーらしい「手がかりを読む」静かな緊張感
- 結果を見た瞬間の「自分っぽい」と感じる納得感
- 共有したくなる「見せたい結果カード」の所有感

### 2.3 参考サイトの解釈

参考サイトの [ラブタイプ診断](https://lovecharacter64.jp/) からは、以下の要素を取り入れる。

- ファーストビューで主役が明確に見える構成
- すぐに行動できる大きなCTA
- スマホでも迷いにくい縦方向の素直な視線導線
- 親しみやすい色使いと余白設計

一方で、そのまま模倣はしない。マダミスタイプ診断では、恋愛診断の明るさだけでなく、事件記録・観察・推理の空気を重ねる必要があるため、以下を追加する。

- 紙資料や事件メモを思わせる静かなベーストーン
- かわいさよりも「上品な引力」を優先した配色
- 過剰なポップ感ではなく、読ませる緊張感を保つ見出し設計

### 2.4 キーワード

- 甘さ
- 静かな緊張
- 物語の余白
- 手がかり感
- 上品
- 納得感

### 2.5 ターゲット層のデザイン嗜好

20〜30代日本人女性が好むデザイントレンドとして、以下を基本方針とする。

- **くすみカラー（ニュアンスカラー）**: 高彩度を避け、グレイッシュで落ち着いたトーンを基調にする
- **映えより馴染む**: フラッシュな目立ちではなく、調和と上品さを優先する
- **ソフトで丸みのあるUI**: 角丸、柔らかい影、穏やかなアニメーション
- **余白で品を出す**: 要素の詰め込みを避け、呼吸できるレイアウトにする

## 3. ブランドトーン

### 3.1 ビジュアルコンセプト

ビジュアルコンセプトは「Romantic Case File」とする。

- 恋愛診断系のとっつきやすさは残す
- ただし世界観は、ポップで軽い占い風ではなく、事件ファイルをめくるような没入感へ寄せる
- 黒ベタ中心の重いホラーにはしない
- 可愛さは色と余白で出し、情報そのものは冷静に整理する

### 3.2 情報設計の原則

- 1画面に主役は1つだけ置く
- 主役の次に見る比較対象は2つまでに絞る
- 行動ボタンは比較対象の直後に置く
- 装飾は、情報の階層を補強する場合のみ使う
- 何となくカードを並べる設計は禁止する

## 4. カラー設計

### 4.1 基本3色

全体の基準色は以下とする。くすみカラーを基調とし、高彩度を避ける。

| 役割 | 色名 | HEX | 用途 |
| ---- | ---- | --- | ---- |
| ベースカラー | Mist Ivory | `#F7F2ED` | 背景、余白、紙面感の土台 |
| メインカラー | Rose Mauve | `#C97B92` | ブランド印象、見出しの要点、タイプの主見せ |
| アクセントカラー | Detective Teal | `#2F6F74` | 比較情報、補助導線、分析・推理の印象付け |

### 4.2 補助色

役割を重複させないため、操作色と状態色は基本3色と分離する。

| 役割 | 色名 | HEX | 用途 |
| ---- | ---- | --- | ---- |
| サーフェス | Paper White | `#FFF9F6` | カード、モーダル、結果面 |
| 境界線 | Fog Line | `#D8CEC9` | 区切り線、入力境界、弱いカード枠 |
| 本文色 | Ink Plum | `#2B2430` | 見出し、本文、主要数値 |
| 補助本文色 | Dust Gray | `#6D6471` | 補足文、メタ情報、注釈 |
| 主操作色 | Action Rose | `#D85E72` | 開始、次へ、共有などの主要CTA |
| 副操作色 | Action Blue | `#7FA8C9` | 分岐CTA、戻る以外の副次アクション |
| 成功色 | Moss Green | `#3E8D6D` | 完了、保存成功、正常状態 |
| 注意色 | Amber Note | `#D49A31` | 注意喚起、未回答、保留 |
| 異常色 | Wine Alert | `#A94A5F` | エラー、破壊的操作、異常値 |

### 4.3 色の運用ルール

- `Rose Mauve` はブランド印象用であり、警告やエラーには使わない
- `Action Rose` は操作開始の意味に限定し、飾り色には使わない
- `Detective Teal` は比較・分析・補助導線に限定し、主CTAには使わない
- `Amber Note` は注意専用とし、成功表示には使わない
- `Wine Alert` は異常専用とし、タイプの個性表現には使わない
- 色だけで意味を伝えず、ラベル・アイコン・見出しを併用する

### 4.4 配色の比率

- ベース 70%
- 無彩色と本文色 20%
- メインとアクセント 10%

配色は「背景が静かで、主役だけが浮く」状態を基準とする。画面全体を色面で埋めない。

### 4.5 コントラスト比の基準（WCAG 2.2 AA準拠）

すべての色の組み合わせは、以下のコントラスト比を満たすこと。

| 用途 | 最低コントラスト比 |
| ---- | ---- |
| 通常テキスト（18px未満） | 4.5:1 |
| 大きいテキスト（18px以上、または14px太字以上） | 3:1 |
| 非テキスト要素（アイコン、ボーダー、フォームコントロール） | 3:1 |
| フォーカスインジケーター | 3:1（隣接色に対して） |

主要な組み合わせの検証結果:

| 前景 | 背景 | コントラスト比 | 合否 |
| ---- | ---- | ---- | ---- |
| Ink Plum `#2B2430` | Mist Ivory `#F7F2ED` | 11.8:1 | 合格 |
| Ink Plum `#2B2430` | Paper White `#FFF9F6` | 13.1:1 | 合格 |
| Dust Gray `#6D6471` | Mist Ivory `#F7F2ED` | 4.1:1 | 要注意（補足テキストは16px以上で使用） |
| Action Rose `#D85E72` | Paper White `#FFF9F6` | 3.6:1 | 大きいテキストのみ合格 |

`Dust Gray` を通常テキストに使う場合は、16px以上のサイズを必須とする。`Action Rose` をテキストとして使う場合は18px以上に限定し、ボタン内の白文字（`#FFFFFF`）との組み合わせを基本とする。

### 4.6 ダークモード

**MVP段階ではダークモードを実装しない。** ただし、将来対応を容易にするため、以下を守る。

- コンポーネント内で生のHEX値を直接使用しない
- すべての色参照はセマンティックトークン経由とする

## 5. デザイントークン

### 5.1 3層アーキテクチャ

デザイントークンは、Primitive → Semantic → Component の3層で管理する。コンポーネントからPrimitiveトークンを直接参照してはならない。

### 5.2 Primitiveトークン（色）

```css
:root {
  /* --- Primitive: Color --- */
  --primitive-ivory-50: #FFF9F6;
  --primitive-ivory-100: #F7F2ED;
  --primitive-ivory-200: #D8CEC9;

  --primitive-plum-900: #2B2430;
  --primitive-plum-600: #6D6471;

  --primitive-rose-400: #C97B92;
  --primitive-rose-500: #B86881;
  --primitive-rose-600: #D85E72;
  --primitive-rose-700: #C84F64;
  --primitive-rose-800: #A94A5F;

  --primitive-teal-400: #DDECEB;
  --primitive-teal-700: #2F6F74;

  --primitive-blue-400: #7FA8C9;
  --primitive-blue-500: #6C98BB;

  --primitive-green-600: #3E8D6D;
  --primitive-amber-500: #D49A31;
}
```

### 5.3 Semanticトークン（色）

```css
:root {
  /* --- Semantic: Color --- */
  --color-bg: var(--primitive-ivory-100);
  --color-surface: var(--primitive-ivory-50);
  --color-line: var(--primitive-ivory-200);
  --color-text: var(--primitive-plum-900);
  --color-text-subtle: var(--primitive-plum-600);

  --color-brand: var(--primitive-rose-400);
  --color-brand-strong: var(--primitive-rose-500);
  --color-accent: var(--primitive-teal-700);
  --color-accent-soft: var(--primitive-teal-400);

  --color-action-primary: var(--primitive-rose-600);
  --color-action-primary-hover: var(--primitive-rose-700);
  --color-action-secondary: var(--primitive-blue-400);
  --color-action-secondary-hover: var(--primitive-blue-500);

  --color-success: var(--primitive-green-600);
  --color-warning: var(--primitive-amber-500);
  --color-danger: var(--primitive-rose-800);

  --color-focus-ring: var(--primitive-teal-700);
}
```

### 5.4 Semanticトークン（スペーシング）

4pxベースグリッドを採用する。すべての余白・パディング・ギャップはこのスケールの倍数とする。

```css
:root {
  /* --- Semantic: Spacing (4px base grid) --- */
  --space-1: 4px;    /* 極小: アイコンとラベルの間 */
  --space-2: 8px;    /* 小: リスト項目間 */
  --space-3: 12px;   /* 中小: カード内パディング */
  --space-4: 16px;   /* 中: 画面端マージン、セクション内 */
  --space-5: 20px;   /* 中大: 選択肢間 */
  --space-6: 24px;   /* 大: セクション間 */
  --space-8: 32px;   /* 特大: 画面セクション間 */
  --space-10: 40px;  /* 超大: ヒーローセクション前後 */
  --space-12: 48px;  /* 最大: ページセクション間 */
  --space-16: 64px;  /* 超最大: ファーストビュー余白 */
}
```

### 5.5 Semanticトークン（タイポグラフィ）

```css
:root {
  /* --- Semantic: Typography --- */
  --font-display: 'Shippori Mincho B1', 'Yu Mincho', serif;
  --font-body: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;

  --text-hero: clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem);     /* 28-36px */
  --text-h1: clamp(1.375rem, 1.2rem + 0.75vw, 1.625rem);     /* 22-26px */
  --text-h2: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);        /* 18-22px */
  --text-body: clamp(0.9375rem, 0.9rem + 0.25vw, 1.0625rem); /* 15-17px */
  --text-caption: clamp(0.8125rem, 0.8rem + 0.125vw, 0.875rem); /* 13-14px */
  --text-label: clamp(0.75rem, 0.725rem + 0.125vw, 0.8125rem);  /* 12-13px */

  --leading-tight: 1.3;   /* 見出し */
  --leading-normal: 1.5;  /* UI要素 */
  --leading-relaxed: 1.8; /* 日本語本文 */
  --leading-loose: 2.0;   /* 長文読み物 */

  --tracking-tight: 0.02em;  /* 見出し */
  --tracking-normal: 0.05em; /* 本文 */
  --tracking-wide: 0.1em;    /* ラベル、キャプション */
}
```

### 5.6 Semanticトークン（その他）

```css
:root {
  /* --- Semantic: Border Radius --- */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* --- Semantic: Shadow --- */
  --shadow-sm: 0 1px 3px rgba(43, 36, 48, 0.06);
  --shadow-md: 0 4px 12px rgba(43, 36, 48, 0.08);
  --shadow-lg: 0 8px 24px rgba(43, 36, 48, 0.10);

  /* --- Semantic: Animation --- */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --duration-enter: 250ms;
  --duration-exit: 200ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* --- Semantic: Z-index --- */
  --z-base: 0;
  --z-card: 10;
  --z-sticky: 100;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

### 5.7 Componentトークン（例）

```css
:root {
  /* --- Component: Button --- */
  --btn-primary-bg: var(--color-action-primary);
  --btn-primary-bg-hover: var(--color-action-primary-hover);
  --btn-primary-text: #FFFFFF;
  --btn-primary-radius: var(--radius-lg);
  --btn-primary-min-height: 52px;
  --btn-primary-padding: var(--space-3) var(--space-6);

  --btn-secondary-bg: transparent;
  --btn-secondary-border: var(--color-action-secondary);
  --btn-secondary-text: var(--color-action-secondary);
  --btn-secondary-radius: var(--radius-lg);

  /* --- Component: Card --- */
  --card-bg: var(--color-surface);
  --card-border: var(--color-line);
  --card-radius: var(--radius-lg);
  --card-padding: var(--space-5);
  --card-shadow: var(--shadow-sm);

  /* --- Component: Quiz Option --- */
  --option-bg: var(--color-surface);
  --option-bg-selected: var(--color-accent-soft);
  --option-border: var(--color-line);
  --option-border-selected: var(--color-accent);
  --option-radius: var(--radius-md);
  --option-min-height: 52px;
  --option-padding: var(--space-3) var(--space-4);
  --option-gap: var(--space-3);

  /* --- Component: Progress --- */
  --progress-bg: var(--color-line);
  --progress-fill: var(--color-brand);
  --progress-height: 4px;
  --progress-radius: var(--radius-full);
}
```

## 6. タイポグラフィ

### 6.1 方針

- 本文はスマホでの可読性を最優先する
- 見出しは、診断サイトの軽さよりも、物語の章タイトルのような引力を持たせる
- フォントだけで世界観を作ろうとせず、行間と余白で品を出す
- フルイドタイポグラフィ（`clamp()`）を用い、ブレークポイントに依存しないスケーリングを行う

### 6.2 推奨フォントと読み込み戦略

#### フォント選定

- 見出し・タイプ名称: `Shippori Mincho B1`（Google Fonts）
- 本文・UI: `Noto Sans JP`（Google Fonts）

#### フォント読み込み（Next.js）

```typescript
import { Noto_Sans_JP, Shippori_Mincho_B1 } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-body',
});

const shipporiMincho = Shippori_Mincho_B1({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-display',
});
```

- `preload: false` は日本語フォントに必須（CJKフォントは100以上のサブセットファイルに分割されるため）
- `display: 'swap'` でフォント読み込み中のテキスト非表示を防ぐ
- 使用するウェイトのみを指定し、ペイロードを最小化する

### 6.3 文字サイズ基準

フルイドタイポグラフィにより、375px〜1280pxの画面幅で滑らかにスケーリングする。

| 用途 | サイズ（モバイル→デスクトップ） | 行間 | 字間 | フォント |
| ---- | ---- | ---- | ---- | ---- |
| ヒーロータイトル | 28→36px | 1.3 | 0.02em | display |
| 画面見出し | 22→26px | 1.3 | 0.02em | display |
| セクション見出し | 18→22px | 1.4 | 0.02em | display |
| 本文 | 15→17px | 1.8 | 0.05em | body |
| 補足 | 13→14px | 1.6 | 0.05em | body |
| ラベル | 12→13px | 1.4 | 0.1em | body |

### 6.4 日本語テキストルール

- 最小フォントサイズは **14px**（12pxが許容されるのはラベルのみ）
- 日本語テキストに `font-style: italic` を使わない
- 本文の最適行長は **約35文字**（`max-width: 35em` を目安とする）
- 本文の行間は **1.8** を基準とする（英語の1.5より広く取る必要がある）
- `letter-spacing: 0.05em` を本文の標準とする
- `text-align: justify` は日本語本文に適用可能（ワードスペースがないため）

### 6.5 文章ルール

- 1文は短く切る
- 断定しすぎる言い回しより、「らしさ」を言い当てる文を優先する
- 英語ラベルを多用しない
- 感情を煽る装飾記号や不要な感嘆符は使わない

## 7. レイアウトルール

### 7.1 スマホファースト

- 基準幅は `375px` で設計し、`320px` まで崩れないことを検証する
- 横並び前提の構成を作らない
- 重要情報は1カラムで読み下ろせる順に置く
- 画面端マージンは `var(--space-4)`（16px）を基本とする
- すべてのスペーシングは4pxグリッドの倍数とする

### 7.2 タッチターゲット

- タップ可能な要素の最小サイズは **48×48px**
- タップ可能な要素間の最小距離は **8px**
- 主要CTAボタンの最小高さは **52px**
- ボタンとリンクの間に十分なスペースを確保し、ミスタップを防ぐ
- 親指が届きやすい画面下半分に主要アクションを配置する

### 7.3 視線導線

各画面は、必ず以下の順で視線が流れるように設計する。

1. 最初に見る: その画面の主役
2. 次に比較する: 判断材料または補足情報
3. 最後に行動する: CTA

### 7.4 主役の作り方

- 主役には、サイズ・色・余白の3要素のうち最低2つで差をつける
- 主役の近くに同格の見出しを置かない
- 画像を置く場合も、主役はテキストかCTAのどちらかに固定する

### 7.5 レスポンシブブレークポイント

| ブレークポイント | 幅 | 主な用途 |
| ---- | ---- | ---- |
| sm | 640px | 小型タブレット |
| md | 768px | タブレット |
| lg | 1024px | ラップトップ |
| xl | 1280px | デスクトップ（最大コンテンツ幅） |

コンテンツの最大幅は `640px` とし、それ以上の画面幅では中央配置する。診断コンテンツはスマートフォン体験を基準とするため、無理にワイドレイアウトに広げない。

## 8. 画面別ルール

### 8.1 診断トップ

#### 主役

- サービスコピー
- 開始CTA

#### 構成順

1. サービス名
2. 一言で伝わる価値
3. 開始CTA
4. 補助説明
5. 世界観ビジュアル
6. 信頼補強情報

#### ルール

- ファーストビュー内で「何の診断か」「どう始めるか」を完結させる
- 開始CTAの最小タップ高は **52px** を確保する
- キャラクター一覧や詳細説明はCTAより下に置く
- 2つの開始導線がある場合、主導線と副導線の強弱を明確にする
- 主導線は `Action Rose`、副導線は `Action Blue` を使い分ける
- ファーストビューの初期表示は **2.5秒以内**（LCP基準）

### 8.2 設問画面

#### 主役

- 今答えるべき質問文

#### 構成順

1. 進捗（プログレスバー＋テキスト）
2. 質問文
3. 選択肢
4. 補足説明
5. 戻る

#### ルール

- 1画面1質問を原則とする
- 質問文は画面中央より上に置き、視線の初速で読めるようにする
- 選択肢は「比較」がしやすいよう、サイズと行頭位置を揃える
- 選択肢の最小タップ高は **52px**、選択肢間のギャップは **12px** とする
- 戻るは常に見えるが、主役にしない
- 長い選択肢でも2〜3行で収まりやすい幅と行間を取る
- 補足文は未読でも回答可能な位置づけにする
- 進捗表示は `aria-live="polite"` で「質問 3 / 32」のようにスクリーンリーダーに通知する
- 質問遷移時にフォーカスを新しい質問の見出しに移動する

### 8.3 結果画面

#### 主役

- タイプ名称
- 一言キャッチコピー
- タイプ別キャラクターイラスト

#### 構成順

1. タイプ名称（display フォント、大きく）
2. キャラクターイラスト
3. キャッチコピー
4. 3行前後の要約
5. 共有・再診断CTA
6. 4軸の内訳（パーセンテージバー表示）
7. 強み
8. 注意点
9. 向いている立ち回り
10. 相性タイプ

#### ルール

- 結果に到達した瞬間、スクロールなしでタイプ名・イラスト・キャッチコピーが見える状態を優先する
- 共有導線は、結果の納得が高い直後（要約の直下）に置く
- 4軸表示は情報整理のために使い、画面の主役にはしない
- 1つの結果画面に、意味の薄い小カードを大量に並べない
- 結果画面への遷移時には「計算中」の短いアニメーション（1〜2秒）を挟み、期待感を演出する
- 結果表示後にフォーカスをタイプ名称の見出しに移動する
- **各タイプに固有のキャラクターイラストを持たせる**（シェア時の視覚的差別化に必須）
- **各タイプに固有のアクセントカラーを設定する**（イラスト、結果カード、OGP画像に一貫して適用）

## 9. マイクロインタラクションとアニメーション

### 9.1 基本方針

- アニメーションは体験の補助であり、必須ではない
- `prefers-reduced-motion: reduce` を必ず尊重し、該当時はアニメーションを無効化または最小化する
- GPUコンポジットプロパティ（`transform`, `opacity`）のみをアニメーションする
- `width`, `height`, `margin`, `padding`, `top`, `left` のアニメーションは禁止する

### 9.2 タイミング基準

| 用途 | 持続時間 | イージング |
| ---- | ---- | ---- |
| ホバー/フォーカス状態変化 | 120ms | ease-out |
| 選択肢タップフィードバック | 150ms | ease-out |
| 質問間のスライド遷移 | 200-250ms | ease-in-out |
| 画面要素のフェードイン | 250ms | ease-out |
| 結果画面の段階表示 | 300-400ms（要素ごとに50msずつ遅延） | ease-out |
| 「計算中」ローディング | 1200-1800ms | - |
| 画面退出 | 200ms | ease-in |

### 9.3 具体的なインタラクション

#### 選択肢タップ

- 選択時: 背景色をアクセントソフト色に変化 + 微細なスケール（1.02x, 150ms）
- 選択解除時: 元に戻す（120ms）

#### 質問遷移

- 現在の質問: 左にスライドアウト + フェードアウト（200ms, ease-in）
- 次の質問: 右からスライドイン + フェードイン（250ms, ease-out）
- 戻る操作時は方向を逆転する

#### プログレスバー

- 幅の変化は `transform: scaleX()` で行う（`width` アニメーションの代わり）
- 持続時間: 300ms, ease-out

#### 結果表示

1. 「計算中」テキスト + 回転インジケーター（1.5秒）
2. タイプ名: フェードイン + 下から微移動（300ms）
3. イラスト: フェードイン（400ms, 50ms遅延）
4. キャッチコピー: フェードイン（300ms, 200ms遅延）
5. 要約以降: スクロールに連動したフェードイン

## 10. コンポーネントルール

### 10.1 ボタン

- 角丸は `var(--radius-lg)`（16px）を基本とする
- 主要CTAは面で目立たせ、最小高さ52pxを確保する
- 副CTAは線または薄い面で見せる
- 影は `var(--shadow-sm)` 以下とし、浮遊感より押しやすさを優先する
- フォーカス時に `var(--color-focus-ring)` で2pxの輪郭線を表示する
- `disabled` 状態では `opacity: 0.4` とし、`pointer-events: none` を設定する

### 10.2 カード

- カードは「意味のまとまり」がある場合のみ使う
- 段落ごとにカード化しない
- 結果画面では、カードより見出しと余白で区切る設計を基本とする
- カードのパディングは `var(--card-padding)`（20px）を基本とする

### 10.3 チップ・タグ

- チップは分類ラベル専用とする
- 装飾目的のチップを増やさない
- 4軸の区別は、色だけでなくラベル文言と並び順で理解できるようにする

### 10.4 イラストと装飾

- 装飾モチーフは、封蝋、罫線、見出し飾り、事件メモ風ラベル程度に留める
- 背景グラデーションやキラキラ演出を多用しない
- 画像は世界観補強用であり、本文より目立ってはいけない
- すべての画像・イラストに `width` と `height`（または `aspect-ratio`）を明示し、CLSを防ぐ

### 10.5 フォーム要素

- ラジオボタン/チェックボックスはカスタムスタイルを適用しても、セマンティックHTMLを崩さない
- 質問グループは `<fieldset>` + `<legend>` で囲む
- 単一選択は `<input type="radio">` を使う
- 選択状態の変化は `aria-checked` で通知する

## 11. OGP画像とSNSシェア設計

### 11.1 OGP画像仕様

- サイズ: **1200 x 630px**（各SNS共通安全サイズ）
- **重要コンテンツ（タイプ名、イラスト）は中央 630 x 630px の範囲に収める**（LINEが正方形にクロップするため）
- ファイルサイズ: 300KB以下を目標とする
- 各タイプごとに固有のOGP画像を動的生成する（`next/og` を使用）
- OGP画像に含める要素: タイプ名称、キャラクターイラスト、タイプ別アクセントカラー、サービスロゴ

### 11.2 メタタグ設定

```html
<!-- 共通 -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="マダミスタイプ診断" />

<!-- タイプ別結果ページ -->
<meta property="og:title" content="あなたは「名探偵（TFLP）」タイプ" />
<meta property="og:description" content="散らかった盤面ほど、この人の出番だ。" />
<meta property="og:image" content="/types/TFLP/opengraph-image" />

<!-- X (Twitter) -->
<meta name="twitter:card" content="summary_large_image" />
```

### 11.3 シェアボタン設計

- 対応SNS: **X (Twitter)**, **LINE**
- シェアボタンは結果画面の要約直下（感情のピーク時）に配置する
- 「リンクをコピー」ボタンをフォールバックとして設置する
- シェアを強制しない（日本のユーザーは「共有する理由」が必要）
- モバイルでは **Web Share API** を活用し、OSネイティブの共有シートを表示する

#### シェアテキスト（プリセット）

```text
X: マダミスタイプは「名探偵（TFLP）」でした。盤面が散らかるほど光る——証拠を束ねて答えへ連れていく人らしい。 #マダミスタイプ診断
LINE: https://line.me/R/share?text={エンコード済みテキストとURL}
```

#### シェア先URL

- シェアURLは `/types/[typeCode]`（公開用タイプ詳細ページ）を基本とする
- 診断直後の結果画面URL（`/diagnosis/result`）は共有しない

## 12. アクセシビリティ（WCAG 2.2 AA準拠）

### 12.1 基本原則

- セマンティックHTMLを基本とし、`div` の多用を避ける
- 適切な見出し階層を維持する（`h1` はページに1つ、以降は `h2` → `h3` の順）
- すべてのインタラクティブ要素にキーボードアクセスを保証する
- 色だけで情報を伝えない

### 12.2 フォーカス管理

- すべてのフォーカス可能な要素に視認可能なフォーカスインジケーターを表示する
- フォーカスインジケーターは `2px solid var(--color-focus-ring)` + `2px offset` を基本とする
- フォーカスが固定ヘッダー・ボトムバー・モーダルに隠れないようにする（WCAG 2.4.11）
- 質問遷移時にフォーカスを新しい質問の `<legend>` または見出しに移動する
- 結果表示時にフォーカスをタイプ名称の見出しに移動する
- モーダル/オーバーレイ表示時はフォーカスをトラップし、閉じた後にトリガー要素にフォーカスを戻す

### 12.3 スクリーンリーダー対応

- 進捗状況の更新は `aria-live="polite"` で通知する（例: 「質問 3 / 32」）
- 選択肢の選択確認は `role="status"` で通知する
- 質問グループは `<fieldset>` + `<legend>` で構造化する
- 装飾的な画像は `aria-hidden="true"` + 空の `alt` で非通知にする
- 意味のある画像は適切な `alt` テキストを設定する

### 12.4 ズーム対応

- 200%ブラウザズーム時にレイアウトが崩れないことを検証する
- `user-scalable=no` を設定しない
- フォントサイズに `px` のみの固定値を使わず、`rem` ベースの `clamp()` を使う

### 12.5 iOS入力フォーカス時の自動ズーム防止

iOSのSafariでは、`<input>` や `<textarea>` や `<select>` のフォントサイズが **16px未満** の場合、フォーカス時に画面が自動ズームされる。これはユーザー体験を著しく損なうため、以下を必ず守る。

- すべてのフォーム要素（`<input>`, `<textarea>`, `<select>`）のフォントサイズを **16px（1rem）以上** にする
- Tailwind CSSでは `text-base`（16px）以上のクラスを適用する
- `text-sm`（14px）や `text-xs`（12px）をフォーム要素に直接適用してはならない
- フォーム要素のフォントサイズを小さく見せたい場合でも、16px未満にはしない

```tsx
{/* 正しい例 */}
<input className="text-base" placeholder="検索..." />
<select className="text-base">...</select>
<textarea className="text-base">...</textarea>

{/* 禁止例: iOSで自動ズームが発生する */}
<input className="text-sm" placeholder="検索..." />
<select className="text-xs">...</select>
```

なお、`<meta name="viewport">` に `maximum-scale=1` を設定してズームを無効化する方法は、アクセシビリティを損なうため **禁止** とする。

### 12.6 モーション配慮

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 13. パフォーマンス設計

### 13.1 Core Web Vitals 目標

| 指標 | 目標値 | 対策 |
| ---- | ---- | ---- |
| LCP（Largest Contentful Paint） | 2.5秒以内 | ヒーロー画像の最適化、クリティカルCSSのインライン化 |
| INP（Interaction to Next Paint） | 200ms以内 | イベントハンドラの軽量化、レイアウトトリガーの回避 |
| CLS（Cumulative Layout Shift） | 0.1以下 | 画像サイズの明示、フォント表示の安定化、動的コンテンツの予約領域確保 |

### 13.2 CLS防止ルール

- すべての `<img>` と `<Image>` に `width`, `height` または `aspect-ratio` を設定する
- フォントは `display: swap` で読み込み、FOIT（Flash of Invisible Text）を防ぐ
- 非同期で読み込むコンテンツ（結果イラストなど）は表示領域を事前に確保する
- `CSS contain: layout` を独立セクションに適用し、リフロー範囲を限定する

### 13.3 アニメーションパフォーマンス

- `transform` と `opacity` のみをアニメーションする（GPUコンポジット対象）
- `width`, `height`, `margin`, `padding`, `top`, `left` のアニメーションは禁止する
- `box-shadow` と `filter` のアニメーションは大きな要素では避ける
- アニメーション持続時間は300ms以下を基本とし、最大でも500msを超えない

### 13.4 画像最適化

- Next.js の `<Image>` コンポーネントを使い、WebP/AVIF変換と遅延読み込みを有効にする
- ファーストビューの画像は `priority` を指定してプリロードする
- OGP画像は300KB以下、通常の画像は100KB以下を目標とする

## 14. 実運用を前提にしたルール

### 14.1 長文耐性

- タイプ名称は2行まで許容する
- キャッチコピーは3行までで自然に読める行長にする
- 詳細説明は4行を超える場合、段落分けまたは折りたたみを検討する

### 14.2 欠損耐性

- 相性情報や補助情報が未設定でも、空白のカードを出さない
- 未設定時は「情報準備中」と明示し、壊れた印象を避ける
- 画像欠損時は背景色付きのプレースホルダー（`var(--color-accent-soft)` + タイプ名テキスト）に置き換える

### 14.3 異常値・ゼロ件

- 推奨項目が0件でもレイアウトを崩さない
- 件数0を隠すのではなく、理由が分かる補足文を添える
- 想定外の長さの文字列は、縮小ではなく改行で吸収する

### 14.4 重複耐性

- 同じ意味の情報が複数箇所に出る場合は統合する
- 同一内容のCTAを近接配置しない
- 「診断開始」「次へ」「共有する」の3種類以上の強いCTAを同じ画面で競合させない

## 15. AIっぽくしないための禁止事項

- 無意味なグラデーション背景を全面に敷く
- 情報の意味が薄いカードを機械的に等間隔で並べる
- すべての要素を同じ強さの見出しと枠で囲う
- ブランド色と注意色を兼用する
- どのサービスにも見えるSaaS風の白箱UIに寄せる
- ガラス風、ネオン風、過剰な発光表現に逃げる
- 雰囲気づくりだけの装飾を増やし、主役を曖昧にする
- 高彩度・蛍光色を使って安っぽい印象にする
- ピンクを全面に使って10代向けの印象にする

## 16. 実装への橋渡し

### 16.1 最初に整備すべきもの

1. `app/globals.css` に3層デザイントークンを設定する
2. `next/font/google` でフォント読み込みを設定する
3. ボタンの主副バリエーションをコンポーネント化する
4. 画面余白とセクション間隔の共通ルールをユーティリティクラスで定義する
5. `prefers-reduced-motion` のグローバルメディアクエリを設定する
6. フォーカスインジケーターのグローバルスタイルを設定する

### 16.2 実装優先度

1. デザイントークンの3層設定（Primitive → Semantic → Component）
2. フォント読み込みとタイポグラフィ基盤
3. アクセシビリティ基盤（フォーカス、`aria-live`、見出し階層）
4. スマホでの視線導線とタッチターゲット
5. 結果画面の主役設計
6. OGP画像生成パイプライン
7. マイクロインタラクション
8. 長文・欠損耐性
9. 装飾の最適化

### 16.3 品質チェックリスト

実装後に以下を検証する。

- [ ] 375px幅で全画面のレイアウトが崩れないこと
- [ ] 320px幅で致命的な崩れがないこと
- [ ] 200%ズームでレイアウトが崩れないこと
- [ ] タブキーのみで診断フロー全体を操作できること
- [ ] スクリーンリーダー（NVDA / VoiceOver）で診断を完了できること
- [ ] Lighthouse Performance スコア 90以上
- [ ] Lighthouse Accessibility スコア 95以上
- [ ] 全てのテキストがWCAG 2.2 AAのコントラスト比を満たすこと
- [ ] `prefers-reduced-motion: reduce` でアニメーションが無効化されること
- [ ] OGP画像がX / LINE / Facebookで正しく表示されること
- [ ] 各タイプのOGP画像でLINEの正方形クロップ時にコンテンツが切れないこと

### 16.4 補足

本書は、見た目の好みを決めるための資料ではなく、情報の優先順位・ブランド体験・アクセシビリティ・パフォーマンスを統合的に揃えるためのルールである。後続のUI実装では、各画面で「この画面の主役は何か」を先に確定し、その後に色と装飾を当てることを原則とする。
