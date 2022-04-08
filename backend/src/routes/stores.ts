import express from "express";
import { getAllStores, getStoreById } from "./../controllers/stores.js";

const router = express.Router();

router.get("/", getAllStores);
router.get("/:id", getStoreById);

export default router;
