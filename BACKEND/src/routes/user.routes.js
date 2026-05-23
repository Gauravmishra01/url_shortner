import express from "express";
import {
  getAllUserUrls,
  getUserWorkspaceState,
  updateUserWorkspaceState,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { ensureDatabaseReady } from "../middleware/ensureDatabaseReady.js";

const router = express.Router();

router.use(ensureDatabaseReady);

router.post("/urls", authMiddleware, getAllUserUrls);
router.get("/workspace-state", authMiddleware, getUserWorkspaceState);
router.put("/workspace-state", authMiddleware, updateUserWorkspaceState);

export default router;
