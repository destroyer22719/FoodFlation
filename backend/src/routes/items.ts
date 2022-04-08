import express from "express";
import { getAllItems, getItemById } from "../controllers/items.js";
const router = express.Router();

router.get("/:id", getItemById);
router.get("/", getAllItems);

export default router;
