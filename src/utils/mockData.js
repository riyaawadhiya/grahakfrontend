// src/utils/mockData.js
// Shared mock data consumed by analytics.jsx, shop.jsx, and orders.jsx

// ─── Shop / Inventory ─────────────────────────────────────────────────────────
export const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 2499,
    quantity: 14,
    category: 'Electronics',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
  },
  {
    id: '2',
    name: 'Running Sneakers',
    price: 1899,
    quantity: 8,
    category: 'Footwear',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 4999,
    quantity: 5,
    category: 'Electronics',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
  },
  {
    id: '4',
    name: 'Cotton T-Shirt',
    price: 399,
    quantity: 42,
    category: 'Clothing',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80',
  },
  {
    id: '5',
    name: 'Aviator Sunglasses',
    price: 799,
    quantity: 19,
    category: 'Accessories',
    status: 'unpublished',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80',
  },
  {
    id: '6',
    name: 'Leather Wallet',
    price: 649,
    quantity: 23,
    category: 'Accessories',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80',
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 1599,
    quantity: 7,
    category: 'Electronics',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80',
  },
  {
    id: '8',
    name: 'Yoga Mat',
    price: 849,
    quantity: 11,
    category: 'Home',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1601925228876-b0af4210b454?w=300&q=80',
  },
];

// ─── Analytics — Bar chart data ───────────────────────────────────────────────
export const WEEKLY_DATA = [
  { l: 'Mon', v: 420 },
  { l: 'Tue', v: 680 },
  { l: 'Wed', v: 530 },
  { l: 'Thu', v: 910 },
  { l: 'Fri', v: 760 },
  { l: 'Sat', v: 1040 },
  { l: 'Sun', v: 480 },
];

export const MONTHLY_DATA = [
  { l: 'W1', v: 3200 },
  { l: 'W2', v: 4800 },
  { l: 'W3', v: 3900 },
  { l: 'W4', v: 6640 },
];

export const YEARLY_DATA = [
  { l: 'Jan', v: 14200 },
  { l: 'Feb', v: 18700 },
  { l: 'Mar', v: 15400 },
  { l: 'Apr', v: 21300 },
  { l: 'May', v: 19800 },
  { l: 'Jun', v: 24600 },
  { l: 'Jul', v: 22100 },
  { l: 'Aug', v: 28400 },
  { l: 'Sep', v: 19600 },
  { l: 'Oct', v: 23900 },
  { l: 'Nov', v: 31200 },
  { l: 'Dec', v: 35400 },
];

// ─── Analytics — Donut / pie data ────────────────────────────────────────────
export const PIE_DATA = [
  { name: 'Electronics', value: 48, color: '#6366F1' },
  { name: 'Footwear',    value: 27, color: '#8B5CF6' },
  { name: 'Clothing',    value: 25, color: '#A78BFA' },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const MOCK_ORDERS = [
  {
    id: 'ORD-2481',
    status: 'new',
    table: 'Table 4',
    type: 'dine-in',
    time: '2 min ago',
    customer: { name: 'Rohit S.', initials: 'RS', color: '#EEF2FF', textColor: '#6366F1' },
    items: [
      { name: 'Paneer Tikka', qty: 2 },
      { name: 'Samosa',       qty: 4 },
      { name: 'Lassi',        qty: 2 },
    ],
    total: 480,
  },
  {
    id: 'ORD-2480',
    status: 'new',
    table: 'Takeaway',
    type: 'takeaway',
    time: '7 min ago',
    customer: { name: 'Priya K.', initials: 'PK', color: '#F5F3FF', textColor: '#8B5CF6' },
    items: [
      { name: 'Dal Makhani', qty: 1 },
      { name: 'Naan',        qty: 3 },
    ],
    total: 320,
  },
  {
    id: 'ORD-2479',
    status: 'preparing',
    table: 'Delivery',
    type: 'delivery',
    time: '15 min ago',
    customer: { name: 'Aakash M.', initials: 'AM', color: '#EDE9FE', textColor: '#7C3AED' },
    items: [
      { name: 'Biryani',      qty: 2 },
      { name: 'Raita',        qty: 2 },
      { name: 'Gulab Jamun',  qty: 3 },
    ],
    total: 740,
  },
  {
    id: 'ORD-2478',
    status: 'ready',
    table: 'Table 7',
    type: 'dine-in',
    time: '28 min ago',
    customer: { name: 'Vikram T.', initials: 'VT', color: '#EFF6FF', textColor: '#3B82F6' },
    items: [
      { name: 'Butter Chicken', qty: 1 },
      { name: 'Garlic Naan',   qty: 2 },
    ],
    total: 520,
  },
  {
    id: 'ORD-2477',
    status: 'delivered',
    table: 'Table 2',
    type: 'dine-in',
    time: '42 min ago',
    customer: { name: 'Sneha G.', initials: 'SG', color: '#F3F4F6', textColor: '#6B7280' },
    items: [
      { name: 'Chole Bhature', qty: 2 },
      { name: 'Chai',          qty: 3 },
    ],
    total: 290,
  },
  {
    id: 'ORD-2476',
    status: 'delivered',
    table: 'Takeaway',
    type: 'takeaway',
    time: '1 hr ago',
    customer: { name: 'Meera R.', initials: 'MR', color: '#FFF7ED', textColor: '#C2410C' },
    items: [
      { name: 'Veg Thali', qty: 2 },
    ],
    total: 380,
  },
];