export interface BhashiniLanguage {
  isoCode: string;
  bhashiniCode: string;
  nativeName: string;
  englishName: string;
}

export const BHASHINI_LANGUAGES: readonly BhashiniLanguage[] = [
  { isoCode: "as", bhashiniCode: "as", nativeName: "অসমীয়া", englishName: "Assamese" },
  { isoCode: "bn", bhashiniCode: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { isoCode: "brx", bhashiniCode: "brx", nativeName: "बर'", englishName: "Bodo" },
  { isoCode: "doi", bhashiniCode: "doi", nativeName: "डोगरी", englishName: "Dogri" },
  { isoCode: "en", bhashiniCode: "en", nativeName: "English", englishName: "English" },
  { isoCode: "gu", bhashiniCode: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati" },
  { isoCode: "hi", bhashiniCode: "hi", nativeName: "हिंदी", englishName: "Hindi" },
  { isoCode: "kn", bhashiniCode: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada" },
  { isoCode: "ks", bhashiniCode: "ks", nativeName: "कॉशुर", englishName: "Kashmiri" },
  { isoCode: "kok", bhashiniCode: "kok", nativeName: "कोंकणी", englishName: "Konkani" },
  { isoCode: "mai", bhashiniCode: "mai", nativeName: "मैथिली", englishName: "Maithili" },
  { isoCode: "ml", bhashiniCode: "ml", nativeName: "മലയാളം", englishName: "Malayalam" },
  { isoCode: "mni", bhashiniCode: "mni", nativeName: "মৈতৈলোন্", englishName: "Manipuri / Meitei" },
  { isoCode: "mr", bhashiniCode: "mr", nativeName: "मराठी", englishName: "Marathi" },
  { isoCode: "ne", bhashiniCode: "ne", nativeName: "नेपाली", englishName: "Nepali" },
  { isoCode: "or", bhashiniCode: "or", nativeName: "ଓଡ଼ିଆ", englishName: "Odia" },
  { isoCode: "pa", bhashiniCode: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { isoCode: "sa", bhashiniCode: "sa", nativeName: "संस्कृतम्", englishName: "Sanskrit" },
  { isoCode: "sat", bhashiniCode: "sat", nativeName: "संथाली", englishName: "Santali" },
  { isoCode: "sd", bhashiniCode: "sd", nativeName: "सिंधी", englishName: "Sindhi" },
  { isoCode: "ta", bhashiniCode: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { isoCode: "te", bhashiniCode: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { isoCode: "ur", bhashiniCode: "ur", nativeName: "اردو", englishName: "Urdu" },
];

export type BhashiniLanguageCode = (typeof BHASHINI_LANGUAGES)[number]["isoCode"];

export function getBhashiniLanguage(code: string | undefined): BhashiniLanguage {
  return BHASHINI_LANGUAGES.find((language) => language.isoCode === code) ?? BHASHINI_LANGUAGES[4];
}