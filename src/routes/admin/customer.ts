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

/**
 * @openapi
 * /getAll:
 *   post:
 *     summary: Fetch all customers
 *     tags:
 *       - Admin - Customer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
router.post(
    "/getAll",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: [],
        key: "body",
    }),
    findAll,
);

/**
 * @openapi
 * /getById:
 *   post:
 *     summary: Fetch customer by ID
 *     tags:
 *       - Admin - Customer
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
router.post(
    "/getById",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["id"],
        key: "body",
    }),
    findById,
);

/**
 * @openapi
 * /updateRecord:
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
 * /deleteById:
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

export default router;
