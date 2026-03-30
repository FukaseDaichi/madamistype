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
