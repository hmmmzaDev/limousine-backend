import express from "express";
const router = express.Router();
import {
    fetchAssignedRides,
    startHeadingToPickup,
    markArrivedAtPickup,
    startRide,
    completeRide
} from "../../controllers/booking";
import { BookingStatus } from "../../helpers/constants";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireDriver } from "../../middlewares/auth";

/**
 * @openapi
 * /driver/booking/getAssignedRides:
 *   get:
 *     summary: Fetch assigned rides for the authenticated driver
 *     tags:
 *       - Driver - Booking
 *     security:
 *       - bearerAuth: []
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
 *                         enum: [BookingStatus.ASSIGNED, BookingStatus.HEADING_TO_PICKUP, BookingStatus.ARRIVED_AT_PICKUP, BookingStatus.EN_ROUTE]
 *                         example: BookingStatus.ASSIGNED
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
router.get(
    "/getAssignedRides",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: [],
        key: "query",
    }),
    fetchAssignedRides,
);

/**
 * @openapi
 * /driver/booking/startHeadingToPickup:
 *   post:
 *     summary: Driver starts heading to pickup location
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                     status:
 *                       type: string
 *                       example: BookingStatus.HEADING_TO_PICKUP
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
 *                   example: "Booking must be in 'assigned' status to start heading to pickup"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/startHeadingToPickup",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    startHeadingToPickup,
);

/**
 * @openapi
 * /driver/booking/markArrivedAtPickup:
 *   post:
 *     summary: Driver marks arrival at pickup location
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                     status:
 *                       type: string
 *                       example: BookingStatus.ARRIVED_AT_PICKUP
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
 *                   example: "Booking must be in 'heading-to-pickup' status to mark as arrived at pickup"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/markArrivedAtPickup",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    markArrivedAtPickup,
);

/**
 * @openapi
 * /driver/booking/startRide:
 *   post:
 *     summary: Driver starts the ride (customer is in vehicle and journey begins)
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                     status:
 *                       type: string
 *                       example: BookingStatus.EN_ROUTE
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
 *                   example: "Booking must be in 'arrived-at-pickup' status to start the ride"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/startRide",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    startRide,
);

/**
 * @openapi
 * /driver/booking/completeRide:
 *   post:
 *     summary: Driver completes the ride (arrived at destination)
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                     status:
 *                       type: string
 *                       example: BookingStatus.COMPLETED
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
 *                   example: "Booking must be in 'en-route' status to complete the ride"
 *       '404':
 *         description: Booking not found
 */
router.post(
    "/completeRide",
    authenticateToken,
    requireDriver,
    validateKeyInputs({
        inputArr: ["bookingId"],
        key: "body",
    }),
    completeRide,
);

export default router;
