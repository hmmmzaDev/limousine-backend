import Stripe from "stripe";
import PaymentModel from "../models/payment";
import { BadRequestError } from "../helpers/apiError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil",
});

export class PaymentService {
    /**
     * Creates a Stripe PaymentIntent
     * @param amount - Amount in cents (e.g., 2000 for $20.00)
     * @param currency - Currency code (defaults to USD)
     * @returns Promise with client_secret for frontend
     */
    static async createPaymentIntent(
        amount: number,
        currency: string = "USD"
    ): Promise<{ clientSecret: string; paymentIntentId: string }> {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency.toLowerCase(),
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret!,
                paymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            throw new BadRequestError(`Failed to create payment intent: ${error.message}`);
        }
    }

    /**
     * Verifies payment intent status and creates Payment record if succeeded
     * @param paymentIntentId - Stripe PaymentIntent ID
     * @param customerId - Customer ID
     * @returns Promise with Payment object if successful
     */
    static async verifyAndCreatePayment(
        paymentIntentId: string,
        customerId: string
    ): Promise<any> {
        try {
            // Retrieve payment intent from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            // Check if payment is succeeded
            if (paymentIntent.status !== "succeeded") {
                throw new BadRequestError(`Payment not completed. Status: ${paymentIntent.status}`);
            }

            // Check if payment already exists in our database
            const existingPayment = await PaymentModel.findOne({ paymentIntentId });
            if (existingPayment) {
                return existingPayment;
            }

            // Get charge ID if available
            let stripeChargeId = null;
            if (paymentIntent.latest_charge) {
                stripeChargeId = typeof paymentIntent.latest_charge === 'string'
                    ? paymentIntent.latest_charge
                    : paymentIntent.latest_charge.id;
            }

            // Create payment record
            const paymentData = {
                customerId,
                paymentIntentId,
                amount: paymentIntent.amount / 100, // Convert from cents to dollars
                currency: paymentIntent.currency.toUpperCase(),
                paymentMethod: paymentIntent.payment_method_types?.[0] || null,
                stripeChargeId,
            };

            const payment = await PaymentModel.create(paymentData);
            return payment;
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            throw new BadRequestError(`Failed to verify payment: ${error.message}`);
        }
    }

    /**
     * Get payment details from Stripe
     * @param paymentIntentId - Stripe PaymentIntent ID
     * @returns Promise with payment details
     */
    static async getPaymentDetails(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            return await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            throw new BadRequestError(`Failed to retrieve payment details: ${error.message}`);
        }
    }

    /**
     * Get payment history for a customer
     * @param customerId - Customer ID
     * @returns Promise with array of payments
     */
    static async getCustomerPayments(customerId: string): Promise<any[]> {
        try {
            return await PaymentModel.find({ customerId }).sort({ createdAt: -1 });
        } catch (error) {
            throw new BadRequestError(`Failed to retrieve payment history: ${error.message}`);
        }
    }
}