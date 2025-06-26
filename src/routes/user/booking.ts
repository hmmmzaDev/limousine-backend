import express from "express";
const router = express.Router();
import {
    submitRideRequest,
    acceptRideQuote,
    cancelBooking,
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

/**
 * @openapi
 * /acceptQuote:
 *   post:
 *     summary: Accept ride quote
 *     tags:
 *       - User - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Ride quote accepted successfully
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
 *                       type: object
 *                     driverId:
 *                       type: object
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
 *                       example: 75.50
 *                     status:
 *                       type: string
 *                       example: "Assigned"
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
 *                   example: "Booking must be in 'Awaiting-Acceptance' status to accept quote"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/acceptQuote",
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    acceptRideQuote,
);

/**
 * @openapi
 * /cancel:
 *   post:
 *     summary: Cancel booking
 *     tags:
 *       - User - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Booking cancelled successfully
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
 *                       type: object
 *                     driverId:
 *                       type: object
 *                       nullable: true
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
 *                       example: 75.50
 *                     status:
 *                       type: string
 *                       example: "Cancelled"
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
 *                   example: "Cannot cancel a completed booking"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/cancel",
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    cancelBooking,
);

export default router;
