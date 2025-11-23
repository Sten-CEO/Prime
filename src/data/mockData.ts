export const domains = [
  { id: "business", name: "Business", score: 87, trend: 12, daysTracked: 7 },
  { id: "sport", name: "Sport", trend: -5, score: 74, daysTracked: 5 },
  { id: "dev-perso", name: "Développement", score: 82, trend: 8, daysTracked: 7 },
  { id: "sante", name: "Santé", score: 79, trend: 0, daysTracked: 6 },
  { id: "relations", name: "Relations", score: 91, trend: 15, daysTracked: 7 },
  { id: "finance", name: "Finance", score: 85, trend: 7, daysTracked: 7 },
];

export const categories = {
  business: [
    { id: "strategy", name: "Stratégie", score: 92 },
    { id: "networking", name: "Networking", score: 88 },
    { id: "deep-work", name: "Deep Work", score: 85 },
  ],
  sport: [
    { id: "cardio", name: "Cardio", score: 72 },
    { id: "muscu", name: "Musculation", score: 78 },
    { id: "flexibility", name: "Flexibilité", score: 70 },
  ],
};

export const objectives = [
  {
    id: "1",
    title: "Augmenter le CA de 20%",
    domain: "business",
    progress: 65,
    deadline: "2025-03-31",
    completed: false,
  },
  {
    id: "2",
    title: "Courir un marathon",
    domain: "sport",
    progress: 42,
    deadline: "2025-06-15",
    completed: false,
  },
  {
    id: "3",
    title: "Lire 12 livres",
    domain: "dev-perso",
    progress: 75,
    deadline: "2025-12-31",
    completed: false,
  },
];

export const completedObjectives = [
  {
    id: "4",
    title: "Lancer nouveau produit",
    domain: "business",
    completedDate: "2025-01-15",
  },
  {
    id: "5",
    title: "Perdre 5kg",
    domain: "sport",
    completedDate: "2024-12-20",
  },
];

export const insights = [
  {
    id: "1",
    domain: "sport",
    date: "2025-01-18",
    text: "Je n'ai pas fait de cardio depuis 4 jours.",
  },
  {
    id: "2",
    domain: "business",
    date: "2025-01-17",
    text: "Excellente réunion avec le client potentiel.",
  },
  {
    id: "3",
    domain: "dev-perso",
    date: "2025-01-16",
    text: "Terminé le livre sur la productivité.",
  },
];

export const journalEntries = [
  {
    id: "1",
    date: "2025-01-18",
    content:
      "Aujourd'hui, j'ai travaillé sur le nouveau produit. L'équipe est motivée et les résultats sont prometteurs.",
    domain: "business",
  },
  {
    id: "2",
    date: "2025-01-17",
    content:
      "Séance de sport intense ce matin. Je n'ai pas fait de cardio depuis 4 jours, il faut que je me remette au running.",
    domain: "sport",
  },
];

export const performancesLibres = {
  business: [
    { name: "Productivité", score: 92 },
    { name: "Créativité", score: 85 },
    { name: "Leadership", score: 78 },
  ],
  sport: [
    { name: "Endurance", score: 75 },
    { name: "Force", score: 82 },
    { name: "Vitesse", score: 70 },
  ],
};

export const metrics = {
  business: [
    { name: "Chiffre d'affaires", value: 95, type: "slider" },
    { name: "Acquisitions clients", value: 88, type: "slider" },
    { name: "Innovation", value: 92, type: "slider" },
  ],
};

export const chartData = [
  { day: "Lun", business: 65, sport: 70, "dev-perso": 75, sante: 72, relations: 88, finance: 80 },
  { day: "Mar", business: 72, sport: 68, "dev-perso": 78, sante: 75, relations: 90, finance: 82 },
  { day: "Mer", business: 68, sport: null, "dev-perso": 80, sante: 78, relations: 89, finance: 83 },
  { day: "Jeu", business: 75, sport: 72, "dev-perso": null, sante: 80, relations: 91, finance: 84 },
  { day: "Ven", business: 82, sport: 75, "dev-perso": 82, sante: null, relations: 90, finance: 85 },
  { day: "Sam", business: 79, sport: 73, "dev-perso": 85, sante: 79, relations: 91, finance: 85 },
  { day: "Dim", business: 87, sport: 74, "dev-perso": 82, sante: 79, relations: 91, finance: 85 },
];
