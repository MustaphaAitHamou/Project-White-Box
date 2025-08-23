/* ------------------------------------------------------------------
   Service Gemini : génération d’itinéraires + « auto-repair » JSON
   Je prépare ici un client Gemini, je génère une réponse au format JSON,
   puis je répare/normalise le résultat pour éviter les surprises côté UI.
------------------------------------------------------------------- */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsonrepair }        from 'jsonrepair';

/* Je lis la clé côté build. Sans clé, je stoppe net pour éviter
   des appels silencieux qui échoueraient plus loin. */
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
if (!apiKey) throw new Error('VITE_GOOGLE_GEMINI_AI_API_KEY manquant');

/* Instance client Gemini paramétrée avec la clé. */
const genAI = new GoogleGenerativeAI(apiKey);

/* Je fixe une config de génération plutôt créative,
   tout en forçant une sortie JSON avec responseMimeType. */
const generationConfig = {
  temperature     : 0.9,
  topP            : 0.95,
  topK            : 40,
  /* 8192 tokens ≃ ~24 000 car. → largement suffisant pour 30+ jours */
  maxOutputTokens : 8192,
  responseMimeType: 'application/json',
};

/* ---------- helpers ---------- */
/* Je tente d’abord un JSON.parse direct, et si ça casse,
   j’essaie de réparer la chaîne avec jsonrepair avant de reparser. */
function safeParse(str) {
  try   { return JSON.parse(str); }
  catch { return JSON.parse(jsonrepair(str)); }
}

/* Je normalise la structure pour garantir des champs présents et
   des tableaux d’objets propres, même si le modèle manque un champ. */
function normalise(raw) {
  const safe = { hotelOptions: [], dailyItinerary: [], ...raw };

  /* — hotels — */
  // Je ne garde que les hôtels ayant au minimum un nom et une adresse.
  safe.hotelOptions = (safe.hotelOptions || []).filter(
    (h) => h.hotelName && h.hotelAddress,
  );

  /* — days / activities — */
  // Pour chaque jour, je fournis des valeurs par défaut et je filtre
  // les activités sans placeName. Je complète les champs facultatifs.
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
/* Je génère un plan de voyage à partir d’un prompt :
   - j’interroge le modèle gemini-1.5-flash
   - je récupère le texte, j’enlève d’éventuels fences Markdown
   - je parse en JSON de manière robuste puis je normalise la structure. */
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
/* Ancien point d’entrée laissé pour compatibilité.
   Je préfère faire échouer explicitement pour guider vers generateTripPlan. */
export const chatSession = {
  sendMessage: () =>
    Promise.reject(
      new Error('chatSession obsolète : utilisez generateTripPlan()'),
    ),
};
