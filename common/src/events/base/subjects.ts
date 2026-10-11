export enum Subjects {
  AssetCreated = "asset.created",
  AssetUpdated = "asset.updated",
  OrderCreated = "order.created",
  OrderCancelled = "order.cancelled",
  ExpirationComplete = "expiration.complete",
  PaymentCreated = "payment.created",
}

export enum Streams {
  Asset = "ASSET",
  Order = "ORDER",
  Expiration = "EXPIRATION",
  Payment = "PAYMENT",
}
