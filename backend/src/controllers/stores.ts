import { NextFunction, Request, Response } from "express";
import Price from "../model/Price.js";
import sequelize from "../config/db.js";
import Item from "../model/Item.js";
import Store from "../model/Store.js";

export const getAllStores = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const stores = await Store.findAll({
            include: [Item],
        });

        res.send(stores);
    } catch (err) {
        next(err);
    }
};

export const getStoreById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const store = await Store.findByPk(req.params.id, {
            include: [{model: Item, include: [Price]}],
        });

        if (!store)
            res.send({
                message: `No store found with id of ${req.params.id}`,
            }).status(404);
        else res.send(store);
    } catch (err) {
        next(err);
    }
};

export const getAllLocations = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [data] = await sequelize.query(`
            SELECT DISTINCT city FROM stores
        `);

        res.send(data);
    } catch (err) {
        next(err);
    }
};
