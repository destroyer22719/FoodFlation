import { NextFunction, Request, Response } from "express";
import Price from "../model/Price.js";
import sequelize from "../config/db.js";
import Item from "../model/Item.js";
import Store from "../model/Store.js";

type QueryResult = {
    city: string;
    cityCount: number;
};

type ResponseParsed = {
    province: string;
    cities: QueryResult[];
};

export const getAllStores = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const pageSize = 15;

        let stores: Store[] = [];
        if (req.query.search) {
            stores = await Store.findAll({
                where: {
                    city: req.query.search?.toString().replace("%20", " "),
                },
                limit: pageSize,
                offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
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
        const [queryResults] = await sequelize.query(`
            SELECT city, COUNT(city) AS cityCount FROM stores GROUP BY city
        `);

        const datas: QueryResult[] = queryResults as QueryResult[];

        const response: ResponseParsed[] = [];

        //maps the cities to province
        for (const data of datas) {
            const city = data.city.split(", ")[0];
            const prov = data.city.split(", ")[1];
            const provIndex = response.map((x) => x.province).indexOf(prov);

            if (provIndex === -1) {
                response.push({
                    province: prov,
                    cities: [data],
                });
            } else if (
                !response[provIndex].cities.map((x) => x.city).includes(city)
            ) {
                response[provIndex].cities.push(data);
            }
        }

        res.send(response);
    } catch (err) {
        next(err);
    }
};

export const getStoreCount = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const storeCount = await Store.count();

        res.send({ count: storeCount });
    } catch (err) {
        next(err);
    }
};
