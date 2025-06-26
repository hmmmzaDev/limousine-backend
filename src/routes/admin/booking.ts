import express from "express";
const router = express.Router();
import {
    fetchBookings,
    findById,
} from "../../controllers/booking";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /getAll:
 *   post:
 *     summary: Fetch bookings with optional status filtering
 *     tags:
 *       - Admin - Booking
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Awaiting-Acceptance", "Assigned", "En-Route", "Completed", "Cancelled"]
 *                 example: "Pending"
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
 *                         example: "Pending"
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
router.post(
    "/getAll",
    validateKeyInputs({
        inputArr: ["-status"],
        key: "body",
    }),
    fetchBookings,
);

/**
 * @openapi
 * /getById:
 *   post:
 *     summary: Fetch booking by ID
 *     tags:
 *       - Admin - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
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
 *                       example: "Pending"
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
router.post(
    "/getById",
    validateKeyInputs({
        inputArr: ["id"],
        key: "body",
    }),
    findById,
);

export default router;
