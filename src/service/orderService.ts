import { findAll, findById } from "../repository/orderRepository.js";

export function listOrders() {
  const all = findAll();
  return {
    items: all.map(({ id, placedAt, total, status }) => ({
      id,
      placedAt,
      total,
      status,
    })),
    total: all.length,
  };
}

export function getOrder(id: string) {
  return findById(id) ?? null;
}
