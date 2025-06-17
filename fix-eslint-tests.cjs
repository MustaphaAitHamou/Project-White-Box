const fs = require('fs');
const path = require('path');

// Liste les fichiers test à traiter
function findTestFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findTestFiles(filePath, fileList);
    } else if (filePath.match(/\.(test|spec)\.(js|jsx)$/)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Nettoie un fichier de test
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Supprime les /* global ... */ et doublons
  content = content.replace(/^\/\* global .* \*\/\n?/gm, '');

  // Supprime les lignes d'import non utilisées (axios, require global, etc.)
  content = content.replace(/^.*import axios.*\n?/gm, '');
  content = content.replace(/^.*require\(.*\).*;?\n?/gm, '');

  // Ajoute /* eslint-env jest */ si absent
  if (!content.includes('eslint-env jest')) {
    content = `/* eslint-env jest */\n\n${content}`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Nettoyé : ${filePath}`);
}

// Lancer le script
const testFiles = findTestFiles(path.join(__dirname, 'src'));

testFiles.forEach(processFile);

console.log('\n✅ Tous les fichiers de test ont été mis à jour.');
