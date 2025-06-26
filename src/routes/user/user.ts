import express from "express";
const router = express.Router();
import {
    addRecord,
    deleteById,
    findAll,
    findById,
    findOne,
    updateRecord,
    loginUser,
} from "../../controllers/user";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /addRecord:
 *   post:
 *     summary: Add new user
 *     tags:
 *       - User
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
 *               - role
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *               role:
 *                 type: string
 *                 example: "user"
 *               phone:
 *                 type: string
 *                 example: "+11234567890"
 *     responses:
 *       '200':
 *         description: User created successfully
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
 *                       example: "usr_67bf1f5867e753b86463b5d1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     phone:
 *                       type: string
 *                       example: "+11234567890"
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
 *                 missedInputs:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["email", "password"]
 */
router.post(
    "/addRecord",
    validateKeyInputs({
        inputArr: ["name", "email", "password", "role", "phone"],
        key: "body",
    }),
    addRecord,
);

/**
 * @openapi
 * /updateRecord:
 *   post:
 *     summary: Update user record
 *     tags:
 *       - User
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
 *                 example: "usr_67bf1f5867e753b86463b5d1"
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               role:
 *                 type: string
 *                 example: "admin"
 *               phone:
 *                 type: string
 *                 example: "+19876543210"
 *     responses:
 *       '200':
 *         description: User updated successfully
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
 *                       example: "usr_67bf1f5867e753b86463b5d1"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jane.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     phone:
 *                       type: string
 *                       example: "+19876543210"
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
 *                 missedInputs:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["recordId"]
 *       '404':
 *         description: Resource not found
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
 *                   example: "Resource not found"
 */
router.post(
    "/updateRecord",
    validateKeyInputs({
        key: "body",
        inputArr: ["recordId", "-name", "-email", "-role", "-phone"],
    }),
    updateRecord,
);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
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
 *                 example: "john.doe@example.com"
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
 *                     id:
 *                       type: string
 *                       example: "usr_67bf1f5867e753b86463b5d1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     phone:
 *                       type: string
 *                       example: "+11234567890"
 *       '400':
 *         description: Bad request or invalid credentials
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
 *                   example: "Invalid credentials or missing inputs"
 *                 missedInputs:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["email", "password"]
 *       '401':
 *         description: Unauthorized (Invalid credentials)
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
    loginUser,
);

/**
 * @openapi
 * /deleteById:
 *   post:
 *     summary: Delete user by ID
 *     tags:
 *       - User
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
 *                 example: "usr_67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: User deleted successfully
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
 *                   example: "User deleted successfully"
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
 *                 missedInputs:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["recordId"]
 *       '404':
 *         description: Resource not found
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
 *                   example: "Resource not found"
 */
router.post(
    "/deleteById",
    validateKeyInputs({ key: "body", inputArr: ["recordId"] }),
    deleteById,
);

/**
 * @openapi
 * /getAll:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: A list of users
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
 *                         example: "usr_67bf1f5867e753b86463b5d1"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "john.doe@example.com"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       phone:
 *                         type: string
 *                         example: "+11234567890"
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
 *                   example: "Bad request"
 */
router.get(
    "/getAll",
    validateKeyInputs({ inputArr: [], key: "query" }),
    findAll,
);

/**
 * @openapi
 * /getOne:
 *   get:
 *     summary: Get a single user
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: A single user
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
 *                       example: "usr_67bf1f5867e753b86463b5d1"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jane.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     phone:
 *                       type: string
 *                       example: "+19876543210"
 *       '404':
 *         description: Resource not found
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
 *                   example: "Resource not found"
 */
router.get(
    "/getOne",
    validateKeyInputs({ inputArr: [], key: "query" }),
    findOne,
);

/**
 * @openapi
 * /getById:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "usr_67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: User found
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
 *                       example: "usr_67bf1f5867e753b86463b5d1"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jane.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     phone:
 *                       type: string
 *                       example: "+19876543210"
 *       '404':
 *         description: Resource not found
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
 *                   example: "Resource not found"
 */
router.get(
    "/getById",
    validateKeyInputs({ inputArr: ["id"], key: "query" }),
    findById,
);

export default router;
