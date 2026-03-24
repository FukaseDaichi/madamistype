import type { AnswersRecord, ShareKeyPayload } from "@/lib/types";
import { normalizeUserName, toAnswerValue } from "@/lib/diagnosis";

export function createShareKey(userName: string, answers: AnswersRecord) {
  return encodeShareKey({
    v: 2,
    n: normalizeUserName(userName),
    a: sanitizeAnswers(answers),
  });
}

export function encodeShareKey(payload: ShareKeyPayload) {
  return encodeBase64Url(JSON.stringify(payload));
}

export function decodeShareKey(key: string) {
  try {
    const parsed = JSON.parse(decodeBase64Url(key)) as ShareKeyPayload;

    if (parsed.v === 1 && typeof parsed.n === "string") {
      return {
        v: 1 as const,
        n: normalizeUserName(parsed.n),
      };
    }

    if (parsed.v === 2 && typeof parsed.n === "string" && parsed.a) {
      return {
        v: 2 as const,
        n: normalizeUserName(parsed.n),
        a: sanitizeAnswers(parsed.a),
      };
    }

    return null;
  } catch {
    return null;
  }
}

function sanitizeAnswers(answers: AnswersRecord) {
  return Object.entries(answers).reduce<AnswersRecord>((accumulator, entry) => {
    const [questionId, value] = entry;
    const answerValue = toAnswerValue(value);

    if (answerValue) {
      accumulator[questionId] = answerValue;
    }

    return accumulator;
  }, {});
}

function encodeBase64Url(input: string) {
  if (typeof window === "undefined") {
    return Buffer.from(input, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(input);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window
    .btoa(binary)
    .replace(/\+/gu, "-")
    .replace(/\//gu, "_")
    .replace(/=+$/u, "");
}

function decodeBase64Url(input: string) {
  if (typeof window === "undefined") {
    return Buffer.from(input, "base64url").toString("utf8");
  }

  const normalized = input.replace(/-/gu, "+").replace(/_/gu, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = window.atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
