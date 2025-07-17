/* ------------------------------------------------------------------
   Sélecteurs + Prompt IA STRICT
------------------------------------------------------------------- */

/* --- Listes de sélection UI ------------------------------------ */
export const SelectTravelesList = [
    { id: 1, title: 'Seul',       desc: 'Voyageur seul',   icon: '✈️',  people: '1 Personne' },
    { id: 2, title: 'À deux',     desc: 'Deux voyageurs',  icon: '🤜🏼🤛🏼', people: '2 Personnes' },
    { id: 3, title: 'En famille', desc: 'Famille',         icon: '🏡',  people: '3 à 5 Personnes' },
    { id: 4, title: 'Entre amis', desc: 'Groupe d’amis',   icon: '🛥️',  people: '5 à 10 Personnes' },
  ];
  
  export const SelectBudgetOptions = [
    { id: 1, title: 'Bon marché', desc: '€ 30‑80',  icon: '🪙' },
    { id: 2, title: 'Modéré',     desc: '€ 80‑200', icon: '💸' },
    { id: 3, title: 'Luxe',       desc: '€ 200+',   icon: '💰' },
  ];
  
  /* ------------------------------------------------------------------
     PROMPT IA – illimité en jours + 4 créneaux par jour
  ------------------------------------------------------------------- */
  export const AI_PROMPT = `
  You are a travel‑planner API.
  
  =============================================================
  INPUTS
    • CITY ............. {location}
    • TOTAL_DAYS ....... {totalDays}  (integer ≥ 1, no hard upper‑limit)
    • TRAVEL_PARTY ..... {traveler}
    • BUDGET_CATEGORY .. {budget}  (Bon marché | Modéré | Luxe)
  
  OUTPUT (MUST BE VALID JSON – no markdown)
  
  {
    "hotelOptions": [   // 3‑6 items
      {
        "hotelName":    "Hotel ...",
        "hotelAddress": "12 rue ...",
        "price":        "€ 120",         // match the budget band
        "rating":       4.2,             // 1‑5
        "image":        "https://…",
        "latitude":     48.85,
        "longitude":    2.35
      }
    ],
    "dailyItinerary": [
      {
        "dayNumber": 1,
        "theme": "Découverte historique",
        "activities": [
          {
            "placeName":       "Le Comptoir du Marché",
            "details":         "Petit‑déj local avec croissants …",
            "timeToTravel":    "5 min",
            "bestTimeToVisit": "Breakfast"
          },
          {
            "placeName":       "Musée Matisse",
            "details":         "Matinée culturelle …",
            "timeToTravel":    "10 min",
            "bestTimeToVisit": "Morning"
          },
          {
            "placeName":       "Vieux‑Nice",
            "details":         "Balade dans le quartier …",
            "timeToTravel":    "15 min",
            "bestTimeToVisit": "Afternoon"
          },
          {
            "placeName":       "Colline du Château",
            "details":         "Vue panoramique au coucher du soleil …",
            "timeToTravel":    "20 min",
            "bestTimeToVisit": "Evening"
          }
        ]
      }
    ]
  }
  
  RULES
    • dailyItinerary MUST contain **exactly TOTAL_DAYS elements** (no truncation).
    • For each day, **activities.length = 4** with one activity per slot:
          Breakfast · Morning · Afternoon · Evening
    • bestTimeToVisit MUST be exactly one of those four labels.
    • Use real POIs inside CITY or ≤ 20 km.
    • Stay within the provided BUDGET_CATEGORY when giving prices.
    • DO NOT output anything else than the pure JSON above (no prose, no code‑block fences).
  =============================================================
  `;
  