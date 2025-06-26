import "dotenv/config";
import express from "express";
import { uploadSingleFile } from "../../controllers/utils";
import { upload, uploadToMemory } from "../../helpers/upload";

const router = express.Router();

router.post(
  "/uploadSingleFile",
  uploadToMemory.single("file"),
  uploadSingleFile,
);

export default router;
