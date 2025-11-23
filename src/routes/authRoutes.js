import express from "express";
import {
  googleAuth,
  refreshAccessToken,
  getMe,
} from "../controllers/authController.js";
import { authMiddleWare } from "../middlewares/authMiddleWare.js";

const router = express.Router();
router.post("/google", googleAuth);
router.get("/refresh-token", refreshAccessToken);
router.get("/me", authMiddleWare, getMe);

export default router;
