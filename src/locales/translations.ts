export type TranslationKey =
  | "heroTitle"
  | "heroTitleAccent"
  | "heroDescription"
  | "goToDashboard"
  | "fileComplaint"
  | "myComplaints"
  | "complaintsFiledToday"
  | "issuesResolved"
  | "loginPlatform"
  | "loginGateway"
  | "officerConsole"
  | "adminPanel"
  | "returnToRoleGate"
  | "officialEmail"
  | "securityPasskey"
  | "authorizeConsole"
  | "forgotPassword"
  | "verifiedMetrics"
  | "transforming"
  | "governance"
  | "atScale"
  | "recentResolvedGrievances"
  | "liveDatabaseCounter"
  | "empoweringCitizens"
  | "smartGovernance"
  | "everythingYouNeedFor"
  | "tabNewComplaint"
  | "tabMyComplaints"
  | "tabTrackComplaint"
  | "tabAiChatbot";

export const UI_TRANSLATIONS: Record<string, Partial<Record<TranslationKey, string>>> = {
  en: {
    heroTitle: "Fixing Citizen Grievances",
    heroTitleAccent: "with Next-Gen AI Routing",
    heroDescription: "Resolve municipal issues in seconds. JanMitra parses complaints in Hindi or Hinglish, detects severity levels, and smart-routes to nodal officers automatically.",
    goToDashboard: "Go to Dashboard",
    fileComplaint: "File a Complaint",
    myComplaints: "My Complaints",
    complaintsFiledToday: "Complaints Filed Today",
    issuesResolved: "Issues Resolved",
    loginPlatform: "Autonomous Smart Governance Platform",
    loginGateway: "Authorized access gateway for administrative authorities and department superintendents.",
    officerConsole: "Officer Console",
    adminPanel: "Admin Panel",
    returnToRoleGate: "Return to Role Gate",
    officialEmail: "Official Email ID / Node Identifier",
    securityPasskey: "Security Passkey / Code",
    authorizeConsole: "Authorize & Launch Console",
    forgotPassword: "Forgot password?",
    verifiedMetrics: "Verified Metrics",
    transforming: "Transforming",
    governance: "Governance",
    atScale: "at Scale",
    recentResolvedGrievances: "Recent Resolved Grievances",
    liveDatabaseCounter: "LIVE DATABASE COUNTER",
    empoweringCitizens: "Empowering Citizens",
    smartGovernance: "Smart Governance",
    everythingYouNeedFor: "Everything You Need for",
    tabNewComplaint: "NEW COMPLAINT",
    tabMyComplaints: "MY COMPLAINTS",
    tabTrackComplaint: "TRACK COMPLAINT",
    tabAiChatbot: "AI CHATBOT",
  },
  hi: {
    heroTitle: "नागरिक शिकायतों का समाधान",
    heroTitleAccent: "अगली पीढ़ी के AI रूटिंग के साथ",
    heroDescription: "नगरपालिका समस्याओं का कुछ ही सेकंड में समाधान करें। जनमित्र हिंदी या हिंग्लिश में शिकायतें समझकर गंभीरता पहचानता है और उन्हें सही अधिकारी तक भेजता है।",
    goToDashboard: "डैशबोर्ड पर जाएं",
    fileComplaint: "शिकायत दर्ज करें",
    myComplaints: "मेरी शिकायतें",
    complaintsFiledToday: "आज दर्ज शिकायतें",
    issuesResolved: "समस्याओं का समाधान",
    loginPlatform: "स्वायत्त स्मार्ट शासन मंच",
    loginGateway: "प्रशासनिक अधिकारियों और विभागीय अधीक्षकों के लिए अधिकृत प्रवेश द्वार।",
    officerConsole: "अधिकारी कंसोल",
    adminPanel: "प्रशासक पैनल",
    returnToRoleGate: "भूमिका चयन पर लौटें",
    officialEmail: "आधिकारिक ईमेल आईडी / नोड पहचानकर्ता",
    securityPasskey: "सुरक्षा पासकी / कोड",
    authorizeConsole: "अधिकृत करें और कंसोल खोलें",
    forgotPassword: "पासवर्ड भूल गए?",
    verifiedMetrics: "सत्यापित आंकड़े",
    transforming: "रूपांतरण",
    governance: "सुशासन",
    atScale: "व्यापक स्तर पर",
    recentResolvedGrievances: "हाल ही में हल की गई शिकायतें",
    liveDatabaseCounter: "लाइव डेटाबेस काउंटर",
    empoweringCitizens: "नागरिकों का सशक्तिकरण",
    smartGovernance: "स्मार्ट गवर्नेंस",
    everythingYouNeedFor: "आपकी हर जरूरत के लिए",
    tabNewComplaint: "नई शिकायत",
    tabMyComplaints: "मेरी शिकायतें",
    tabTrackComplaint: "शिकायत ट्रैक करें",
    tabAiChatbot: "AI चैटबॉट",
  },
  bn: {
    heroTitle: "নাগরিক অভিযোগের সমাধান",
    heroTitleAccent: "নতুন প্রজন্মের AI রাউটিংয়ের মাধ্যমে",
    heroDescription: "কয়েক সেকেন্ডে পৌর সমস্যার সমাধান করুন। জনমিত্র হিন্দি বা হিংলিশে অভিযোগ বুঝে গুরুত্ব শনাক্ত করে সঠিক আধিকারিকের কাছে পাঠায়।",
    goToDashboard: "ড্যাশবোর্ডে যান",
    fileComplaint: "অভিযোগ দাখিল করুন",
    myComplaints: "আমার অভিযোগ",
    complaintsFiledToday: "আজ দাখিল করা অভিযোগ",
    issuesResolved: "সমাধান হওয়া সমস্যা",
    loginPlatform: "স্বয়ংক্রিয় স্মার্ট গভর্নেন্স প্ল্যাটফর্ম",
    loginGateway: "প্রশাসনিক কর্তৃপক্ষ ও বিভাগীয় সুপারিনটেনডেন্টদের জন্য অনুমোদিত প্রবেশদ্বার।",
    officerConsole: "অফিসার কনসোল",
    adminPanel: "অ্যাডমিন প্যানেল",
    returnToRoleGate: "ভূমিকা নির্বাচনে ফিরুন",
    officialEmail: "সরকারি ইমেল আইডি / নোড শনাক্তকারী",
    securityPasskey: "নিরাপত্তা পাসকি / কোড",
    authorizeConsole: "অনুমোদন করে কনসোল চালু করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    tabNewComplaint: "নতুন অভিযোগ",
    tabMyComplaints: "আমার অভিযোগ",
    tabTrackComplaint: "অভিযোগ ট্র্যাক করুন",
    tabAiChatbot: "AI চ্যাটবট",
  },
};

export function getLocalTranslation(key: TranslationKey, language: string): string | undefined {
  return UI_TRANSLATIONS[language]?.[key];
}

export function findLocalTranslationBySource(text: string, language: string): string | undefined {
  if (!text || language === "en") return text;
  const enTranslations = UI_TRANSLATIONS.en;
  if (!enTranslations) return undefined;

  const matchKey = (Object.keys(enTranslations) as TranslationKey[]).find(
    (k) => enTranslations[k]?.toLowerCase().trim() === text.toLowerCase().trim(),
  );

  if (matchKey && UI_TRANSLATIONS[language]?.[matchKey]) {
    return UI_TRANSLATIONS[language]![matchKey];
  }

  return undefined;
}