// Petit stub pour les libs ESM ("ai", "@ai-sdk/google") côté tests.
// En environnement CJS (Jest/Vitest), l'import ESM ferait planter les tests.
// Ici je renvoie juste un module vide : ça suffit, le service n’est pas appelé durant les tests.
// Si un jour j'en a besoin en test, je remplacerai ce stub par un vrai mock.
module.exports = {};
