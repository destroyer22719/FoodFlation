import express from "express";
import {
    getAllItems,
    getItemById,
    getItemCount,
    getAllStoreItems,
} from "../controllers/items";
const router = express.Router();

router.get("/", getAllItems);
router.get("/count", getItemCount);
router.get("/store/:storeId", getAllStoreItems);
router.get("/:id", getItemById);

export default router;
