import express from "express";
import { authenticateToken, requireCustomer } from "../../middlewares/auth";
import { validateKeyInputs } from "../../middlewares/validate";
import * as PaymentController from "../../controllers/payment";

const router = express.Router();

/**
 * @swagger
 * /customer/payment/createIntent:
 *   post:
 *     summary: Create a Stripe PaymentIntent
 *     tags: [Customer Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount in dollars
 *                 example: 25.50
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientSecret:
 *                       type: string
 *                       description: Client secret for frontend payment processing
 *                     paymentIntentId:
 *                       type: string
 *                       description: Stripe PaymentIntent ID
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Amount must be greater than 0"
 */
router.post(
    "/createIntent",
    authenticateToken,
    requireCustomer,
    validateKeyInputs({
        inputArr: ["amount"],
        key: "body",
    }),
    PaymentController.createPaymentIntent,
);

/**
 * @swagger
 * /customer/payment/history:
 *   get:
 *     summary: Get payment history for authenticated customer
 *     tags: [Customer Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       paymentIntentId:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       paymentMethod:
 *                         type: string
 *                       stripeChargeId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request
 *       404:
 *         description: Customer not found
 */
router.get(
    "/history",
    authenticateToken,
    requireCustomer,
    PaymentController.getPaymentHistory,
);

export default router;