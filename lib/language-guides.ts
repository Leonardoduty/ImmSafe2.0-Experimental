// Multi-language survival guides
export interface LanguageGuide {
  language: string
  code: string
  title: string
  phrases: {
    category: string
    items: Array<{ english: string; translation: string; phonetic?: string }>
  }[]
}

/**
 * Survival phrases and guides in multiple languages
 */
export const LANGUAGE_GUIDES: Record<string, LanguageGuide> = {
  arabic: {
    language: "Arabic",
    code: "ar",
    title: "دليل البقاء على قيد الحياة",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "مساعدة", phonetic: "musa'ada" },
          { english: "I need water", translation: "أحتاج ماء", phonetic: "ahtaj ma'an" },
          { english: "I am lost", translation: "أنا ضائع", phonetic: "ana da'i" },
          { english: "Where is the hospital?", translation: "أين المستشفى؟", phonetic: "ayna al-mustashfa?" },
          { english: "I need food", translation: "أحتاج طعام", phonetic: "ahtaj ta'am" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "أين...؟", phonetic: "ayna...?" },
          { english: "How far?", translation: "كم المسافة؟", phonetic: "kam al-masafa?" },
          { english: "Left", translation: "يسار", phonetic: "yasar" },
          { english: "Right", translation: "يمين", phonetic: "yamin" },
          { english: "Straight", translation: "مستقيم", phonetic: "mustaqim" },
        ],
      },
    ],
  },
  turkish: {
    language: "Turkish",
    code: "tr",
    title: "Hayatta Kalma Rehberi",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "Yardım", phonetic: "yar-dim" },
          { english: "I need water", translation: "Suya ihtiyacım var", phonetic: "su-ya ih-ti-ya-jim var" },
          { english: "I am lost", translation: "Kayboldum", phonetic: "kay-bol-dum" },
          { english: "Where is the hospital?", translation: "Hastane nerede?", phonetic: "has-ta-ne ne-re-de?" },
          { english: "I need food", translation: "Yemeğe ihtiyacım var", phonetic: "ye-me-ge ih-ti-ya-jim var" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "... nerede?", phonetic: "... ne-re-de?" },
          { english: "How far?", translation: "Ne kadar uzak?", phonetic: "ne ka-dar u-zak?" },
          { english: "Left", translation: "Sol", phonetic: "sol" },
          { english: "Right", translation: "Sağ", phonetic: "sağ" },
          { english: "Straight", translation: "Düz", phonetic: "duz" },
        ],
      },
    ],
  },
  french: {
    language: "French",
    code: "fr",
    title: "Guide de Survie",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "Aide", phonetic: "ed" },
          { english: "I need water", translation: "J'ai besoin d'eau", phonetic: "zhay buh-zwan doh" },
          { english: "I am lost", translation: "Je suis perdu", phonetic: "zhuh swee per-doo" },
          { english: "Where is the hospital?", translation: "Où est l'hôpital?", phonetic: "oo ay loh-pee-tal?" },
          { english: "I need food", translation: "J'ai besoin de nourriture", phonetic: "zhay buh-zwan duh noo-ree-tur" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "Où est...?", phonetic: "oo ay...?" },
          { english: "How far?", translation: "À quelle distance?", phonetic: "ah kel dis-tans?" },
          { english: "Left", translation: "Gauche", phonetic: "gohsh" },
          { english: "Right", translation: "Droite", phonetic: "drwat" },
          { english: "Straight", translation: "Tout droit", phonetic: "too drwa" },
        ],
      },
    ],
  },
  kurdish: {
    language: "Kurdish",
    code: "ku",
    title: "رێنمایی مانەوە",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "یارمەتی", phonetic: "yar-meti" },
          { english: "I need water", translation: "ئاو پێویستە", phonetic: "aw pe-wis-te" },
          { english: "I am lost", translation: "گومانم", phonetic: "gu-man-im" },
          { english: "Where is the hospital?", translation: "نەخۆشخانە لە کوێیە?", phonetic: "ne-khosh-kha-ne le kwe-ye?" },
          { english: "I need food", translation: "خواردن پێویستە", phonetic: "khwar-din pe-wis-te" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "... لە کوێیە?", phonetic: "... le kwe-ye?" },
          { english: "How far?", translation: "چەند دوورە?", phonetic: "chen dur-e?" },
          { english: "Left", translation: "چەپ", phonetic: "chep" },
          { english: "Right", translation: "ڕاست", phonetic: "rast" },
          { english: "Straight", translation: "راست", phonetic: "rast" },
        ],
      },
    ],
  },
  farsi: {
    language: "Farsi",
    code: "fa",
    title: "راهنمای بقا",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "کمک", phonetic: "komak" },
          { english: "I need water", translation: "من به آب نیاز دارم", phonetic: "man be ab niaz daram" },
          { english: "I am lost", translation: "من گم شده‌ام", phonetic: "man gom shode-am" },
          { english: "Where is the hospital?", translation: "بیمارستان کجاست؟", phonetic: "bimarestan kojast?" },
          { english: "I need food", translation: "من به غذا نیاز دارم", phonetic: "man be ghaza niaz daram" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "... کجاست؟", phonetic: "... kojast?" },
          { english: "How far?", translation: "چقدر دور است؟", phonetic: "cheghadr dur ast?" },
          { english: "Left", translation: "چپ", phonetic: "chap" },
          { english: "Right", translation: "راست", phonetic: "rast" },
          { english: "Straight", translation: "مستقیم", phonetic: "mostaghim" },
        ],
      },
    ],
  },
  urdu: {
    language: "Urdu",
    code: "ur",
    title: "زندہ رہنے کی رہنمائی",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "مدد", phonetic: "madad" },
          { english: "I need water", translation: "مجھے پانی چاہیے", phonetic: "mujhe pani chahiye" },
          { english: "I am lost", translation: "میں کھو گیا ہوں", phonetic: "main kho gaya hoon" },
          { english: "Where is the hospital?", translation: "ہسپتال کہاں ہے؟", phonetic: "hospital kahan hai?" },
          { english: "I need food", translation: "مجھے کھانا چاہیے", phonetic: "mujhe khana chahiye" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "... کہاں ہے؟", phonetic: "... kahan hai?" },
          { english: "How far?", translation: "کتنا دور؟", phonetic: "kitna dur?" },
          { english: "Left", translation: "بائیں", phonetic: "bain" },
          { english: "Right", translation: "دائیں", phonetic: "dain" },
          { english: "Straight", translation: "سیدھا", phonetic: "seedha" },
        ],
      },
    ],
  },
  russian: {
    language: "Russian",
    code: "ru",
    title: "Руководство по выживанию",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "Помощь", phonetic: "po-moshch" },
          { english: "I need water", translation: "Мне нужна вода", phonetic: "mne nuzhna vo-da" },
          { english: "I am lost", translation: "Я заблудился", phonetic: "ya za-blu-dil-sya" },
          { english: "Where is the hospital?", translation: "Где больница?", phonetic: "gde bol-ni-tsa?" },
          { english: "I need food", translation: "Мне нужна еда", phonetic: "mne nuzhna ye-da" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "Где...?", phonetic: "gde...?" },
          { english: "How far?", translation: "Как далеко?", phonetic: "kak da-le-ko?" },
          { english: "Left", translation: "Влево", phonetic: "vle-vo" },
          { english: "Right", translation: "Вправо", phonetic: "vpra-vo" },
          { english: "Straight", translation: "Прямо", phonetic: "prya-mo" },
        ],
      },
    ],
  },
  ukrainian: {
    language: "Ukrainian",
    code: "uk",
    title: "Посібник з виживання",
    phrases: [
      {
        category: "Emergency",
        items: [
          { english: "Help", translation: "Допомога", phonetic: "do-po-mo-ha" },
          { english: "I need water", translation: "Мені потрібна вода", phonetic: "me-ni pot-rib-na vo-da" },
          { english: "I am lost", translation: "Я заблукав", phonetic: "ya za-blu-kav" },
          { english: "Where is the hospital?", translation: "Де лікарня?", phonetic: "de lik-ar-nya?" },
          { english: "I need food", translation: "Мені потрібна їжа", phonetic: "me-ni pot-rib-na yi-zha" },
        ],
      },
      {
        category: "Directions",
        items: [
          { english: "Where is...?", translation: "Де...?", phonetic: "de...?" },
          { english: "How far?", translation: "Як далеко?", phonetic: "yak da-le-ko?" },
          { english: "Left", translation: "Ліворуч", phonetic: "li-vo-ruch" },
          { english: "Right", translation: "Праворуч", phonetic: "pra-vo-ruch" },
          { english: "Straight", translation: "Прямо", phonetic: "prya-mo" },
        ],
      },
    ],
  },
}

/**
 * Get language guide by code
 */
export function getLanguageGuide(code: string): LanguageGuide | undefined {
  return LANGUAGE_GUIDES[code.toLowerCase()]
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): LanguageGuide[] {
  return Object.values(LANGUAGE_GUIDES)
}


