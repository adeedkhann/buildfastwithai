export const BHASHINI_CACHE_KEY = "janmitra_bhashini_cache";

export type BhashiniTranslationCache = Record<string, string>;

export function createBhashiniCacheKey(sourceLanguage: string, targetLanguage: string, text: string): string {
  return `${sourceLanguage}:${targetLanguage}:${text.trim()}`;
}

export function loadBhashiniCache(): BhashiniTranslationCache {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(BHASHINI_CACHE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as BhashiniTranslationCache
      : {};
  } catch {
    return {};
  }
}

export function saveBhashiniCache(cache: BhashiniTranslationCache): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BHASHINI_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("[BhashiniCache] Could not persist translation cache", error);
  }
}

export function setBhashiniCacheEntries(entries: BhashiniTranslationCache): BhashiniTranslationCache {
  const cache = { ...loadBhashiniCache(), ...entries };
  saveBhashiniCache(cache);
  return cache;
}
