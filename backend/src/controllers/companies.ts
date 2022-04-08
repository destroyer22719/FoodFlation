import { NextFunction, Request, Response } from "express";
import Company from "../model/Company.js";
import Store from "../model/Store.js";

export const getAllCompanies = async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req: Request,
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
            res.send({
                message: `No company found with id of ${req.params.id}`,
            }).status(404);

        else res.send(company);
    } catch (err) {
        next(err);
    }
};
