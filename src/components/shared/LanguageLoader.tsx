"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Languages, Loader2 } from "lucide-react";
import { getBhashiniLanguage } from "@/config/languages";
import { useLanguage } from "./LanguageContext";

export function LanguageLoader() {
  const { currentLanguage, isTranslating } = useLanguage();
  const language = getBhashiniLanguage(currentLanguage);

  return (
    <AnimatePresence>
      {isTranslating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-none fixed left-1/2 top-2 z-100 flex -translate-x-1/2 items-center gap-2 overflow-hidden rounded-full border border-cyan-400/20 bg-slate-950/85 px-3 py-1.5 text-[11px] font-semibold text-slate-200 shadow-[0_8px_30px_rgba(8,15,35,0.35)] backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <span className="absolute inset-x-5 -top-px h-px animate-pulse bg-linear-to-r from-transparent via-cyan-300 to-transparent" />
          <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/15 text-cyan-300">
            <Languages className="h-3 w-3" />
            <Loader2 className="absolute h-5 w-5 animate-spin text-indigo-400/80" />
          </span>
          <span>Translating to {language.englishName}...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
