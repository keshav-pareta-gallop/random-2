export interface Order {
  id: string;
  placedAt: string;
  total: number;
  status: string;
}

const seedOrders: Order[] = [
  {
    id: "ord-001",
    placedAt: "2024-10-15T09:30:00Z",
    total: 59.99,
    status: "delivered",
  },
  {
    id: "ord-002",
    placedAt: "2024-11-02T14:15:00Z",
    total: 124.5,
    status: "shipped",
  },
  {
    id: "ord-003",
    placedAt: "2024-11-20T18:45:00Z",
    total: 37.0,
    status: "processing",
  },
];

let orders: Order[] = [...seedOrders];

export function getAllOrders(): Order[] {
  return [...orders];
}

export function clearOrders(): void {
  orders = [];
}

export function resetOrders(): void {
  orders = [...seedOrders];
}
