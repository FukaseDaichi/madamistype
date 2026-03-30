# 現行ソースコードの問題点

2026-03-30 時点で、現行ソースコードと `npm run lint` / `npm run build` の確認から判明した問題点をまとめる。

確認コマンド:

- `npm run lint`
- `npm run build`

いずれも実行自体は成功している。  
以下はビルドエラーではないが、運用上または導線上の問題として把握しておくべき事項である。

## 1. ホームの `/types` リンクが 404 になる

対象ファイル:

- `components/home/home-page/home-hero-section.tsx`

現状:

- ホームのナビゲーションに `Link href="/types"` がある
- しかし現行ルートには `/types` が存在しない
- `next build` の出力でも `/types` は生成されていない

影響:

- ユーザーがホームナビから 404 へ遷移する
- README や一部旧設計書が「16タイプ一覧ページがある」前提でズレやすい

対応案:

- `/types` 専用ページを実装する
- もしくはリンク先をトップページ内の一覧アンカーへ変更する

## 2. `NEXT_PUBLIC_SITE_URL` 未設定時に絶対 URL が localhost になる

対象ファイル:

- `lib/site.ts`
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/json-ld.ts`

現状:

- `SITE_ORIGIN` は `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`
- 本番で環境変数を設定しないと、canonical / sitemap / JSON-LD / `metadataBase` が localhost を参照する

影響:

- 検索エンジン向けメタデータが誤る
- 共有時の絶対 URL が不正になる

対応案:

- 本番必須環境変数として README / 運用手順に明記する
- 可能なら production build 時に未設定を検出して失敗させる

## 3. 旧 `v2` 共有キーは将来の質問マスタ変更に弱い

対象ファイル:

- `lib/share-key.ts`
- `lib/diagnosis.ts`
- `app/(types)/types/[typeCode]/[key]/page.tsx`

現状:

- `v2` は回答内容を持つ
- shared page 表示時に現行 `question-master.json` と現行判定ロジックで再計算する
- 再計算結果の `typeCode` が URL の `typeCode` と合わないと `notFound()` になる

影響:

- 将来、質問文、重み、同点ルール、軸定義を変えたときに古い `v2` URL が無効化される可能性がある

補足:

- 現行の新規生成は `v3` が既定なので、新しく作られる URL への影響は限定的
- ただし旧 URL の後方互換を重視するなら放置しない方がよい

対応案:

- `v2` 用の固定ロジック / スナップショットを残す
- 旧 URL の移行ポリシーを決める

## 4. 未使用コンポーネントが残っている

対象ファイル:

- `components/type/axis-balance-bars/axis-balance-bars.tsx`

現状:

- 現行 UI から参照されていない
- 旧設計書では shared page の軸表示前提で書かれていたが、現行実装は `TypeSignatureSection` を使っている

影響:

- 文書と実装がズレる温床になる
- 将来改修時に「現役コンポーネント」と誤認しやすい

対応案:

- 本当に不要なら削除する
- 残すなら利用予定と責務を設計書へ明記する
