// src/config.ts
const env = import.meta.env;
function requireEnv(name: string) {
  const v = env[name as keyof typeof env] as string | undefined;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const WHATSAPP_PHONE = requireEnv('VITE_WHATSAPP_PHONE');
export const PAYMENT_LINK_BASE = requireEnv('VITE_PAYMENT_LINK_BASE');
export const ADMIN_PASSWORD_HASH = requireEnv('VITE_ADMIN_PASSWORD_HASH');

export const DEFAULT_CURRENCY = "EUR";
export const SUPPORTED_CURRENCIES = ["EUR","GBP","CHF","SEK","DKK","NOK","PLN","CZK"] as const;

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  FR: "EUR", DE: "EUR", IT: "EUR", ES: "EUR", PT: "EUR", NL: "EUR", BE: "EUR", 
  LU: "EUR", IE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", SK: "EUR", SI: "EUR", 
  CY: "EUR", MT: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", GB: "GBP", CH: "CHF", 
  SE: "SEK", DK: "DKK", NO: "NOK", PL: "PLN", CZ: "CZK"
};

export const GOOGLE_FORM_ACTION_URL = ""; // Optional: Google Forms URL
export const GOOGLE_FORM_FIELDS = {
  name: "entry.111",
  email: "entry.222", 
  phone: "entry.333",
  country: "entry.444",
  plan: "entry.555",
  note: "entry.666",
  orderId: "entry.777",
  currency: "entry.888",
  price: "entry.999"
};

export const GOOGLE_SHEET_ID = ""; // Optional: Google Sheets ID
export const GOOGLE_SHEET_GID = "0";
export const ADMIN_UPDATE_ENDPOINT = ""; // Optional: Apps Script endpoint

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
    features: ["Full HD Quality", "24/7 Support", "All European Channels"] 
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
    popular: true 
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