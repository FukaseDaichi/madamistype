"use client";

import { useEffect, useState } from "react";

import styles from "./type-character-memo.module.css";

type TypeCharacterMemoProps = {
  typeCode: string;
  typeName: string;
  shareKey: string;
  className?: string;
};

const STORAGE_PREFIX = "madamistype:character-memo";

export function TypeCharacterMemo({
  typeCode,
  typeName,
  shareKey,
  className = "",
}: TypeCharacterMemoProps) {
  const storageKey = `${STORAGE_PREFIX}:${typeCode}:${shareKey}`;
  const [note, setNote] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        setNote(saved);
      }
    } catch {
      // localStorage が使えない環境では入力欄だけ提供する
    } finally {
      setIsReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    try {
      if (note.trim()) {
        window.localStorage.setItem(storageKey, note);
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      // 保存に失敗しても入力自体は保持する
    }
  }, [isReady, note, storageKey]);

  const memoId = `character-memo-${typeCode}-${shareKey}`;

  return (
    <section
      aria-labelledby={`${memoId}-heading`}
      className={`${styles.memo} ${className}`.trim()}
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Character Memo</p>
        <h2 id={`${memoId}-heading`} className={styles.title}>
          自分のキャラメモ
        </h2>
      </div>

      <p className={styles.description}>
        {typeName}
        の結果を読みながら、この卓での自分のキャラ像や好きな役回り、あとで見返したい感触を書き残せます。
      </p>

      <label htmlFor={memoId} className={styles.label}>
        例: 好きな役 / 印象に残った言動 / 次にやりたい立ち回り
      </label>
      <textarea
        id={memoId}
        rows={5}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className={styles.textarea}
        placeholder="例: 感情が大きく動く役だとかなり乗れる。次は調査より対話が多いシナリオでも遊んでみたい。"
      />

      <div className={styles.footer}>
        <p className={styles.hint}>
          このメモはこのブラウザだけに自動保存されます。
        </p>

        <button
          type="button"
          onClick={() => setNote("")}
          className={styles.clearButton}
        >
          メモを消去
        </button>
      </div>
    </section>
  );
}
