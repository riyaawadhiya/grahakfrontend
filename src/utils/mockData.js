export const MOCK_ITEMS = [
  { id: '1', name: 'Masala Chai',  price: 30,  category: 'Beverages', stock: 50, emoji: '☕' },
  { id: '2', name: 'Veg Burger',   price: 80,  category: 'Food',      stock: 25, emoji: '🍔' },
  { id: '3', name: 'Cold Coffee',  price: 60,  category: 'Beverages', stock: 35, emoji: '🧋' },
  { id: '4', name: 'Paneer Wrap',  price: 90,  category: 'Food',      stock: 20, emoji: '🌯' },
  { id: '5', name: 'Lemon Soda',   price: 40,  category: 'Beverages', stock: 45, emoji: '🥤' },
  { id: '6', name: 'Samosa',       price: 20,  category: 'Snacks',    stock: 60, emoji: '🥟' },
];

export const MOCK_ORDERS = [
  { id: 'T001', customer: 'Rahul M.',  items: 'Masala Chai ×2',           time: '2m ago',  amount: 60,  status: 'pending'   },
  { id: 'T002', customer: 'Priya S.',  items: 'Veg Burger, Cold Coffee',   time: '8m ago',  amount: 140, status: 'pending'   },
  { id: 'T003', customer: 'Amit K.',   items: 'Samosa ×3',                 time: '15m ago', amount: 60,  status: 'completed' },
  { id: 'T004', customer: 'Neha R.',   items: 'Paneer Wrap ×2',            time: '22m ago', amount: 180, status: 'completed' },
  { id: 'T005', customer: 'Vivek J.',  items: 'Lemon Soda ×1',             time: '35m ago', amount: 40,  status: 'rejected'  },
  { id: 'T006', customer: 'Sunita D.', items: 'Chai ×3, Samosa ×2',        time: '1h ago',  amount: 130, status: 'completed' },
 { id: 8, orderNumber: 'ORD-1008', customer: 'Rahul Sharma',  items: 'Masala Dosa x2',                    amount: 160, time: '2 min ago',  status: 'pending'   },
  { id: 7, orderNumber: 'ORD-1007', customer: 'Priya Patel',   items: 'Paneer Butter Masala, Naan x3',      amount: 250, time: '8 min ago',  status: 'pending'   },
  { id: 6, orderNumber: 'ORD-1006', customer: 'Amit Kumar',    items: 'Veg Biryani x1, Lassi x2',           amount: 260, time: '15 min ago', status: 'accepted'  },
  { id: 5, orderNumber: 'ORD-1005', customer: 'Neha Singh',    items: 'Dal Makhani, Naan x2',               amount: 180, time: '32 min ago', status: 'completed' },
  { id: 4, orderNumber: 'ORD-1004', customer: 'Ravi Verma',    items: 'Aloo Paratha x3, Lassi',             amount: 270, time: '1 hr ago',   status: 'rejected'  },
  { id: 3, orderNumber: 'ORD-1003', customer: 'Sunita Joshi',  items: 'Gulab Jamun x4, Dal Makhani',        amount: 280, time: '2 hrs ago',  status: 'completed' },
  { id: 2, orderNumber: 'ORD-1002', customer: 'Deepak Rao',    items: 'Masala Dosa x1, Lassi x1',           amount: 140, time: '3 hrs ago',  status: 'completed' },
  { id: 1, orderNumber: 'ORD-1001', customer: 'Anjali Mehta',  items: 'Paneer Butter Masala x2, Naan x4',  amount: 440, time: '4 hrs ago',  status: 'completed' },
];

export const WEEKLY_DATA  = [
  { l:'Mon',v:1200 },{ l:'Tue',v:1800 },{ l:'Wed',v:1400 },
  { l:'Thu',v:2200 },{ l:'Fri',v:2800 },{ l:'Sat',v:3200 },{ l:'Sun',v:2600 },
];
export const MONTHLY_DATA = [
  { l:'Jan',v:32000 },{ l:'Feb',v:28000 },{ l:'Mar',v:41000 },
  { l:'Apr',v:38000 },{ l:'May',v:52000 },{ l:'Jun',v:48000 },
];
export const YEARLY_DATA  = [
  { l:'2022',v:380000 },{ l:'2023',v:420000 },{ l:'2024',v:490000 },{ l:'2025',v:510000 },
];

export const PIE_DATA = [
  { name: 'Food',      value: 42, color: '#F59E0B' },
  { name: 'Beverages', value: 38, color: '#60A5FA' },
  { name: 'Snacks',    value: 20, color: '#A78BFA' },
];

export const CATEGORIES = ['Food', 'Beverages', 'Snacks', 'Desserts'];
export const EMOJIS     = ['☕','🍔','🧋','🌯','🥤','🥟','🍕','🍜','🧃','🍦','🥪','🌮'];


export const CATALOG = [
  { id: 'c1', name: 'Masala Dosa',          price: 80,  emoji: '🥞' },
  { id: 'c2', name: 'Paneer Butter Masala', price: 160, emoji: '🍛' },
  { id: 'c3', name: 'Veg Biryani',          price: 140, emoji: '🍚' },
  { id: 'c4', name: 'Dal Makhani',          price: 120, emoji: '🫕' },
  { id: 'c5', name: 'Naan',                 price: 30,  emoji: '🫓' },
  { id: 'c6', name: 'Lassi',                price: 60,  emoji: '🥛' },
  { id: 'c7', name: 'Gulab Jamun',          price: 40,  emoji: '🍮' },
  { id: 'c8', name: 'Aloo Paratha',         price: 70,  emoji: '🫔' },
];
