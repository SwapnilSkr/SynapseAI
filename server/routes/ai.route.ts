import { Router } from "express";
import {
  chatWIthAIAgent,
  createAgent,
  EditAIAgent,
  getListOfAllAgents,
} from "../controllers/ai.controller";
import { upload } from "../middlewares/multerConfig";
import { authCheckMiddleware } from "../middlewares/authCheck";

const router = Router();

router.post(
  "/create-agent",
  authCheckMiddleware,
  upload.fields([
    { name: "agentPic", maxCount: 1 },
    { name: "trainFiles", maxCount: 10 },
  ]),
  createAgent
);
router.get("/get-all-user-agents", authCheckMiddleware, getListOfAllAgents);
router.post(
  "/chat/:agentId/:chatId?",
  authCheckMiddleware,
  upload.fields([
    { name: "chatFiles", maxCount: 5 }, // Files for chat
    { name: "voiceMessage", maxCount: 1 }, // Audio file for voice message
  ]),
  chatWIthAIAgent
);
router.put(
  "/edit-agent/:agentId",
  authCheckMiddleware,
  upload.fields([{ name: "agentPic", maxCount: 1 }]),
  EditAIAgent
);

export default router;
