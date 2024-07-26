import { Router } from "express";
import {
  getMessages,
  createMessage,
} from "../controllers/message.controller.js";
const router = Router();

router.get("/", getMessages);
router.post("/:id", createMessage);

export default router;
