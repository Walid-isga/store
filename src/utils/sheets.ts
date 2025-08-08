// src/utils/sheets.ts
import type { Order } from './orders';
import {
  GOOGLE_FORM_ACTION_URL,
  GOOGLE_FORM_FIELDS,
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_GID,
  GOOGLE_SHEET_PUBLISHED_CSV_URL,
} from '../config';

/**
 * --- ENVOI : Google Forms ---
 * Envoie une commande au Google Form lié au Google Sheet (fire-and-forget).
 * Nécessite: GOOGLE_FORM_ACTION_URL + GOOGLE_FORM_FIELDS (entry.xxxxxx).
 */
export async function submitOrderToGoogleForm(order: Omit<Order, 'id' | 'createdAt'>) {
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
    // no-cors : on ne lit pas la réponse, mais Google reçoit les données
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: fd,
    });
  } catch (e) {
    console.error('Google Form submit failed:', e);
  }
}

/**
 * --- LECTURE : Google Sheets (CSV) ---
 * Récupère les commandes depuis la feuille Google Sheet publiée en CSV.
 * Utilise un parseur CSV qui gère les guillemets/virgules.
 */

// Parseur CSV robuste (gère guillemets, , dans les champs, CRLF)
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cell = '', row: string[] = [];
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

const norm = (s: string) => s?.trim().toLowerCase() || '';
const num = (s: string) => Number((s || '').replace(/\s/g, '').replace(',', '.')) || 0;

export const parseCSVToOrders = (csvText: string): Order[] => {
  try {
    const rows = parseCSV(csvText).filter(r => r.length > 1);
    if (rows.length <= 1) return [];

    const headers = rows[0].map(norm);

    // Trouve la colonne par liste de noms possibles (FR/EN)
    const col = (...names: string[]) => {
      for (const n of names) {
        const i = headers.indexOf(norm(n));
        if (i !== -1) return i;
      }
      return -1;
    };

    // Indices d'intérêt (adapter ici si tes entêtes diffèrent)
    const cTimestamp = col('timestamp', 'date', 'createdat', 'created at');
    const cOrderId   = col('order id', 'id commande', 'orderid');
    const cName      = col('name', 'nom');
    const cEmail     = col('email', 'e-mail');
    const cPhone     = col('phone', 'téléphone', 'tel');
    const cCountry   = col('country', 'pays');
    const cPlan      = col('plan', 'forfait', 'plantitle');
    const cCurrency  = col('currency', 'devise');
    const cPrice     = col('price', 'prix');
    const cDuration  = col('duration days', 'duration', 'jours', 'durée');
    const cNote      = col('note', 'remark', 'remarque');
    const cStatus    = col('status', 'statut'); // optionnel

    const orders: Order[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];

      const createdAt = cTimestamp >= 0 ? row[cTimestamp] : '';
      const priceRaw  = cPrice >= 0 ? row[cPrice] : '0';
      const durationRaw = cDuration >= 0 ? row[cDuration] : '0';

      const order: Order = {
        id: crypto.randomUUID(), // id local frontend
        orderId: cOrderId >= 0 ? row[cOrderId] : '',
        name: cName >= 0 ? row[cName] : '',
        email: cEmail >= 0 ? row[cEmail] : '',
        phone: cPhone >= 0 ? row[cPhone] : '',
        country: cCountry >= 0 ? row[cCountry] : '',
        planId: '', // (optionnel) à déduire depuis planTitle si besoin
        planTitle: cPlan >= 0 ? row[cPlan] : '',
        price: num(priceRaw),
        currency: cCurrency >= 0 ? row[cCurrency] : 'EUR',
        duration: parseInt(durationRaw || '0', 10) || 0,
        note: cNote >= 0 ? row[cNote] : '',
        status: (cStatus >= 0 ? (row[cStatus] as Order['status']) : 'pending') || 'pending',
        createdAt: createdAt || new Date().toISOString(),
      };

      // Ignore les lignes vides
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
        ? `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GOOGLE_SHEET_GID || '0'}`
        : '');

    if (!url) return [];

    // petit cache-buster pour éviter l’ancienne version du CSV
    const res = await fetch(url + (url.includes('?') ? '&' : '?') + 'r=' + Date.now(), {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    return parseCSVToOrders(csv);
  } catch (error) {
    console.error('Failed to fetch orders from Google Sheets:', error);
    return [];
  }
};

