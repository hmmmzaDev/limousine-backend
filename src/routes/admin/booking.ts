import express from "express";
const router = express.Router();
import {
    fetchBookings,
    findById,
    assignDriverAndSetPrice,
} from "../../controllers/booking";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireAdmin } from "../../middlewares/auth";

/**
 * @openapi
 * /admin/booking/getAll:
 *   get:
 *     summary: Fetch bookings with optional status filtering
 *     tags:
 *       - Admin - Booking
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["pending", "awaiting-acceptance", "assigned", "en-route", "completed", "cancelled"]
 *           example: "pending"
 *     responses:
 *       '200':
 *         description: Bookings fetched successfully
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
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "67bf1f5867e753b86463b5d1"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *                       driverId:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "67bf1f5867e753b86463b5d1"
 *                           name:
 *                             type: string
 *                             example: "Jane Smith"
 *                           vehicleDetails:
 *                             type: object
 *                             properties:
 *                               model:
 *                                 type: string
 *                                 example: "Mercedes S-Class"
 *                               licensePlate:
 *                                 type: string
 *                                 example: "ABC-123"
 *                       pickupLocation:
 *                         type: string
 *                         example: "123 Main Street, Downtown"
 *                       dropoffLocation:
 *                         type: string
 *                         example: "456 Oak Avenue, Uptown"
 *                       rideTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-25T15:30:00.000Z"
 *                       finalPrice:
 *                         type: number
 *                         nullable: true
 *                         example: 50.00
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T12:00:00.000Z"
 *       '404':
 *         description: No records found
 */
router.get(
    "/getAll",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["-status"],
        key: "query",
    }),
    fetchBookings,
);

/**
 * @openapi
 * /admin/booking/getById:
 *   get:
 *     summary: Fetch booking by ID
 *     tags:
 *       - Admin - Booking
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Booking fetched successfully
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
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "67bf1f5867e753b86463b5d1"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                     driverId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "67bf1f5867e753b86463b5d1"
 *                         name:
 *                           type: string
 *                           example: "Jane Smith"
 *                         vehicleDetails:
 *                           type: object
 *                           properties:
 *                             model:
 *                               type: string
 *                               example: "Mercedes S-Class"
 *                             licensePlate:
 *                               type: string
 *                               example: "ABC-123"
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
 *                       example: 50.00
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
 *       '404':
 *         description: Booking not found
 */
router.get(
    "/getById",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["id"],
        key: "query",
    }),
    findById,
);

/**
 * @openapi
 * /admin/booking/assignDriverAndSetPrice:
 *   post:
 *     summary: Assign driver and set price for a booking
 *     tags:
 *       - Admin - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - driverId
 *               - finalPrice
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *               driverId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d2"
 *               finalPrice:
 *                 type: number
 *                 example: 75.50
 *     responses:
 *       '200':
 *         description: Driver assigned and price set successfully
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
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "67bf1f5867e753b86463b5d2"
 *                         name:
 *                           type: string
 *                           example: "Jane Smith"
 *                         status:
 *                           type: string
 *                           example: "available"
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
 *                       example: "awaiting-acceptance"
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
 *                   example: "Booking must be in 'Pending' status to assign driver"
 *       '404':
 *         description: Booking or driver not found
 */
router.post(
    "/assignDriverAndSetPrice",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["bookingId", "driverId", "finalPrice"],
        key: "body",
    }),
    assignDriverAndSetPrice,
);

export default router;
