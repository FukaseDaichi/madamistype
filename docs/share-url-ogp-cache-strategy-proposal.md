# 共有URL / OGP運用メモ

## 1. 文書の目的

本書は、共有 URL と OGP 運用について、現行実装に反映済みのルールを整理するためのメモである。
元は提案書だったが、2026-03-30 時点では主要方針が実装に取り込まれている。

参照:

- [specification.md](./specification.md)
- [tech-stack-spec.md](./tech-stack-spec.md)
- [type-ogp-image-spec.md](./type-ogp-image-spec.md)

## 2. 現在の URL 役割分担

### 2.1 公開ページ

- URL: `/types/[typeCode]`
- index 対象
- canonical の基準
- SNS 共有の正規 URL

### 2.2 共有結果ページ

- URL: `/types/[typeCode]/[key]`
- 診断直後の着地先
- `noindex`
- canonical は `/types/[typeCode]`
- 結果 URL コピーに使う

## 3. 現在の共有 UI

### 3.1 公開タイプ詳細ページ

- 「自分でも診断する」ボタンのみ表示

### 3.2 共有結果ページ

- SNS 共有は公開ページ `/types/[typeCode]` を使う
- 別ボタンで共有結果 URL `/types/[typeCode]/[key]` をコピーできる

この分離により、SNS 共有先を 16 タイプの固定 URL に集約している。

## 4. OGP 運用

現行アプリは動的 OGP ルートを使わない。

利用中の静的アセット:

- `/main-ogp.png`
- `/types/{typeCode}-ogp.png`

メリット:

- 共有先 URL が増えても OGP 画像 URL はタイプ単位で固定
- 実行時の画像生成コストがない
- `public/` 配信だけで完結する

## 5. 実装反映済みのルール

1. 診断直後の本人向け URL は `/types/[typeCode]/[key]`
2. SNS 共有の正規 URL は `/types/[typeCode]`
3. shared page は `noindex`
4. canonical は `/types/[typeCode]`
5. OGP は静的画像 `/types/{typeCode}-ogp.png`

## 6. まだ意識すべき点

- `NEXT_PUBLIC_SITE_URL` 未設定時は絶対 URL が `http://localhost:3000` になる
- `/types` 一覧ページは存在しないため、共有導線やドキュメントで誤参照しない
- 共有キーは `v3` のみをサポートするため、旧 URL の再利用は前提にしない

## 7. 結論

現行実装は「共有結果ページ」と「SNS 共有用の公開ページ」を分けて運用している。
この方針を維持し、将来 shared URL を拡張する場合も、公開ページ `/types/[typeCode]` を SEO / OGP の基準点として扱う。
