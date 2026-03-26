let dictionaries = {};

function detectLanguage(header = "") {
  const lang = header.toLowerCase();
  if (lang.startsWith("nb") || lang.startsWith("no")) return "no";
  if (lang.startsWith("en")) return "en";
  return "en";
}

function getNested(obj, keyPath) {
  return keyPath.split(".").reduce((o, k) => o?.[k], obj);
}

export async function loadTranslations() {
  const [enRes, noRes] = await Promise.all([
    fetch("/i18n-l10n/en.json"),
    fetch("/i18n-l10n/no.json"),
  ]);

  dictionaries.en = await enRes.json();
  dictionaries.no = await noRes.json();
}

export function translate(header, key) {
  const lang = detectLanguage(header);
  const dict = dictionaries[lang] || dictionaries.en || {};
  return getNested(dict, key) || key;
}

export function applyTranslations(root = document) {
  const lang = navigator.language;

  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = translate(lang, key);
  });

  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translate(lang, key);
  });
}
