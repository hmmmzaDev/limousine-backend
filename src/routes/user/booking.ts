import express from "express";
const router = express.Router();
import {
    submitRideRequest,
} from "../../controllers/booking";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /submitRequest:
 *   post:
 *     summary: Submit a new ride request
 *     tags:
 *       - User - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - pickupLocation
 *               - dropoffLocation
 *               - rideTime
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *               pickupLocation:
 *                 type: string
 *                 example: "123 Main Street, Downtown"
 *               dropoffLocation:
 *                 type: string
 *                 example: "456 Oak Avenue, Uptown"
 *               rideTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T15:30:00.000Z"
 *     responses:
 *       '200':
 *         description: Ride request submitted successfully
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
 *                     id:
 *                       type: string
 *                       example: "67bf1f5867e753b86463b5d1"
 *                     customerId:
 *                       type: string
 *                       example: "67bf1f5867e753b86463b5d1"
 *                     driverId:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     pickupLocation:
 *                       type: string
 *                       example: "123 Main Street, Downtown"
 *                     dropoffLocation:
 *                       type: string
 *                       example: "456 Oak Avenue, Uptown"
 *                     rideTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T15:30:00.000Z"
 *                     finalPrice:
 *                       type: number
 *                       nullable: true
 *                       example: null
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *       '400':
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
 *                   example: "Ride time must be in the future"
 *       '404':
 *         description: Customer not found
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
 *                   example: "Customer not found"
 */
router.post(
    "/submitRequest",
    validateKeyInputs({
        inputArr: ["customerId", "pickupLocation", "dropoffLocation", "rideTime"],
        key: "body",
    }),
    submitRideRequest,
);

export default router;
