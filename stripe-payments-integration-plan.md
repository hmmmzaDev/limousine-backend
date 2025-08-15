# Stripe Payments Integration Plan

## 1. Dependencies & Environment
- Install `stripe` package
- Add Stripe keys to environment variables:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY` (for frontend)

## 2. Database Changes

### New Payment Model (only for succeeded payments)
```typescript
id: string (primary key)
customerId: string (foreign key to Customer)
paymentIntentId: string
amount: number
currency: string (default: 'USD')
paymentMethod?: string
stripeChargeId?: string
createdAt: Date
updatedAt: Date
```

### Add to Booking Model
```typescript
paymentId?: string (foreign key to Payment model)
```

## 3. PaymentService
Create `src/services/paymentService.ts`:
- `createPaymentIntent(amount, currency = 'USD')` - Creates Stripe PaymentIntent, returns client_secret
- `verifyAndCreatePayment(paymentIntentId, customerId)` - Verifies payment succeeded, creates Payment record, returns Payment object

## 4. API Endpoints

### Create Payment Intent
**Route**: `POST /customer/payment/createIntent`
- Accept only amount (currency defaults to USD)
- Create PaymentIntent with Stripe
- Return client_secret immediately (no database storage yet)

### Payment History
**Route**: `GET /customer/payment/history`
- Query Payment records by authenticated customer's ID
- Return payment history

## 5. Enhanced acceptQuote API

### Enhanced acceptQuote
**Route**: `POST /customer/booking/acceptQuote`
- Add paymentIntentId to request body
- Call PaymentService.verifyAndCreatePayment(paymentIntentId, customerId)
- Link created Payment record to booking
- Complete booking acceptance only if payment verification succeeds

## 6. Controller Structure
- New `src/controllers/payment.ts` for payment operations
- New `src/routes/customer/payment.ts` for payment routes
- Enhanced BookingController.acceptQuote with payment verification and storage

## Payment Flow
1. **Create Intent**: Frontend calls `/customer/payment/createIntent` with amount
2. **Frontend Payment**: User completes payment using Stripe Elements with client_secret
3. **Verify & Store**: Frontend calls `/customer/booking/acceptQuote` with paymentIntentId
4. **Complete Booking**: Payment is verified, stored in database, and linked to booking

## Notes
- Only succeeded payments are stored in the database
- No refund or cancellation handling needed (rides only proceed after successful payment)
- Currency defaults to USD for all transactions