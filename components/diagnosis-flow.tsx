"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ANSWER_OPTIONS,
  calculateDiagnosisResult,
  getQuestionsForPage,
} from "@/lib/diagnosis";
import { readDiagnosisDraft, writeDiagnosisDraft } from "@/lib/draft-storage";
import { createShareKey } from "@/lib/share-key";
import type { AnswersRecord, QuestionMaster } from "@/lib/types";

type DiagnosisFlowProps = {
  questionMaster: QuestionMaster;
};

type LocationState = {
  currentPage: number;
  hasPageQuery: boolean;
};

export function DiagnosisFlow({ questionMaster }: DiagnosisFlowProps) {
  const router = useRouter();
  const totalPages = questionMaster.meta.pageCount;
  const totalQuestions = questionMaster.meta.questionCount;
  const activeQuestions = questionMaster.questions.filter((question) => question.isActive);

  const [isHydrated, setIsHydrated] = useState(false);
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState<AnswersRecord>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [restoreNotice, setRestoreNotice] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const questionRefs = useRef<Record<string, HTMLElement | null>>({});

  const pageQuestions = getQuestionsForPage(questionMaster, currentPage);
  const firstQuestionNumber = pageQuestions[0]?.displayOrder ?? 1;
  const lastQuestionNumber =
    pageQuestions[pageQuestions.length - 1]?.displayOrder ?? firstQuestionNumber;

  useEffect(() => {
    const applyStateFromLocation = (showNotice: boolean) => {
      const locationState = readLocationState(totalPages);
      const draft = readDiagnosisDraft();
      const nextName = draft?.userName ?? "";
      const nextAnswers = draft?.answers ?? {};
      const nextPage = nextName
        ? clampPage(
            locationState.hasPageQuery
              ? locationState.currentPage
              : draft?.currentPage ?? 1,
            totalPages,
          )
        : 1;

      setUserName(nextName);
      setAnswers(nextAnswers);
      setCurrentPage(nextPage);
      syncUrl(nextPage, "replace");

      if (
        showNotice &&
        draft &&
        Object.keys(draft.answers).length > 0 &&
        !locationState.hasPageQuery
      ) {
        setRestoreNotice("保存していた回答を復元しました。");
      }
    };

    const frame = window.requestAnimationFrame(() => {
      applyStateFromLocation(true);
      setIsHydrated(true);
    });

    const handlePopState = () => {
      applyStateFromLocation(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [totalPages]);

  useEffect(() => {
    if (!isHydrated || !userName) {
      return;
    }

    writeDiagnosisDraft({
      userName,
      answers,
      currentPage,
      updatedAt: new Date().toISOString(),
    });
  }, [answers, currentPage, isHydrated, userName]);

  useEffect(() => {
    if (!isHydrated || !userName) {
      return;
    }

    pageHeadingRef.current?.focus();
  }, [currentPage, isHydrated, userName]);

  function handleAnswerChange(questionId: string, value: number) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value as 1 | 2 | 3 | 4 | 5,
    }));
    setValidationError("");
    setRestoreNotice("");
  }

  function moveToPage(nextPage: number, mode: "push" | "replace") {
    const clamped = clampPage(nextPage, totalPages);
    setCurrentPage(clamped);
    syncUrl(clamped, mode);
    setValidationError("");
    setRestoreNotice("");
  }

  function handlePrevious() {
    moveToPage(currentPage - 1, "push");
  }

  function handleNext() {
    const unansweredQuestions = pageQuestions.filter(
      (question) => !answers[question.questionId],
    );

    if (unansweredQuestions.length > 0) {
      setValidationError("このページの8問すべてに回答してください。");
      questionRefs.current[unansweredQuestions[0].questionId]?.focus();
      return;
    }

    if (currentPage < totalPages) {
      moveToPage(currentPage + 1, "push");
      return;
    }

    const unansweredOverall = activeQuestions.find(
      (question) => !answers[question.questionId],
    );

    if (unansweredOverall) {
      moveToPage(unansweredOverall.pageNo, "push");
      setValidationError("未回答の質問があります。抜けているページへ戻しました。");
      requestAnimationFrame(() => {
        questionRefs.current[unansweredOverall.questionId]?.focus();
      });
      return;
    }

    setIsSubmitting(true);

    const result = calculateDiagnosisResult(questionMaster, answers);
    const key = createShareKey(userName, answers);
    router.push(`/types/${result.typeCode}/${key}`);
  }

  if (!isHydrated) {
    return (
      <section className="surface-panel flex min-h-[320px] items-center justify-center">
        <p className="text-sm text-[color:var(--color-text-subtle)]">
          診断の準備をしています…
        </p>
      </section>
    );
  }

  if (!userName) {
    return (
      <section className="surface-panel flex flex-col gap-4">
        <p className="eyebrow">Diagnosis</p>
        <h1 className="section-title">まずはお名前を入れて診断を始めます</h1>
        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          このページを直接開いた場合は、トップページから診断を開始してください。
        </p>
        <Link href="/" className="primary-button w-full justify-center sm:w-fit">
          トップページへ戻る
        </Link>
      </section>
    );
  }

  if (isSubmitting) {
    return (
      <section className="surface-panel flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
        <div className="loading-mark" aria-hidden="true" />
        <p className="eyebrow">Calculating</p>
        <h1 className="section-title">診断結果を計算しています</h1>
        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          あなたの回答を4軸にまとめています。
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="surface-panel flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="eyebrow">Diagnosis</p>
            <h1
              ref={pageHeadingRef}
              tabIndex={-1}
              className="section-title outline-none"
            >
              {userName}さんの診断
            </h1>
          </div>
          <Link href="/" className="text-sm text-[color:var(--color-accent)] underline-offset-4 hover:underline">
            トップへ戻る
          </Link>
        </div>

        <div aria-live="polite" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>
              ページ {currentPage} / {totalPages}
            </span>
            <span>
              質問 {firstQuestionNumber}〜{lastQuestionNumber} / {totalQuestions}
            </span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div
              className="progress-fill"
              style={{ transform: `scaleX(${currentPage / totalPages})` }}
            />
          </div>
        </div>

        {restoreNotice ? (
          <p className="status-note" role="status">
            {restoreNotice}
          </p>
        ) : null}

        <p className="text-sm leading-7 text-[color:var(--color-text-subtle)]">
          直感で答えてください。あとから前のページへ戻って見直せます。
        </p>
      </div>

      <div className="surface-panel flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">Questions</p>
          <h2 className="section-title">
            質問 {firstQuestionNumber}〜{lastQuestionNumber}
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {pageQuestions.map((question) => {
            const selectedValue = answers[question.questionId];

            return (
              <fieldset key={question.questionId} className="question-block">
                <legend
                  ref={(element) => {
                    questionRefs.current[question.questionId] = element;
                  }}
                  tabIndex={-1}
                  className="question-legend"
                >
                  <span className="question-number">
                    Q{String(question.displayOrder).padStart(2, "0")}
                  </span>
                  <span>{question.questionText}</span>
                </legend>

                <div className="flex flex-col gap-3">
                  {ANSWER_OPTIONS.map((option) => {
                    const checked = selectedValue === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`answer-option ${checked ? "answer-option-selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={question.questionId}
                          value={option.value}
                          checked={checked}
                          onChange={() =>
                            handleAnswerChange(question.questionId, option.value)
                          }
                          className="mt-1 size-4 accent-[color:var(--color-accent)]"
                        />
                        <span className="flex-1">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        {validationError ? (
          <p className="status-note status-note-error" role="alert">
            {validationError}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            className="secondary-button justify-center"
            disabled={currentPage === 1}
          >
            前の8問へ戻る
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="primary-button justify-center"
          >
            {currentPage === totalPages ? "診断結果を見る" : "次の8問へ進む"}
          </button>
        </div>
      </div>
    </section>
  );
}

function readLocationState(totalPages: number): LocationState {
  if (typeof window === "undefined") {
    return {
      currentPage: 1,
      hasPageQuery: false,
    };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    currentPage: clampPage(Number(params.get("page") ?? "1"), totalPages),
    hasPageQuery: params.has("page"),
  };
}

function clampPage(value: number, totalPages: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(totalPages, value));
}

function buildDiagnosisUrl(page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/diagnosis?${query}` : "/diagnosis";
}

function syncUrl(page: number, mode: "push" | "replace") {
  if (typeof window === "undefined") {
    return;
  }

  const url = buildDiagnosisUrl(page);
  if (mode === "push") {
    window.history.pushState(null, "", url);
    return;
  }

  window.history.replaceState(null, "", url);
}
