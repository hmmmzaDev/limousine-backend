import express from "express";
const router = express.Router();
import {
    addRecord,
    findAll,
    findById,
    updateRecord,
    deleteById,
} from "../../controllers/driver";
import { validateKeyInputs } from "../../middlewares/validate";
import { authenticateToken, requireAdmin } from "../../middlewares/auth";

/**
 * @openapi
 * /addRecord:
 *   post:
 *     summary: Add new driver
 *     tags:
 *       - Admin - Driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - vehicleDetails
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.smith@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *               vehicleDetails:
 *                 type: object
 *                 required:
 *                   - model
 *                   - licensePlate
 *                 properties:
 *                   model:
 *                     type: string
 *                     example: "Mercedes S-Class"
 *                   licensePlate:
 *                     type: string
 *                     example: "ABC-123"
 *               status:
 *                 type: string
 *                 enum: ["available", "on_trip", "offline"]
 *                 example: "available"
 *     responses:
 *       '200':
 *         description: Driver created successfully
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
 *                       example: "John Smith"
 *                     vehicleDetails:
 *                       type: object
 *                       properties:
 *                         model:
 *                           type: string
 *                           example: "Mercedes S-Class"
 *                         licensePlate:
 *                           type: string
 *                           example: "ABC-123"
 *                     status:
 *                       type: string
 *                       example: "available"
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
 */
router.post(
    "/addRecord",
    authenticateToken,
    requireAdmin,
    validateKeyInputs({
        inputArr: ["name", "email", "password", "vehicleDetails", "-status"],
        key: "body",
    }),
    addRecord,
);

/**
 * @openapi
 * /getAll:
 *   post:
 *     summary: Fetch all drivers
 *     tags:
 *       - Admin - Driver
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["available", "on_trip", "offline"]
 *                 example: "available"
 *     responses:
 *       '200':
 *         description: Drivers fetched successfully
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
 *                         example: "John Smith"
 *                       vehicleDetails:
 *                         type: object
 *                         properties:
 *                           model:
 *                             type: string
 *                             example: "Mercedes S-Class"
 *                           licensePlate:
 *                             type: string
 *                             example: "ABC-123"
 *                       status:
 *                         type: string
 *                         example: "available"
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
        inputArr: ["-status"],
        key: "body",
    }),
    findAll,
);

/**
 * @openapi
 * /getById:
 *   post:
 *     summary: Fetch driver by ID
 *     tags:
 *       - Admin - Driver
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
 *         description: Driver fetched successfully
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
 *                       example: "John Smith"
 *                     vehicleDetails:
 *                       type: object
 *                       properties:
 *                         model:
 *                           type: string
 *                           example: "Mercedes S-Class"
 *                         licensePlate:
 *                           type: string
 *                           example: "ABC-123"
 *                     status:
 *                       type: string
 *                       example: "available"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T12:00:00.000Z"
 *       '404':
 *         description: Driver not found
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
 *     summary: Update driver record
 *     tags:
 *       - Admin - Driver
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
 *                 example: "Jane Smith"
 *               vehicleDetails:
 *                 type: object
 *                 properties:
 *                   model:
 *                     type: string
 *                     example: "BMW 7 Series"
 *                   licensePlate:
 *                     type: string
 *                     example: "XYZ-789"
 *               status:
 *                 type: string
 *                 enum: ["available", "on_trip", "offline"]
 *                 example: "offline"
 *     responses:
 *       '200':
 *         description: Driver updated successfully
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
 *                       example: "Jane Smith"
 *                     vehicleDetails:
 *                       type: object
 *                       properties:
 *                         model:
 *                           type: string
 *                           example: "BMW 7 Series"
 *                         licensePlate:
 *                           type: string
 *                           example: "XYZ-789"
 *                     status:
 *                       type: string
 *                       example: "offline"
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
 *         description: Driver not found
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
            "-vehicleDetails",
            "-status",
        ],
    }),
    updateRecord,
);

/**
 * @openapi
 * /deleteById:
 *   post:
 *     summary: Delete driver by ID
 *     tags:
 *       - Admin - Driver
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
 *         description: Driver deleted successfully
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
 *         description: Driver not found
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
