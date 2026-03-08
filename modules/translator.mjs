import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const enPath = path.join(dirname, "../public/i18n-l10n/en.json");
const noPath = path.join(dirname, "../public/i18n-l10n/no.json");

const dictionaries = {
  en: JSON.parse(fs.readFileSync(enPath, "utf-8")),
  no: JSON.parse(fs.readFileSync(noPath, "utf-8")),
};

function detectLanguage(header = "") {
  const lang = header.toLowerCase();
  if (lang.startsWith("nb") || lang.startsWith("no")) return "no";
  if (lang.startsWith("en")) return "en";
  return "en";
}

function getNested(obj, keyPath) {
  return keyPath.split(".").reduce((o, k) => o?.[k], obj);
}

export function translate(header, key) {
  const lang = detectLanguage(header);
  const dict = dictionaries[lang] || dictionaries.en;
  return getNested(dict, key) || key;
}