/* eslint-env node */
/* eslint-disable no-undef */  // eslint comprend mal require ici, on disable

// Script de “nettoyage” des espaces invisibles dans le code source.
// Je parcours les fichiers du dossier src et je remplace certains caractères
// d’espacement Unicode “pièges” (NBSP, FEFF, etc.) par un espace normal.
// Objectif : éviter des diffs bizarres et des bugs de lint/parse.

const fs = require('fs');
const { globSync } = require('glob');

// Je liste les espaces/contrôles problématiques :
// \u00A0  NBSP (espace insécable)
// \u1680  OGHAM SPACE MARK
// \u180E  MONGOLIAN VOWEL SEPARATOR (historiquement espace fin)
// \u2000-\u200F  série d’espaces/contrôles (EN QUAD, EM SPACE, LRM/RLM, etc.)
// \u2028-\u202F  séparateurs de lignes/paragraphe + NNBSP
// \u205F  MEDIUM MATHEMATICAL SPACE
// \u3000  IDEOGRAPHIC SPACE
// \uFEFF  BOM (Byte Order Mark) qui traîne parfois en début de fichier
const BAD = /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;

// Je cible tous les fichiers source JS/TS du projet (sans répertoires).
const files = globSync('src/**/*.{js,jsx,ts,tsx}', { nodir: true });

// Pour chaque fichier, je remplace les caractères listés par un espace simple.
files.forEach((file) => {
  const text = fs.readFileSync(file, 'utf8');
  if (!BAD.test(text)) return;          // Rien à faire si aucun caractère suspect
  fs.writeFileSync(file, text.replace(BAD, ' '), 'utf8');
  console.log('✅ cleaned', file);       // Log succinct pour savoir ce que j’ai modifié
});
