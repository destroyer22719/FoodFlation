import { NextFunction, Request, Response } from "express";
import Company from "../model/Company.js";
import Store from "../model/Store.js";

export const getAllCompanies = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const companies = await Company.findAll({
            include: [Store],
        });

        res.send(companies);
    } catch (err) {
        next(err);
    }
};

export const getCompanyById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const company = await Company.findByPk(req.params.id, {
            include: [Store],
        });

        if (!company)
            res.status(404).send({
                message: `No company found with id of ${req.params.id}`,
            });

        else res.send(company);
    } catch (err) {
        next(err);
    }
};
