/* eslint-disable no-irregular-whitespace */
/**
 * Strip Weird Spaces – remplace les caractères d’espace invisibles
 * (\u00A0, \u200B, …) par un espace normal pour satisfaire ESLint.
 */
import fs from "fs";
import { globSync } from "glob";

const BAD =
  /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;

// Parcourt tous les fichiers JS/TS du dossier src
const files = globSync("src/**/*.{js,jsx,ts,tsx}", { nodir: true });

files.forEach((file) => {
  const text = fs.readFileSync(file, "utf8");
  if (!BAD.test(text)) return;          // aucun caractère suspect

  fs.writeFileSync(file, text.replace(BAD, " "));
  console.log("✅ cleaned", file);
});
