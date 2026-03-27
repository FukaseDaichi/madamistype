"use client";

import { useEffect } from "react";

import { clearPostDiagnosisResultCookie } from "@/lib/post-diagnosis-result";

type PostDiagnosisResultCookieCleanupProps = {
  typeCode: string;
  shareKey: string;
};

export function PostDiagnosisResultCookieCleanup({
  typeCode,
  shareKey,
}: PostDiagnosisResultCookieCleanupProps) {
  useEffect(() => {
    clearPostDiagnosisResultCookie(typeCode, shareKey);
  }, [shareKey, typeCode]);

  return null;
}
