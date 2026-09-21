export enum OrderStatus {
  // Order created but ticket not reserved
  Created = "created",

  // Ticket is already reserved, payment is expired or User has cancelled the order
  Cancelled = "cancelled",

  // Ticket is reserved but payment is still pending
  AwaitingPayment = "awaiting:payment",

  // Ticket is reserved and payment is complete
  Complete = "complete",
}
