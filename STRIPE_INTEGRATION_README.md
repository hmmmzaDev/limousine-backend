# Stripe Payments Integration

This document explains how to use the Stripe payments integration in the limousine booking platform.

## Setup

1. **Install Dependencies**: Already installed via `pnpm add stripe`

2. **Environment Variables**: Add your Stripe keys to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

3. **Database**: The Payment model and updated Booking model are automatically created when the server starts.

## API Endpoints

### 1. Create Payment Intent
**POST** `/customer/payment/createIntent`

Creates a Stripe PaymentIntent for processing payment on the frontend.

**Headers:**
```
Authorization: Bearer <customer_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 25.50
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### 2. Accept Ride Quote (Enhanced)
**POST** `/customer/booking/acceptQuote`

Now requires payment verification before accepting the booking.

**Headers:**
```
Authorization: Bearer <customer_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookingId": "booking_id_here",
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "booking_id",
    "status": "Assigned",
    "paymentId": "payment_record_id",
    // ... other booking fields
  }
}
```

### 3. Payment History
**GET** `/customer/payment/history`

Retrieves payment history for the authenticated customer.

**Headers:**
```
Authorization: Bearer <customer_jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "payment_id",
      "customerId": "customer_id",
      "paymentIntentId": "pi_xxx",
      "amount": 25.50,
      "currency": "USD",
      "paymentMethod": "card",
      "stripeChargeId": "ch_xxx",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

## Payment Flow

1. **Create Payment Intent**: Frontend calls `/customer/payment/createIntent` with the ride amount
2. **Process Payment**: Frontend uses Stripe Elements with the `clientSecret` to collect payment
3. **Accept Quote**: After successful payment, frontend calls `/customer/booking/acceptQuote` with `paymentIntentId`
4. **Verification**: Backend verifies payment with Stripe and creates payment record
5. **Complete Booking**: Booking is marked as "Assigned" and linked to the payment

## Database Schema

### Payment Model
```typescript
{
  id: string
  customerId: string (ref: Customer)
  paymentIntentId: string (unique)
  amount: number
  currency: string (default: "USD")
  paymentMethod?: string
  stripeChargeId?: string
  createdAt: Date
  updatedAt: Date
}
```

### Updated Booking Model
```typescript
{
  // ... existing fields
  paymentId?: string (ref: Payment)
}
```

## Error Handling

- **Payment Not Completed**: If PaymentIntent status is not "succeeded"
- **Duplicate Payment**: Prevents duplicate payment records for the same PaymentIntent
- **Invalid Amount**: Validates amount is greater than 0
- **Authentication**: Requires valid customer JWT token
- **Ownership**: Customers can only accept quotes for their own bookings

## Security Features

- Only succeeded payments are stored in the database
- Payment verification happens server-side with Stripe API
- Customer ownership validation for all operations
- Secure API key handling via environment variables

## Testing

Use Stripe's test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`

## Notes

- Currency defaults to USD for all transactions
- Amounts are stored in dollars (converted from Stripe's cents)
- No refund handling implemented (rides only proceed after payment)
- PaymentIntents are created immediately but only stored after verification
- API responses use camelCase naming convention (clientSecret, paymentIntentId)