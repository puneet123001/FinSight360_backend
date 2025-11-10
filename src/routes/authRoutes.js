import express from "express";
import {
  googleAuth,
  refreshAccessToken,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/google", googleAuth);
router.get("/refresh-token", refreshAccessToken);

export default router;
