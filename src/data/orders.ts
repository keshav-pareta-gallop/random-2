export interface OrderLine {
  sku: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  placedAt: string;
  total: number;
  status: string;
  lines: OrderLine[];
}

export const orders: Order[] = [
  {
    id: "order-001",
    placedAt: "2024-08-15T10:30:00Z",
    total: 59.97,
    status: "completed",
    lines: [
      { sku: "SKU-A1", name: "Widget Alpha", qty: 2, price: 19.99 },
      { sku: "SKU-A2", name: "Widget Beta", qty: 1, price: 19.99 },
    ],
  },
  {
    id: "order-002",
    placedAt: "2024-09-01T14:15:00Z",
    total: 124.50,
    status: "shipped",
    lines: [
      { sku: "SKU-B1", name: "Gadget Pro", qty: 1, price: 99.50 },
      { sku: "SKU-B2", name: "Gadget Mini", qty: 1, price: 25.00 },
    ],
  },
  {
    id: "order-003",
    placedAt: "2024-09-20T09:00:00Z",
    total: 42.00,
    status: "processing",
    lines: [
      { sku: "SKU-C1", name: "Accessory Pack", qty: 3, price: 14.00 },
    ],
  },
];
