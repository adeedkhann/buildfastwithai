"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getBhashiniLanguage, BHASHINI_LANGUAGES, type BhashiniLanguage } from "@/config/languages";
import {
  getLocalTranslation,
  findLocalTranslationBySource,
  UI_TRANSLATIONS,
  type TranslationKey,
} from "@/locales/translations";
import {
  createBhashiniCacheKey,
  loadBhashiniCache,
  saveBhashiniCache,
} from "@/lib/bhashiniCache";

const STORAGE_KEY_LANGUAGE = "janmitra-language";
const LEGACY_STORAGE_KEY_CACHE = "janmitra-translation-cache";

interface LanguageContextValue {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  t: (text: string, sourceLanguage?: string) => string;
  translateText: (text: string, targetLang?: string, sourceLang?: string) => Promise<string>;
  getText: (key: TranslationKey, fallback?: string) => string;
  isTranslating: boolean;
  languages: readonly BhashiniLanguage[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<string>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [cacheVersion, setCacheVersion] = useState<number>(0);

  const cacheRef = useRef<Record<string, string>>({});
  const cacheReadyRef = useRef(false);
  const pendingRequestsRef = useRef<Set<string>>(new Set());
  const failedRequestsRef = useRef<Map<string, number>>(new Map());
  const pendingNetworkCountRef = useRef(0);
  const loaderUpdateScheduledRef = useRef(false);
  const batchQueueRef = useRef<Map<string, { sourceLang: string; targetLang: string; text: string }>>(new Map());
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageLoaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize localStorage cache on mount
  useEffect(() => {
    try {
      const legacyCache = window.localStorage.getItem(LEGACY_STORAGE_KEY_CACHE);
      const parsedLegacy = legacyCache ? JSON.parse(legacyCache) : {};
      cacheRef.current = { ...parsedLegacy, ...loadBhashiniCache() };
      Object.entries(cacheRef.current).forEach(([key, value]) => {
        const firstSeparator = key.indexOf(":");
        const secondSeparator = key.indexOf(":", firstSeparator + 1);
        const source = key.slice(0, firstSeparator);
        const target = key.slice(firstSeparator + 1, secondSeparator);
        const original = key.slice(secondSeparator + 1);
        if (source && target && source !== target && value.trim() === original.trim()) {
          delete cacheRef.current[key];
        }
      });
      saveBhashiniCache(cacheRef.current);
      cacheReadyRef.current = true;
      setCacheVersion((version) => version + 1);
    } catch (e) {
      console.warn("[LanguageContext] Could not parse translation cache:", e);
      cacheRef.current = {};
      cacheReadyRef.current = true;
    }
  }, []);

  // Initialize and sync language preference
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (saved) {
      const langObj = getBhashiniLanguage(saved);
      startTransition(() => {
        setCurrentLanguageState(langObj.isoCode);
        document.documentElement.lang = langObj.isoCode;
      });
    }

    const handleLanguageChange = () => {
      const next = window.localStorage.getItem(STORAGE_KEY_LANGUAGE);
      if (next) {
        const langObj = getBhashiniLanguage(next);
        startTransition(() => {
          setCurrentLanguageState(langObj.isoCode);
          document.documentElement.lang = langObj.isoCode;
        });
      }
    };

    window.addEventListener("janmitra-language-change", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("janmitra-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const persistCache = () => saveBhashiniCache(cacheRef.current);

  const setCurrentLanguage = (language: string) => {
    const langObj = getBhashiniLanguage(language);
    const code = langObj.isoCode;
    if (code === currentLanguage) return;
    failedRequestsRef.current.clear();

    // Show the loader immediately for uncached language switches. Any queued
    // batch will keep it alive; cached/local strings never block the UI.
    const knownSourceTexts = Object.values(UI_TRANSLATIONS.en);
    const isWarm = code === "en" || knownSourceTexts.every((sourceText) => {
      const local = findLocalTranslationBySource(sourceText, code);
      const cacheKey = createBhashiniCacheKey("en", code, sourceText);
      return Boolean(local || cacheRef.current[cacheKey]);
    });
    setIsTranslating(!isWarm);
    if (languageLoaderTimeoutRef.current) clearTimeout(languageLoaderTimeoutRef.current);
    languageLoaderTimeoutRef.current = setTimeout(() => {
      if (pendingNetworkCountRef.current === 0 && batchQueueRef.current.size === 0) {
        setIsTranslating(false);
      }
    }, 250);

    setCurrentLanguageState(code);
    window.localStorage.setItem(STORAGE_KEY_LANGUAGE, code);
    document.documentElement.lang = code;
    window.dispatchEvent(new Event("janmitra-language-change"));
  };

  // Programmatic translation function for single string with cache
  const translateText = useCallback(
    async (text: string, targetLang = currentLanguage, sourceLang = "en"): Promise<string> => {
      if (!text || targetLang === sourceLang) return text;

      const cacheKey = createBhashiniCacheKey(sourceLang, targetLang, text);
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }

      // Check local dictionary
      const localDirect = findLocalTranslationBySource(text, targetLang);
      if (localDirect && localDirect !== text) {
        cacheRef.current[cacheKey] = localDirect;
        return localDirect;
      }

      pendingNetworkCountRef.current += 1;
      setIsTranslating(true);
      try {
        const response = await fetch("/api/bhashini/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = (await response.json()) as { text?: string | string[]; translations?: string[]; isFallback?: boolean };
        const result = Array.isArray(data.translations) ? data.translations[0] : Array.isArray(data.text) ? data.text[0] : data.text || text;

        if (data.isFallback || result === text) {
          failedRequestsRef.current.set(cacheKey, Date.now());
        } else {
          cacheRef.current[cacheKey] = result;
          persistCache();
          setCacheVersion((v) => v + 1);
        }
        return result;
      } catch (err) {
        console.warn("[LanguageContext] translateText failed, returning fallback:", err);
        failedRequestsRef.current.set(cacheKey, Date.now());
        return text;
      } finally {
        pendingNetworkCountRef.current = Math.max(0, pendingNetworkCountRef.current - 1);
        if (pendingNetworkCountRef.current === 0 && batchQueueRef.current.size === 0) {
          setIsTranslating(false);
        }
      }
    },
    [currentLanguage],
  );

  // Process batch translation requests in debounced queue
  const processBatchQueue = useCallback(async () => {
    if (batchQueueRef.current.size === 0) return;

    const queuedItems = Array.from(batchQueueRef.current.values());
    batchQueueRef.current.clear();

    // Group items by targetLang and sourceLang
    const groups = new Map<string, { sourceLang: string; targetLang: string; texts: string[] }>();
    for (const item of queuedItems) {
      const groupKey = `${item.sourceLang}->${item.targetLang}`;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { sourceLang: item.sourceLang, targetLang: item.targetLang, texts: [] });
      }
      groups.get(groupKey)!.texts.push(item.text);
    }

    pendingNetworkCountRef.current += 1;
    setIsTranslating(true);

    try {
      await Promise.all(
        Array.from(groups.values()).map(async (group) => {
          const uniqueTexts = Array.from(new Set(group.texts));
          if (uniqueTexts.length === 0) return;

          console.info(`[LanguageContext] Dispatching batch translation (${uniqueTexts.length} items) -> ${group.targetLang}`);

          try {
            const response = await fetch("/api/bhashini/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: uniqueTexts,
                sourceLanguage: group.sourceLang,
                targetLanguage: group.targetLang,
              }),
            });

            if (!response.ok) throw new Error(`Batch translation failed: ${response.status}`);
            const data = (await response.json()) as { text?: string[] | string; translations?: string[]; isFallback?: boolean };
            const results = Array.isArray(data.translations)
              ? data.translations
              : Array.isArray(data.text)
                ? data.text
                : [data.text || ""];

            uniqueTexts.forEach((originalText, idx) => {
              const translated = results[idx] || originalText;
              const cacheKey = createBhashiniCacheKey(group.sourceLang, group.targetLang, originalText);
              if (data.isFallback || translated === originalText) {
                failedRequestsRef.current.set(cacheKey, Date.now());
              } else {
                cacheRef.current[cacheKey] = translated;
              }
              pendingRequestsRef.current.delete(cacheKey);
            });
          } catch (error) {
            console.warn("[LanguageContext] Batch translation error:", error);
            uniqueTexts.forEach((originalText) => {
              const cacheKey = createBhashiniCacheKey(group.sourceLang, group.targetLang, originalText);
              pendingRequestsRef.current.delete(cacheKey);
              failedRequestsRef.current.set(cacheKey, Date.now());
            });
          }
        }),
      );

      persistCache();
      setCacheVersion((v) => v + 1);
    } finally {
      pendingNetworkCountRef.current = Math.max(0, pendingNetworkCountRef.current - 1);
      if (pendingNetworkCountRef.current === 0 && batchQueueRef.current.size === 0) {
        setIsTranslating(false);
      }
    }
  }, []);

  // Smart dynamic translation function `t(text)`
  const t = useCallback(
    (text: string, sourceLanguage = "en"): string => {
      if (!text || typeof text !== "string") return "";
      const trimmed = text.trim();
      if (!trimmed) return text;

      // 1. If English selected, return original string directly
      if (currentLanguage === sourceLanguage) {
        return text;
      }

      // 2. Check local dictionary
      const local = findLocalTranslationBySource(trimmed, currentLanguage);
      if (local && local !== trimmed) {
        return local;
      }

      // 3. Check memory & localStorage cache
      if (!cacheReadyRef.current) return text;

      const cacheKey = createBhashiniCacheKey(sourceLanguage, currentLanguage, trimmed);
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }
      const failedAt = failedRequestsRef.current.get(cacheKey);
      if (failedAt && Date.now() - failedAt < 30_000) {
        return text;
      }

      // 4. If not in cache, queue for asynchronous Bhashini live translation
      if (!pendingRequestsRef.current.has(cacheKey)) {
        pendingRequestsRef.current.add(cacheKey);
        // t() can run during JSX evaluation. Defer the loader update so it
        // never updates LanguageProvider during a child render.
        if (!loaderUpdateScheduledRef.current) {
          loaderUpdateScheduledRef.current = true;
          setTimeout(() => {
            loaderUpdateScheduledRef.current = false;
            if (pendingRequestsRef.current.size > 0) {
              setIsTranslating(true);
            }
          }, 0);
        }
        batchQueueRef.current.set(cacheKey, {
          sourceLang: sourceLanguage,
          targetLang: currentLanguage,
          text: trimmed,
        });

        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }
        batchTimeoutRef.current = setTimeout(() => {
          void processBatchQueue();
        }, 50);
      }

      // Return original text as immediate placeholder while background translation is in-flight
      return text;
    },
    [currentLanguage, processBatchQueue, cacheVersion],
  );

  const getText = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      if (currentLanguage === "en") {
        return UI_TRANSLATIONS.en[key] || fallback || key;
      }

      const localText = getLocalTranslation(key, currentLanguage);
      if (localText) return localText;

      const sourceText = UI_TRANSLATIONS.en[key] || fallback || key;
      const cacheKey = createBhashiniCacheKey("en", currentLanguage, sourceText);
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }

      // Queue translation
      return t(sourceText, "en");
    },
    [currentLanguage, t, cacheVersion],
  );

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        t,
        translateText,
        getText,
        isTranslating,
        languages: BHASHINI_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const useTranslation = useLanguage;

export function useLocalizedText(sourceText: string, key?: TranslationKey) {
  const { t, getText } = useLanguage();
  return key ? getText(key, sourceText) : t(sourceText);
}
