/**
 * Remplace tous les espaces invisibles (\u00A0, \u200B…) par un
 * espace standard afin d’éviter l’erreur ESLint « no‑irregular‑whitespace ».
 */
import fs from "fs";
import glob from "glob";

const PATTERN =
  /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;

const files = glob.sync("src/**/*.{js,jsx,ts,tsx}");

files.forEach((file) => {
  const txt = fs.readFileSync(file, "utf8");
  if (!PATTERN.test(txt)) return;

  fs.writeFileSync(file, txt.replace(PATTERN, " "));
  console.log("✅ cleaned", file);
});
