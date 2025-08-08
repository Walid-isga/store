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

// Construit la charge utile (keys = entry.xxxxxx)
function buildPayload(order: Omit<Order, 'id' | 'createdAt'>): Record<string, string> {
  return {
    [GOOGLE_FORM_FIELDS.orderId]:  order.orderId,
    [GOOGLE_FORM_FIELDS.name]:     order.name,
    [GOOGLE_FORM_FIELDS.email]:    order.email,
    [GOOGLE_FORM_FIELDS.phone]:    order.phone,
    [GOOGLE_FORM_FIELDS.country]:  order.country,
    [GOOGLE_FORM_FIELDS.plan]:     order.planTitle,
    [GOOGLE_FORM_FIELDS.currency]: order.currency,
    [GOOGLE_FORM_FIELDS.price]:    order.price.toFixed(2),
    [GOOGLE_FORM_FIELDS.duration]: String(order.duration),
    [GOOGLE_FORM_FIELDS.note]:     order.note || '',
    submit: 'Submit',
  };
}

// Fallback ultra-fiable: soumission via un <form> caché dans un <iframe>
function submitViaHiddenForm(url: string, payload: Record<string, string>): Promise<void> {
  return new Promise<void>((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.name = 'gform-target';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = url;
    form.method = 'POST';
    form.target = 'gform-target';

    Object.entries(payload).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Laisse un petit délai pour éviter qu'une navigation annule l'envoi
    setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve();
    }, 600);
  });
}

export async function submitOrderToGoogleForm(order: Omit<Order, 'id' | 'createdAt'>) {
  if (!GOOGLE_FORM_ACTION_URL) return;

  const payload = buildPayload(order);

  // 1) Tentative via fetch (no-cors)
  try {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    // Log utile si besoin:
    // console.log('[Forms] POST fetch →', GOOGLE_FORM_ACTION_URL, payload);
    await fetch(GOOGLE_FORM_ACTION_URL, { method: 'POST', mode: 'no-cors', body: fd });
    return;
  } catch {
    // ignore
  }

  // 2) Fallback via formulaire caché
  await submitViaHiddenForm(GOOGLE_FORM_ACTION_URL, payload);
}

/* ------------------------------------------------------------------ */
/*                      LECTURE ← GOOGLE SHEETS (CSV)                  */
/* ------------------------------------------------------------------ */

// Parseur CSV qui gère guillemets, virgules et CRLF
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cell = '';
  let row: string[] = [];
  let q = false; // dans des guillemets ?

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

// Normalise un en-tête (sans accents, espaces multiples, lower-case)
const normalizeHeader = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

// Trouve l'index d'une colonne en matchant un ou plusieurs noms possibles
function findCol(headers: string[], ...needles: string[]) {
  const H = headers.map(normalizeHeader);
  const N = needles.map(normalizeHeader);
  for (let i = 0; i < H.length; i++) {
    if (N.some((n) => H[i] === n || H[i].includes(n))) return i;
  }
  return -1;
}

// Convertit "24,99 €", "€24.99", "1.234,56", "1,234.56" → 24.99
function toNumber(raw: string): number {
  if (!raw) return 0;
  let s = String(raw).replace(/[^0-9,.\-]/g, '');
  if (s.includes('.') && s.includes(',')) {
    // style EU "1.234,56"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',') && !s.includes('.')) {
    // "24,99"
    s = s.replace(',', '.');
  } else {
    // style US "1,234.56"
    s = s.replace(/,/g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export const parseCSVToOrders = (csvText: string): Order[] => {
  try {
    const rows = parseCSV(csvText).filter((r) => r.length > 1);
    if (rows.length <= 1) return [];

    const headers = rows[0];

    // Détection souple des colonnes (FR/EN + variantes)
    const cTimestamp = findCol(headers, 'timestamp', 'date', 'created at', 'createdat');
    const cOrderId = findCol(headers, 'order id', 'id commande', 'orderid');
    const cName = findCol(headers, 'name', 'nom');
    const cEmail = findCol(headers, 'email', 'e-mail');
    const cPhone = findCol(headers, 'phone', 'téléphone', 'tel');
    const cCountry = findCol(headers, 'country', 'pays');
    const cPlan = findCol(headers, 'plan', 'forfait', 'plantitle');

    const cCurrency = findCol(headers, 'currency', 'devise');
    const cPrice = findCol(headers, 'price', 'prix', 'montant', 'amount', 'total', 'price eur', 'prix eur');
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
        planId: '', // optionnel: à déduire via une map si besoin
        planTitle: cPlan >= 0 ? row[cPlan] : '',
        price: toNumber(priceRaw),
        currency: cCurrency >= 0 ? row[cCurrency] : 'EUR',
        duration: parseInt(String(durationRaw || '0'), 10) || 0,
        note: cNote >= 0 ? row[cNote] : '',
        status: ((cStatus >= 0 ? row[cStatus] : '') as Order['status']) || 'pending',
        createdAt: createdAt || new Date().toISOString(),
      };

      // Ignore les lignes vides
      if (order.orderId || order.email || order.name) orders.push(order);
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

    // Cache-buster pour éviter une ancienne version
    const withCB = url + (url.includes('?') ? '&' : '?') + 'r=' + Date.now();
    const res = await fetch(withCB, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    return parseCSVToOrders(csv);
  } catch (error) {
    console.error('Failed to fetch orders from Google Sheets:', error);
    return [];
  }
};
