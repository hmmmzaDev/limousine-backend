import express from "express";
const router = express.Router();
import {
    submitRideRequest,
    acceptRideQuote,
    cancelBooking,
    fetchBookingsByCustomer,
} from "../../controllers/booking";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireCustomer } from "../../middlewares/auth";

/**
 * @openapi
 * /customer/booking/submitRequest:
 *   post:
 *     summary: Submit a ride request
 *     tags:
 *       - Customer - Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startLocation
 *               - finalLocation
 *               - numberOfPassengers
 *               - numberOfLuggage
 *               - contactInfo
 *               - rideTime
 *             properties:
 *               startLocation:
 *                 type: object
 *                 required:
 *                   - longitude
 *                   - latitude
 *                   - locationName
 *                 properties:
 *                   longitude:
 *                     type: number
 *                     example: -73.935242
 *                   latitude:
 *                     type: number
 *                     example: 40.730610
 *                   locationName:
 *                     type: string
 *                     example: "123 Main Street, Downtown"
 *               finalLocation:
 *                 type: object
 *                 required:
 *                   - longitude
 *                   - latitude
 *                   - locationName
 *                 properties:
 *                   longitude:
 *                     type: number
 *                     example: -73.935242
 *                   latitude:
 *                     type: number
 *                     example: 40.730610
 *                   locationName:
 *                     type: string
 *                     example: "456 Oak Avenue, Uptown"
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - longitude
 *                     - latitude
 *                     - locationName
 *                   properties:
 *                     longitude:
 *                       type: number
 *                       example: -73.935242
 *                     latitude:
 *                       type: number
 *                       example: 40.730610
 *                     locationName:
 *                       type: string
 *                       example: "789 Pine Street, Midtown"
 *               numberOfPassengers:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *               numberOfLuggage:
 *                 type: number
 *                 minimum: 0
 *                 example: 1
 *               note:
 *                 type: string
 *                 example: "Please arrive 10 minutes early"
 *               contactInfo:
 *                 type: string
 *                 example: "+1234567890"
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
 *                       type: object
 *                     driverId:
 *                       type: object
 *                       nullable: true
 *                     startLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "123 Main Street, Downtown"
 *                     finalLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "456 Oak Avenue, Uptown"
 *                     stops:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           longitude:
 *                             type: number
 *                           latitude:
 *                             type: number
 *                           locationName:
 *                             type: string
 *                     numberOfPassengers:
 *                       type: number
 *                       example: 2
 *                     numberOfLuggage:
 *                       type: number
 *                       example: 1
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: "Please arrive 10 minutes early"
 *                     contactInfo:
 *                       type: string
 *                       example: "+1234567890"
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
 *                       example: "pending"
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
 *                   example: "Customer not found"
 */
router.post(
    "/submitRequest",
    authenticateToken,
    requireCustomer,
    validateKeyInputs({
        inputArr: ["startLocation", "finalLocation", "numberOfPassengers", "numberOfLuggage", "contactInfo", "rideTime", "-stops", "-note"],
        key: "body",
    }),
    submitRideRequest,
);

/**
 * @openapi
 * /customer/booking/acceptQuote:
 *   post:
 *     summary: Accept ride quote with payment verification
 *     tags:
 *       - Customer - Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - paymentIntentId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *               paymentIntentId:
 *                 type: string
 *                 example: "pi_3ABC123def456GHI"
 *                 description: "Stripe PaymentIntent ID from successful payment"
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
 *                     startLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "123 Main Street, Downtown"
 *                     finalLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "456 Oak Avenue, Uptown"
 *                     stops:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           longitude:
 *                             type: number
 *                           latitude:
 *                             type: number
 *                           locationName:
 *                             type: string
 *                     numberOfPassengers:
 *                       type: number
 *                       example: 2
 *                     numberOfLuggage:
 *                       type: number
 *                       example: 1
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: "Please arrive 10 minutes early"
 *                     contactInfo:
 *                       type: string
 *                       example: "+1234567890"
 *                     rideTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-25T15:30:00.000Z"
 *                     finalPrice:
 *                       type: number
 *                       example: 75.50
 *                     status:
 *                       type: string
 *                       example: "assigned"
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
    authenticateToken,
    requireCustomer,
    validateKeyInputs({
        inputArr: ["bookingId", "paymentIntentId"],
        key: "body",
    }),
    acceptRideQuote,
);

/**
 * @openapi
 * /customer/booking/cancel:
 *   post:
 *     summary: Cancel booking
 *     tags:
 *       - Customer - Booking
 *     security:
 *       - bearerAuth: []
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
 *                     startLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "123 Main Street, Downtown"
 *                     finalLocation:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: -73.935242
 *                         latitude:
 *                           type: number
 *                           example: 40.730610
 *                         locationName:
 *                           type: string
 *                           example: "456 Oak Avenue, Uptown"
 *                     stops:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           longitude:
 *                             type: number
 *                           latitude:
 *                             type: number
 *                           locationName:
 *                             type: string
 *                     numberOfPassengers:
 *                       type: number
 *                       example: 2
 *                     numberOfLuggage:
 *                       type: number
 *                       example: 1
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: "Please arrive 10 minutes early"
 *                     contactInfo:
 *                       type: string
 *                       example: "+1234567890"
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
 *                       example: "cancelled"
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
    authenticateToken,
    requireCustomer,
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    cancelBooking,
);

/**
 * @openapi
 * /customer/booking/byCustomer:
 *   get:
 *     summary: Get all bookings for a specific customer
 *     tags:
 *       - Customer - Booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer to fetch bookings for
 *         example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Bookings retrieved successfully
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
 *                         example: "67bf1f5867e753b86463b5d1"
 *                       customerId:
 *                         type: object
 *                       driverId:
 *                         type: object
 *                         nullable: true
 *                       startLocation:
 *                         type: object
 *                       finalLocation:
 *                         type: object
 *                       stops:
 *                         type: array
 *                       numberOfPassengers:
 *                         type: number
 *                       numberOfLuggage:
 *                         type: number
 *                       note:
 *                         type: string
 *                         nullable: true
 *                       contactInfo:
 *                         type: string
 *                       rideTime:
 *                         type: string
 *                         format: date-time
 *                       finalPrice:
 *                         type: number
 *                         nullable: true
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       '404':
 *         description: Customer not found or no bookings found
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
 *                   example: "No Record Found"
 */
router.get(
    "/byCustomer",
    authenticateToken,
    requireCustomer,
    validateKeyInputs({
        inputArr: ["customerId"],
        key: "query",
    }),
    fetchBookingsByCustomer,
);

export default router;
