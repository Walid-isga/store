// src/utils/sheets.ts
import type { Order } from './orders';
import {
  GOOGLE_FORM_ACTION_URL,
  GOOGLE_FORM_FIELDS,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_GID,
  GOOGLE_SHEET_PUBLISHED_CSV_URL,
} from '../config';

/* ------------------------------------------------------------------ */
/*                         ENVOI → GOOGLE FORMS                        */
/* ------------------------------------------------------------------ */

export async function submitOrderToGoogleForm(
  order: Omit<Order, 'id' | 'createdAt'>
) {
  if (!GOOGLE_FORM_ACTION_URL) return;

  const fd = new FormData();
  fd.append(GOOGLE_FORM_FIELDS.orderId, order.orderId);
  fd.append(GOOGLE_FORM_FIELDS.name, order.name);
  fd.append(GOOGLE_FORM_FIELDS.email, order.email);
  fd.append(GOOGLE_FORM_FIELDS.phone, order.phone);
  fd.append(GOOGLE_FORM_FIELDS.country, order.country);
  fd.append(GOOGLE_FORM_FIELDS.plan, order.planTitle);
  fd.append(GOOGLE_FORM_FIELDS.currency, order.currency);
  fd.append(GOOGLE_FORM_FIELDS.price, order.price.toFixed(2));
  fd.append(GOOGLE_FORM_FIELDS.duration, String(order.duration));
  fd.append(GOOGLE_FORM_FIELDS.note, order.note || '');

  try {
    // no-cors: on ne lit pas la réponse, mais Google reçoit les données
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: fd,
    });
  } catch (e) {
    console.error('Google Form submit failed:', e);
  }
}

/* ------------------------------------------------------------------ */
/*                      LECTURE ← GOOGLE SHEETS (CSV)                  */
/* ------------------------------------------------------------------ */

// Parseur CSV qui gère guillemets, virgules dans champs, et CRLF
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cell = '';
  let row: string[] = [];
  let q = false; // in quotes

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (q && text[i + 1] === '"') {
        cell += '"'; // "" -> "
        i++;
      } else {
        q = !q;
      }
    } else if (ch === ',' && !q) {
      row.push(cell);
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !q) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

// Normalise un en-tête: enlève accents, espaces multiples, lower-case
const normalizeHeader = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

// Trouve l'index de colonne par noms possibles (match exact ou inclusion)
function findCol(headers: string[], ...needles: string[]) {
  const H = headers.map(normalizeHeader);
  const N = needles.map(normalizeHeader);
  for (let i = 0; i < H.length; i++) {
    if (N.some((n) => H[i] === n || H[i].includes(n))) return i;
  }
  return -1;
}

// Convertit "24,99 €", "€24.99", "1.234,56" → 24.99
function toNumber(raw: string): number {
  if (!raw) return 0;
  let s = String(raw);
  s = s.replace(/[^0-9,.\-]/g, ''); // garde chiffres, virgule, point, signe
  if (s.includes('.') && s.includes(',')) {
    // style EU "1.234,56"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',') && !s.includes('.')) {
    // "24,99"
    s = s.replace(',', '.');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export const parseCSVToOrders = (csvText: string): Order[] => {
  try {
    const rows = parseCSV(csvText).filter((r) => r.length > 1);
    if (rows.length <= 1) return [];

    const headers = rows[0];

    // Détection souple FR/EN (et variantes)
    const cTimestamp = findCol(headers, 'timestamp', 'date', 'created at', 'createdat');
    const cOrderId = findCol(headers, 'order id', 'id commande', 'orderid');
    const cName = findCol(headers, 'name', 'nom');
    const cEmail = findCol(headers, 'email', 'e-mail');
    const cPhone = findCol(headers, 'phone', 'téléphone', 'tel');
    const cCountry = findCol(headers, 'country', 'pays');
    const cPlan = findCol(headers, 'plan', 'forfait', 'plantitle');

    const cCurrency = findCol(headers, 'currency', 'devise');
    const cPrice = findCol(
      headers,
      'price',
      'prix',
      'montant',
      'amount',
      'total',
      'price eur',
      'prix eur'
    );
    const cDuration = findCol(headers, 'duration days', 'duration', 'jours', 'duree', 'durée');
    const cNote = findCol(headers, 'note', 'remark', 'remarque');
    const cStatus = findCol(headers, 'status', 'statut');

    const orders: Order[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];

      const createdAt = cTimestamp >= 0 ? row[cTimestamp] : '';
      const priceRaw = cPrice >= 0 ? row[cPrice] : '';
      const durationRaw = cDuration >= 0 ? row[cDuration] : '';

      const order: Order = {
        id: crypto.randomUUID(), // id local frontend
        orderId: cOrderId >= 0 ? row[cOrderId] : '',
        name: cName >= 0 ? row[cName] : '',
        email: cEmail >= 0 ? row[cEmail] : '',
        phone: cPhone >= 0 ? row[cPhone] : '',
        country: cCountry >= 0 ? row[cCountry] : '',
        planId: '', // (optionnel) à déduire depuis planTitle si besoin
        planTitle: cPlan >= 0 ? row[cPlan] : '',
        price: toNumber(priceRaw),
        currency: cCurrency >= 0 ? row[cCurrency] : 'EUR',
        duration: parseInt(String(durationRaw || '0'), 10) || 0,
        note: cNote >= 0 ? row[cNote] : '',
        status: ((cStatus >= 0 ? row[cStatus] : '') as Order['status']) || 'pending',
        createdAt: createdAt || new Date().toISOString(),
      };

      if (order.orderId || order.email || order.name) {
        orders.push(order);
      }
    }

    return orders;
  } catch (error) {
    console.error('Failed to parse CSV:', error);
    return [];
  }
};

export const fetchOrdersFromGoogleSheets = async (): Promise<Order[]> => {
  try {
    const url =
      GOOGLE_SHEET_PUBLISHED_CSV_URL ||
      (GOOGLE_SHEET_ID
        ? `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${
            GOOGLE_SHEET_GID || '0'
          }`
        : '');

    if (!url) return []; // rien de configuré

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    return parseCSVToOrders(csv);
  } catch (error) {
    console.error('Failed to fetch orders from Google Sheets:', error);
    return [];
  }
};
