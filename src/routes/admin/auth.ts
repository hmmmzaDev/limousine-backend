import express from "express";
const router = express.Router();
import {
    sendOtp,
    verifyOtp,
} from "../../controllers/adminOtp";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /sendOtp:
 *   post:
 *     summary: Send OTP for admin login
 *     tags:
 *       - Admin - Auth
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
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
 *                   example: "Something went wrong"
 */
router.post(
    "/sendOtp",
    validateKeyInputs({
        inputArr: [],
        key: "body",
    }),
    sendOtp,
);

/**
 * @openapi
 * /verifyOtp:
 *   post:
 *     summary: Verify OTP and get admin authentication token
 *     tags:
 *       - Admin - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456789012"
 *                 description: "12-digit OTP received via email"
 *     responses:
 *       '200':
 *         description: OTP verified successfully
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
 *                       description: "JWT token for admin authentication"
 *                     message:
 *                       type: string
 *                       example: "OTP verified successfully"
 *       '401':
 *         description: Invalid OTP
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
 *                   example: "Invalid OTP"
 *       '404':
 *         description: No record found
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
router.post(
    "/verifyOtp",
    validateKeyInputs({
        inputArr: ["otp"],
        key: "body",
    }),
    verifyOtp,
);

export default router;
