import { Router } from "express";

import auth from "../../middleware/auth.js";
import { issueController } from "./issue.controller.js";

const router = Router();

router.post("/", auth, issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.patch("/:id", auth, issueController.updateIssue);
router.delete("/:id", auth, issueController.deleteIssue);

export default router;
