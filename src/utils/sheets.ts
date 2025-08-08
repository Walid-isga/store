import { Order } from './orders';
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_GID } from '../config';

export const parseCSVToOrders = (csvText: string): Order[] => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const orders: Order[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      
      // Map CSV columns to order properties
      // Adjust these indices based on your Google Sheets structure
      const order: Order = {
        id: values[0] || crypto.randomUUID(),
        orderId: values[1] || '',
        name: values[2] || '',
        email: values[3] || '',
        phone: values[4] || '',
        country: values[5] || '',
        planId: values[6] || '',
        planTitle: values[7] || '',
        price: parseFloat(values[8]) || 0,
        currency: values[9] || 'EUR',
        duration: parseInt(values[10]) || 30,
        note: values[11] || '',
        status: (values[12] as Order['status']) || 'pending',
        createdAt: values[13] || new Date().toISOString(),
      };
      
      orders.push(order);
    }
    
    return orders;
  } catch (error) {
    console.error('Failed to parse CSV:', error);
    return [];
  }
};

export const fetchOrdersFromGoogleSheets = async (): Promise<Order[]> => {
  if (!GOOGLE_SHEET_ID) return [];
  
  try {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GOOGLE_SHEET_GID}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCSVToOrders(csvText);
  } catch (error) {
    console.error('Failed to fetch orders from Google Sheets:', error);
    return [];
  }
};