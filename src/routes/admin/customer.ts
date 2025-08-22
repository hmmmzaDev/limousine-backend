import express from "express";
const router = express.Router();
import {
    findAll,
    findById,
    updateRecord,
    deleteById,
} from "../../controllers/customer";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireAdmin } from "../../middlewares/auth";
import { sendFcmNotification } from "../../services/notification/providers/fcm";
import { Request, Response, NextFunction } from "express";

async function notifyController(req: Request, res: Response | any, next: NextFunction) {
    try {
        const { title, message, fcmToken } = req["validData"];
        const result = await sendFcmNotification({ token: fcmToken, title, body: message });
        return res.json({ status: "success", data: { messageId: result } });
    } catch (error) {
        next(error);
    }
}

/**
 * @openapi
 * /admin/customer/getAll:
 *   get:
 *     summary: Fetch all customers
 *     tags:
 *       - Admin - Customer
 *     responses:
 *       '200':
 *         description: Customers fetched successfully
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
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "john.doe@example.com"
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
        inputArr: [],
        key: "query",
    }),
    findAll,
);

/**
 * @openapi
 * /admin/customer/getById:
 *   get:
 *     summary: Fetch customer by ID
 *     tags:
 *       - Admin - Customer
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Customer fetched successfully
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
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *       '404':
 *         description: Customer not found
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
 * /admin/customer/updateRecord:
 *   post:
 *     summary: Update customer record
 *     tags:
 *       - Admin - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recordId
 *             properties:
 *               recordId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *     responses:
 *       '200':
 *         description: Customer updated successfully
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
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jane.doe@example.com"
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
 *       '404':
 *         description: Customer not found
 */
router.post(
    "/updateRecord",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        key: "body",
        inputArr: [
            "recordId",
            "-name",
            "-email",
        ],
    }),
    updateRecord,
);

/**
 * @openapi
 * /admin/customer/deleteById:
 *   post:
 *     summary: Delete customer by ID
 *     tags:
 *       - Admin - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recordId
 *             properties:
 *               recordId:
 *                 type: string
 *                 example: "67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "Record deleted successfully"
 *       '404':
 *         description: Customer not found
 */
router.post(
    "/deleteById",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["recordId"],
        key: "body",
    }),
    deleteById,
);

/**
 * @openapi
 * /admin/customer/notify:
 *   post:
 *     summary: Send an FCM notification to a device token
 *     tags:
 *       - Admin - Customer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - fcmToken
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               fcmToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Notification sent
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
 *                     messageId:
 *                       type: string
 *                       example: "projects/123456/messages/0:1700000000000000%abcdef"
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
 *                   example: "you have missed some inputs in body"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post(
    "/notify",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["title", "message", "fcmToken"],
        key: "body",
    }),
    notifyController,
);

export default router;
