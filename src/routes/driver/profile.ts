import express from "express";
const router = express.Router();
import {
    driverLogin,
} from "../../controllers/driver";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /driver/profile/login:
 *   post:
 *     summary: Driver login
 *     tags:
 *       - Driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "driver@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       '200':
 *         description: Login successful
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
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     driver:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "67bf1f5867e753b86463b5d1"
 *                         name:
 *                           type: string
 *                           example: "John Driver"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "driver@example.com"
 *                         status:
 *                           type: string
 *                           enum: [available, on_trip, offline]
 *                           example: "available"
 *                         vehicleDetails:
 *                           type: object
 *                           properties:
 *                             model:
 *                               type: string
 *                               example: "BMW 7 Series"
 *                             licensePlate:
 *                               type: string
 *                               example: "XYZ-123"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-01T12:00:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-01T12:00:00.000Z"
 *       '401':
 *         description: Unauthorized
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
 *                   example: "Invalid email or password"
 */
router.post(
    "/login",
    validateKeyInputs({
        inputArr: ["email", "password"],
        key: "body",
    }),
    driverLogin,
);

export default router;
