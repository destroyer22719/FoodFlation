import { NextFunction, Request, Response } from "express";
// import Price from "../model/Price.js";
import {getSequelize as sequelize} from "../config/db.js";
// import Item from "../model/Item.js";
import Store from "../model/Store.js";
import Sequelize, { WhereOptions } from "sequelize";

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
        const pageSize = 10;

        let stores: Store[] = [];
        // if (req.query.search) {
        const searchQuery: WhereOptions<{ city: string, postalCode: unknown; }> = {};

        if (req.query.search) searchQuery.city = req.query.search.toString().replace("%20", " ");
        if (req.query.postalCode) searchQuery.postalCode = { [Sequelize.Op.like]: `${req.query.postalCode}%` };

        const queryResult = await Store.findAndCountAll({
            where: searchQuery, 
            limit: pageSize, 
            offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
        });

        stores = queryResult.rows;

        if (stores.length) res.send({stores, total: queryResult.count});
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
        const store = await Store.findByPk(req.params.id);

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
        const [queryResults] = await sequelize().query(`
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
