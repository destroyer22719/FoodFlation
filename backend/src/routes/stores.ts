import express from "express";
import { getAllLocations, getAllStores, getStoreById, getStoreCount } from "./../controllers/stores.js";

const router = express.Router();

router.get("/", getAllStores);
router.get("/count", getStoreCount);
router.get("/locations", getAllLocations);
router.get("/:id", getStoreById);

export default router;
