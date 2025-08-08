export interface Order {
  id: string;
  orderId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  planId: string;
  planTitle: string;
  price: number;
  currency: string;
  duration: number;
  note?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

const ORDERS_KEY = 'iptv_orders';
const ORDER_STATUS_OVERRIDES_KEY = 'iptv_order_status_overrides';

export const saveOrder = (order: Omit<Order, 'id' | 'createdAt'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return newOrder;
};

export const getOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load orders:', error);
    return [];
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']): boolean => {
  try {
    const overrides = getOrderStatusOverrides();
    overrides[orderId] = status;
    localStorage.setItem(ORDER_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
    return true;
  } catch (error) {
    console.error('Failed to update order status:', error);
    return false;
  }
};

export const getOrderStatusOverrides = (): Record<string, Order['status']> => {
  try {
    const stored = localStorage.getItem(ORDER_STATUS_OVERRIDES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load order status overrides:', error);
    return {};
  }
};

export const getOrderById = (orderId: string): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.orderId === orderId) || null;
};

export const exportOrdersToCSV = (orders: Order[]): string => {
  const headers = [
    'Date', 'Order ID', 'Name', 'Email', 'Phone', 'Country', 
    'Plan', 'Price', 'Currency', 'Duration', 'Status', 'Note'
  ];
  
  const rows = orders.map(order => [
    new Date(order.createdAt).toLocaleDateString(),
    order.orderId,
    order.name,
    order.email,
    order.phone,
    order.country,
    order.planTitle,
    order.price.toFixed(2),
    order.currency,
    `${order.duration} days`,
    order.status,
    order.note || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
    
  return csvContent;
};