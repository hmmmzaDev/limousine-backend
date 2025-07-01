import express from "express";
const router = express.Router();
import {
    fetchAssignedRides,
    updateRideStatus,
} from "../../controllers/booking";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireDriver } from "../../middlewares/auth";

/**
 * @openapi
 * /driver/booking/getAssignedRides:
 *   post:
 *     summary: Fetch assigned rides for the authenticated driver
 *     tags:
 *       - Driver - Booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Assigned rides fetched successfully
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
 *                         example: 75.50
 *                       status:
 *                         type: string
 *                         enum: ["Assigned", "En-Route"]
 *                         example: "Assigned"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T12:00:00.000Z"
 *       '404':
 *         description: Driver not found or no assigned rides
 */
router.post(
    "/getAssignedRides",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: [],
        key: "body",
    }),
    fetchAssignedRides,
);

/**
 * @openapi
 * /driver/booking/updateStatus:
 *   post:
 *     summary: Update ride status (En-Route or Completed)
 *     tags:
 *       - Driver - Booking
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
 *               - newStatus
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *               newStatus:
 *                 type: string
 *                 enum: ["En-Route", "Completed"]
 *                 example: "En-Route"
 *     responses:
 *       '200':
 *         description: Ride status updated successfully
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
 *                       enum: ["En-Route", "Completed"]
 *                       example: "En-Route"
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
 *                   example: "Cannot transition from 'Assigned' to 'Completed'. Valid transitions from 'Assigned': En-Route"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/updateStatus",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: ["bookingId", "newStatus"],
        key: "body",
    }),
    updateRideStatus,
);

export default router;
