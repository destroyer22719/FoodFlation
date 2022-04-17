import { NextFunction, Request, Response } from "express";
import Price from "../model/Price.js";
import sequelize from "../config/db.js";
import Item from "../model/Item.js";
import Store from "../model/Store.js";

export const getAllStores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let stores: Store[] = [];
        if (req.query.search) {
            stores = await Store.findAll({
                where: {
                    city: req.query.search?.toString().replace("%20", " "),
                },
            });
        } else {
            stores = await Store.findAll();
        }

        if (stores.length) res.send(stores);
        else
            res.status(404).send({
                message: `No store found with city of ${req.query.search}`,
            });
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
            include: [{ model: Item, include: [Price] }],
        });

        if (!store)
            res.status(404).send({
                message: `No store found with id of ${req.params.id}`,
            });
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
