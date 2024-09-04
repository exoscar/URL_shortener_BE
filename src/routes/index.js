import { Router } from "express";
import { shorten, redirect } from "../controllers/urlController.js";

const router = Router();

router.post("/shorten", shorten);
router.get("/:shortUrl", redirect);

export default router;
