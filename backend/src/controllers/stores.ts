import { NextFunction, Request, Response } from "express";
import Item from "../model/Item.js";
import Store from "../model/Store.js";

export const getAllStores = async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req: Request,
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
        const store = Store.findByPk(req.params.id, {
            include: [Item],
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
