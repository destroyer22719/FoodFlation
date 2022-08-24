import { NextFunction, Request, Response } from "express";
import sequelize from "../config/db.js";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";

const pageSize = 15;

export const getItemById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const item = await Item.findByPk(req.params.id, {
            include: [Store, Price],
            order: [["prices", "createdAt", "ASC"]],
        });

        if (!item)
            res.status(404).send({
                message: `No item found with id of ${req.params.id}`,
            });
        else res.send(item);
    } catch (err) {
        next(err);
    }
};

export const getAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [items] = await sequelize.query(
            `
            SELECT 
                items.id, 
                items.name, 
                items.imgUrl,
                items.category, 
                prices.price, 
                prices.createdAt AS lastUpdated 
            FROM 
                items 
                LEFT JOIN prices ON prices.id = (
                    SELECT 
                        id 
                    FROM 
                        prices 
                    WHERE 
                        items.id = prices.itemId 
                    ORDER BY 
                        prices.createdAt
                        DESC
                    LIMIT 
                        1
                )
            LIMIT :pageSize
            OFFSET :offset
        `,
            {
                replacements: {
                    pageSize,
                    offset: req.query.page
                        ? (+req.query.page - 1) * pageSize
                        : 0,
                },
            }
        );
        res.send(items);
    } catch (err) {
        next(err);
    }
};

export const getAllStoreItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const total = await Item.count({
            where: {
                storeId: req.params.storeId,
            },
        });
        const [items] = await sequelize.query(
            `
            SELECT
                items.id,
                items.name, 
                items.imgUrl, 
                items.category,
                prices.price, 
                prices.createdAt AS lastUpdated
            FROM 
                items 
                LEFT JOIN prices ON prices.id = (
                    SELECT 
                        id 
                    FROM 
                        prices 
                    WHERE 
                        items.id = prices.itemId 
                    ORDER BY 
                        prices.createdAt 
                        DESC
                    LIMIT 
                        1
                )
            WHERE items.storeId = :storeId
            ${
                req.query.search
                    ? `AND items.name LIKE "%${req.query.search}%"`
                    : ""
            }
            LIMIT :pageSize
            OFFSET :offset
            `,
            {
                replacements: {
                    storeId: req.params.storeId,
                    pageSize,
                    offset: req.query.page
                        ? (+req.query.page - 1) * pageSize
                        : 0,
                },
            }
        );
        const [resultsFound] = await sequelize.query(
            `
        SELECT COUNT(*) AS resultsFound FROM 
        items 
        LEFT JOIN prices ON prices.id = (
            SELECT 
                id 
            FROM 
                prices 
            WHERE 
                items.id = prices.itemId 
            ORDER BY 
                prices.createdAt 
            LIMIT 
                1
        )
        WHERE items.storeId = :storeId
        ${
            req.query.search
                ? `AND items.name LIKE "%${req.query.search}%"`
                : ""
        }`,
            {
                replacements: {
                    storeId: req.params.storeId,
                    pageSize,
                    offset: req.query.page
                        ? (+req.query.page - 1) * pageSize
                        : 0,
                },
            }
        );
        res.send({ total, items, resultsFound });
    } catch (err) {
        next(err);
    }
};

export const getItemCount = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const itemCount = await Item.count();
        res.send({ count: itemCount });
    } catch (err) {
        next(err);
    }
};
