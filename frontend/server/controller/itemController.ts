import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "../db.js";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";

const pageSize = 15;

export const getItemById = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    await sequelize.sync();
    const id = req.query.id as string;

    const item = await Item.findByPk(id, {
        include: [Store, Price],
        order: [["prices", "createdAt", "ASC"]],
    });

    if (!item)
        res.status(404).send({
            message: `No item found with id of ${id}`,
        });
    else res.send(item);
};

export const getAllItems = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const [items] = await sequelize.query(
        `
            SELECT 
                items.id, 
                items.name, 
                items.imgUrl, 
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
                offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
            },
        }
    );
    res.send(items);
};

export const getAllStoreItems = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const storeId = req.query.storeId as string;
    const search = req.query.search as string;

    const total = await Item.count({
        where: {
            storeId: storeId,
        },
    });
    const [items] = await sequelize.query(
        `
            SELECT
                items.id,
                items.name, 
                items.imgUrl, 
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
                storeId: storeId,
                pageSize,
                offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
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
                storeId: storeId,
                pageSize,
                offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
            },
        }
    );
    res.send({ total, items, resultsFound });
};
