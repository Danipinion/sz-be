import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/AuthUser.js";
// import { verifyUser, verifyAdmin } from "../middleware/AuthUser.js";
const router = Router();

router.get("/", verifyUser, getUsers);
router.get("/:id", verifyUser, getUserById);
router.post("/", createUser);
router.delete("/:id", verifyUser, deleteUser);

export default router;
