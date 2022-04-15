import { NextFunction, Request, Response } from "express";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";

export const getItemById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const item = await Item.findByPk(req.params.id, {
            include: [Store, Price],
        });

        if (!item)
            res.send({
                message: `No item found with id of ${req.params.id}`,
            }).status(404);
        
        else res.send(item);
    } catch (err) {
        next(err);
    }
};

export const getAllItems = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const items = await Item.findAll({ include: [Store, Price] });
        res.send(items);
    } catch (err) {
        next(err);
    }
};
