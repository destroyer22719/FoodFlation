import express from "express";
import { getAllItems, getItemById, getItemCount } from "../controllers/items.js";
const router = express.Router();

router.get("/", getAllItems);
router.get("/count", getItemCount);
router.get("/:id", getItemById);

export default router;
