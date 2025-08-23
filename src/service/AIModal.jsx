/* ------------------------------------------------------------------
   Service Gemini : génération d’itinéraires + « auto‑repair » JSON
------------------------------------------------------------------- */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsonrepair }        from 'jsonrepair';

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
if (!apiKey) throw new Error('VITE_GOOGLE_GEMINI_AI_API_KEY manquant');

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature     : 0.9,
  topP            : 0.95,
  topK            : 40,
  /* 8192 tokens ≃ ~24 000 car. → largement suffisant pour 30+ jours */
  maxOutputTokens : 8192,
  responseMimeType: 'application/json',
};

/* ---------- helpers ---------- */
function safeParse(str) {
  try   { return JSON.parse(str); }
  catch { return JSON.parse(jsonrepair(str)); }
}

function normalise(raw) {
  const safe = { hotelOptions: [], dailyItinerary: [], ...raw };

  /* — hotels — */
  safe.hotelOptions = (safe.hotelOptions || []).filter(
    (h) => h.hotelName && h.hotelAddress,
  );

  /* — days / activities — */
  safe.dailyItinerary = (safe.dailyItinerary || []).map((d, idx) => {
    const acts = d.activities || [];
    const fixed = acts
      .filter((a) => a.placeName)
      .map((a) => ({
        placeName      : a.placeName,
        details        : a.details || '',
        timeToTravel   : a.timeToTravel || '',
        bestTimeToVisit: a.bestTimeToVisit || '',
      }));
    return {
      dayNumber : d.dayNumber ?? idx + 1,
      theme     : d.theme || '',
      activities: fixed,
    };
  });

  return safe;
}

/* ---------- PUBLIC ---------- */
export async function generateTripPlan(prompt) {
  const model  = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent({
    generationConfig,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const raw = result.response
    .text()
    .replace(/```json|```/gi, '') // strip fences
    .trim();

  return normalise(safeParse(raw));
}

/* ---------- API historique (compat) ---------- */
export const chatSession = {
  sendMessage: () =>
    Promise.reject(
      new Error('chatSession obsolète : utilisez generateTripPlan()'),
    ),
};
