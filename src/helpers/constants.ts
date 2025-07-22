export const BASE_URL = ""

export enum BookingStatus {
  PENDING = "pending",
  AWAITING_ACCEPTANCE = "awaiting-acceptance",
  ASSIGNED = "assigned",
  HEADING_TO_PICKUP = "heading-to-pickup",
  ARRIVED_AT_PICKUP = "arrived-at-pickup",
  EN_ROUTE = "en-route",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum DriverStatus {
  AVAILABLE = "available",
  ON_TRIP = "on-trip",
  OFFLINE = "offline"
}
