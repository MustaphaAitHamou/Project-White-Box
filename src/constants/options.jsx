export const SelectTravelesList=[
    {
        id:1,
        title: 'Seul',
        desc: 'Voyageur seul en exploration',
        icon: '✈️',
        people:'1 Personne'
    },
    {
        id:2,
        title: 'À deux',
        desc: 'Deux voyageurs en tandem',
        icon: '🤜🏼🤛🏼',
        people:'2 Personnes'
    },
    {
        id:3,
        title: 'En Famille',
        desc: 'La famille, rien que la famille...',
        icon: '🏡',
        people:'3 à 5 Personnes'
    }, 
    {
        id:4,
        title: 'Entre amis',
        desc: 'En groupe pour des sensations fortes',
        icon: '🛥️',
        people:'5 à 10 Personnes'
    }, 
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Bon marché',
        desc:'Restez conscient des coûts',
        icon:'🪙',
    },
    {
        id:2,
        title:'Modéré',
        desc:'Maintenir les coûts dans la moyenne',
        icon:'💸',
    },
    {
        id:3,
        title:'Luxe',
        desc:'Ne vous inquiétez pas du coût',
        icon:'💰',
    },
]

export const AI_PROMPT='Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, PLace Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'