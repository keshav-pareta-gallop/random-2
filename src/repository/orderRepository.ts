import { orders, type Order } from "../data/orders.js";

export function findAll(): Order[] {
  return orders;
}

export function findById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}
