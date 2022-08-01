import express from "express";
import { getCompanyById, getAllCompanies } from "../controllers/companies";

const router = express.Router();

router.get("/:id", getCompanyById);
router.get("/", getAllCompanies);

export default router;
