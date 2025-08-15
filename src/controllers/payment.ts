import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { PaymentService } from "../services/paymentService";
import { CustomerService } from "../services";

export async function createPaymentIntent(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        const { amount } = req["validData"];

        // Validate amount
        if (!amount || amount <= 0) {
            return next(new BadRequestError("Amount must be greater than 0"));
        }

        // Create payment intent
        const paymentIntent = await PaymentService.createPaymentIntent(amount);

        return res.json({
            status: "success",
            data: {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.payment_intent_id,
            },
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}

export async function getPaymentHistory(
    req: Request,
    res: Response | any,
    next: NextFunction,
) {
    try {
        // Get customer ID from authenticated user
        const customerId = req.user?.userId;
        if (!customerId) {
            return next(new BadRequestError("Customer ID not found in authentication"));
        }

        // Validate customer exists
        const customer = await CustomerService.findById(customerId);
        if (!customer) {
            return next(new NotFoundError("Customer not found"));
        }

        // Get payment history
        const payments = await PaymentService.getCustomerPayments(customerId);

        return res.json({
            status: "success",
            data: payments,
        });
    } catch (error) {
        return next(new BadRequestError(error.message));
    }
}