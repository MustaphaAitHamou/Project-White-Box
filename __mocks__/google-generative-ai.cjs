// src/__mocks__/google-generative-ai.js
// Je fournis ici un mock très simple en CommonJS pour éviter d’importer le SDK ESM en tests.
// But : que Jest/Vitest reste tranquille. Je renvoie juste des objets avec la même forme que le SDK.

class MockChat {
  // Je simule une session de chat : sendMessage() renvoie un objet avec response.text()
  // (comme dans le SDK). text() retourne une string JSON car le code consomme ce format.
  async sendMessage() {
    return {
      response: {
        text: async () =>
          JSON.stringify({
            hotelOptions: [{ hotelName: 'H1', hotelAddress: 'Adr 1' }],
            dailyItinerary: [
              { dayNumber: 2, activities: [] },
              { dayNumber: 3, activities: [] },
            ],
          }),
      },
    };
  }
}

class MockModel {
  // Je renvoie un MockChat pour rester compatible avec getGenerativeModel().startChat().
  startChat() {
    return new MockChat();
  }
  // Je fournis aussi generateContent() pour couvrir l’autre usage courant du SDK.
  // Ici je renvoie une structure minimale, suffisante pour les tests.
  async generateContent() {
    return {
      response: {
        text: async () =>
          JSON.stringify({
            hotelOptions: [],
            dailyItinerary: [],
          }),
      },
    };
  }
}

class GoogleGenerativeAI {
  constructor() {}
  // Je garde exactement la même API : getGenerativeModel() retourne un objet “modèle”.
  getGenerativeModel() {
    return new MockModel();
  }
}

// J’exporte le même symbole que dans le vrai package pour que les imports restent inchangés.
module.exports = { GoogleGenerativeAI };
