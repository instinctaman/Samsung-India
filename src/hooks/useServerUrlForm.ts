import { useState } from "react";

import {
  DEFAULT_API_URL,
  getStoredServerUrl,
  isUsingDefaultServerUrl,
  resetServerUrl,
  setServerUrl,
} from "@/config/serverUrl";

type TestState = "idle" | "testing" | "ok" | "fail";

/** Backs the "Server URL" settings sheet (gear on the role screen). */
export function useServerUrlForm(onClose: () => void) {
  const [url, setUrl] = useState(getStoredServerUrl());
  const [test, setTest] = useState<TestState>("idle");
  const [isDefault, setIsDefault] = useState(isUsingDefaultServerUrl());

  const normalized = () => (/^https?:\/\//i.test(url.trim()) ? url.trim() : `http://${url.trim()}`).replace(/\/+$/, "");

  const handleTest = async () => {
    setTest("testing");
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(`${normalized()}/`, { signal: ctrl.signal });
      clearTimeout(t);
      setTest(res.ok ? "ok" : "fail");
    } catch {
      setTest("fail");
    }
  };

  const handleSave = () => {
    const saved = setServerUrl(url);
    setUrl(saved);
    setIsDefault(saved === DEFAULT_API_URL);
    onClose();
  };

  const handleReset = () => {
    const d = resetServerUrl();
    setUrl(d);
    setIsDefault(true);
    setTest("idle");
  };

  return {
    url,
    setUrl: (v: string) => {
      setUrl(v);
      setTest("idle");
    },
    test,
    isDefault,
    defaultUrl: DEFAULT_API_URL,
    handleTest,
    handleSave,
    handleReset,
  };
}
