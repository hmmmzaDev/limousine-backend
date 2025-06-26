import express from "express";
const router = express.Router();
import {
  addRecord,
  loginAdmin,
  deleteById,
  findAll,
  findById,
  findOne,
  updateRecord,
  updatePassword,
} from "../../controllers/user";
import { validateKeyInputs } from "../../middlewares/validate";

/**
 * @openapi
 * /addRecord:
 *   post:
 *     summary: Add new user
 *     tags:
 *       - Admin - User
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
 *       '400':
 *         description: Bad request
 */
router.post(
  "/addRecord",
  validateKeyInputs({
    inputArr: [
      "name",
      "email",
      "password",
      "role",
      "phone",
    ],
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
 *       - Admin - User
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
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Resource not found
 */
router.post(
  "/updateRecord",
  validateKeyInputs({
    key: "body",
    inputArr: [
      "recordId",
      "-name",
      "-email",
      "-role",
      "-phone",
    ],
  }),
  updateRecord,
);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Admin login
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
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Bad request or invalid credentials
 *       '401':
 *         description: Unauthorized (Invalid credentials)
 */
router.post(
  "/login",
  validateKeyInputs({
    inputArr: ["email", "password"],
    key: "body",
  }),
  loginAdmin,
);

/**
 * @openapi
 * /updatePassword:
 *   post:
 *     summary: Update user password
 *     tags:
 *       - Admin - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - recordId
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *               recordId:
 *                 type: string
 *                 example: "usr_67bf1f5867e753b86463b5d1"
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Resource not found
 */
router.post(
  "/updatePassword",
  validateKeyInputs({ inputArr: ["newPassword", "recordId"], key: "body" }),
  updatePassword,
);

/**
 * @openapi
 * /deleteById:
 *   post:
 *     summary: Delete user by ID
 *     tags:
 *       - Admin - User
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
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Resource not found
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
 *       - Admin - User
 *     responses:
 *       '200':
 *         description: A list of users
 *       '400':
 *         description: Bad request
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
 *       - Admin - User
 *     responses:
 *       '200':
 *         description: A single user
 *       '404':
 *         description: Resource not found
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
 *       - Admin - User
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
 *       '404':
 *         description: Resource not found
 */
router.get(
  "/getById",
  validateKeyInputs({ inputArr: ["id"], key: "query" }),
  findById,
);

export default router;
