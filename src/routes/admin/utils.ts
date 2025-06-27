import "dotenv/config";
import express from "express";
import { uploadSingleFile } from "../../controllers/utils";
import { upload, uploadToMemory } from "../../helpers/upload";
import { authenticateToken, requireAdmin } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/uploadSingleFile",
  authenticateToken,
  requireAdmin,
  uploadToMemory.single("file"),
  uploadSingleFile,
);

export default router;
