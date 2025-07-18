/**
 * Supprime les caractères d’espace invisibles (\u00A0, \u200B, …)
 * pour éviter la règle ESLint : no‑irregular‑whitespace
 */
import fs from "fs";
import { globSync } from "glob";

const BAD =
  /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;

// Liste tous les fichiers source à nettoyer
const files = globSync("src/**/*.{js,jsx,ts,tsx}", { nodir: true });

files.forEach((file) => {
  const text = fs.readFileSync(file, "utf8");
  if (!BAD.test(text)) return;               // aucun caractère suspect

  fs.writeFileSync(file, text.replace(BAD, " "));
  console.log("✅ cleaned", file);
});
