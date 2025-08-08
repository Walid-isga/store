// src/config.ts
// ---------------------- ENV ----------------------
const env = import.meta.env;

function requireEnv(name: string) {
  const v = env[name as keyof typeof env] as string | undefined;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}
function optionalEnv(name: string, fallback = "") {
  return (env[name as keyof typeof env] as string | undefined) ?? fallback;
}

// Exposés au client (Vite): doivent commencer par VITE_
export const WHATSAPP_PHONE = requireEnv("VITE_WHATSAPP_PHONE");
export const PAYMENT_LINK_BASE = requireEnv("VITE_PAYMENT_LINK_BASE");
export const ADMIN_PASSWORD_HASH = requireEnv("VITE_ADMIN_PASSWORD_HASH");
// ---------------------- CURRENCIES ----------------------
export const DEFAULT_CURRENCY = "EUR";
export const SUPPORTED_CURRENCIES = [
  "EUR",
  "GBP",
  "CHF",
  "SEK",
  "DKK",
  "NOK",
  "PLN",
  "CZK",
] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];
export const DEFAULT_LOCALE = "en";

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  ES: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  LU: "EUR",
  IE: "EUR",
  AT: "EUR",
  FI: "EUR",
  GR: "EUR",
  SK: "EUR",
  SI: "EUR",
  CY: "EUR",
  MT: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  GB: "GBP",
  CH: "CHF",
  SE: "SEK",
  DK: "DKK",
  NO: "NOK",
  PL: "PLN",
  CZ: "CZK",
};

// ---------------------- GOOGLE FORMS / SHEETS ----------------------
// URL d'action de TON Google Form (POST)
export const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeq9bA_6LkJyQMHOCOkNg9a6WvjLoh4gjHMkquyjFhexhg-dg/formResponse";

// Mapping des champs (tes entry.xxxxx)
export const GOOGLE_FORM_FIELDS = {
  orderId: "entry.1678666027",
  name: "entry.177162094",
  email: "entry.1838168850",
  phone: "entry.345722898",
  country: "entry.1335973341",
  plan: "entry.242041475",
  currency: "entry.1085468524",
  price: "entry.155608386",
  duration: "entry.141265833",
  note: "entry.1159579805",
};

// Lien CSV publié (recommandé pour l’admin)
export const GOOGLE_SHEET_PUBLISHED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8bgQRnhftlwp15Q223D4TnktllMePFMq1b1KO7kQwJvuUI2gi-kZH3eSrn4vcNue2-NSjHxFMN2EI/pub?gid=990750460&single=true&output=csv";

// Optionnel: mode /gviz si tu préfères reconstruire l’URL (sinon laisse vide)
export const GOOGLE_SHEET_ID = optionalEnv("VITE_GOOGLE_SHEET_ID", "");
export const GOOGLE_SHEET_GID = optionalEnv("VITE_GOOGLE_SHEET_GID", "0");

// Optionnel: endpoint Apps Script si tu passes à une API JSON plus tard
export const ADMIN_UPDATE_ENDPOINT = optionalEnv("VITE_ADMIN_UPDATE_ENDPOINT", "");

// ---------------------- PLANS & COUNTRIES ----------------------
export type Plan = {
  id: string;
  title: string;
  price: number;
  durationDays: number;
  features?: string[];
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "p1",
    title: "1 Month",
    price: 9.99,
    durationDays: 30,
    features: ["Full HD Quality", "24/7 Support", "All European Channels"],
  },
  {
    id: "p3",
    title: "3 Months",
    price: 24.99,
    durationDays: 90,
    features: ["Save 15%", "Premium Sports", "Movie Channels", "Mobile App"],
  },
  {
    id: "p12",
    title: "12 Months",
    price: 49.99,
    durationDays: 365,
    features: ["Best Value", "4K Quality", "Priority Support", "VIP Access"],
    popular: true,
  },
];

export const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "LU", name: "Luxembourg" },
  { code: "IE", name: "Ireland" },
  { code: "AT", name: "Austria" },
  { code: "FI", name: "Finland" },
  { code: "GR", name: "Greece" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "CY", name: "Cyprus" },
  { code: "MT", name: "Malta" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "GB", name: "United Kingdom" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "DK", name: "Denmark" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
];
