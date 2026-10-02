"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Languages, Search } from "lucide-react";
import { BHASHINI_LANGUAGES } from "@/config/languages";
import { Input } from "@/components/ui/input";
import { useLanguage } from "./LanguageContext";

export function LanguageDropdown() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = BHASHINI_LANGUAGES.find((language) => language.isoCode === currentLanguage) ?? BHASHINI_LANGUAGES[4];
  const filtered = useMemo(() => BHASHINI_LANGUAGES.filter((language) => `${language.englishName} ${language.nativeName}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const handleLanguageSelect = (languageCode: string) => {
    // setCurrentLanguage starts the loader before the render caused by the
    // language change; t() only queues work and never mutates state in render.
    setCurrentLanguage(languageCode);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 text-xs font-bold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200" aria-expanded={open}>
        <Languages className="h-4 w-4 text-violet-500" />
        <span>{current.nativeName}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close language menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search languages" className="h-9 pl-9" autoFocus />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {filtered.map((language) => (
                <button key={language.isoCode} type="button" onClick={() => handleLanguageSelect(language.isoCode)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-violet-500/10">
                  <span><span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{language.englishName}</span><span className="text-xs text-slate-500 dark:text-slate-400">{language.nativeName}</span></span>
                  {currentLanguage === language.isoCode && <Check className="h-4 w-4 text-violet-500" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}