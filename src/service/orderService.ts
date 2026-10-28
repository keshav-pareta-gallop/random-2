import { getAllOrders, type Order } from "../repository/orderRepository";

export interface OrderListResponse {
  items: Order[];
  total: number;
}

export function listOrders(): OrderListResponse {
  const items = getAllOrders();
  return { items, total: items.length };
}
