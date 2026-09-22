import { Subjects } from "../base/subjects";
import { OrderStatus } from "./types/orders-status";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    asset: {
      id: string;
      price: number;
    };
  };
}
