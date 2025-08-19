// src/__mocks__/google-generative-ai.js
// Mock minimal côté CJS pour éviter l’import ESM du SDK en tests.

class MockChat {
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
    startChat() {
      return new MockChat();
    }
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
    getGenerativeModel() {
      return new MockModel();
    }
  }
  
  module.exports = { GoogleGenerativeAI };
  