import { NextFunction, Request, Response } from "express";
// import Price from "../model/Price.js";
import sequelize from "../config/db.js";
// import Item from "../model/Item.js";
import Store from "../model/Store.js";
import Sequelize, { WhereOptions } from "sequelize";

type StoreAddressResult = {
    city: string;
    state?: string;
    province?: string;
    country: string;
};

type CityCountResult = {
    city: string;
    cityCount: number;
};

type ResponseParsed = {
    country: string;
    stores: {
        city: string;
        cityCount: number;
        state?: string;
        province?: string;
    }[];
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
        const searchQuery: WhereOptions<{ city: string; postalCode: unknown }> =
            {};

        if (req.query.search)
            searchQuery.city = req.query.search.toString().replace("%20", " ");
        if (req.query.postalCode)
            searchQuery.postalCode = {
                [Sequelize.Op.like]: `${req.query.postalCode}%`,
            };

        const queryResult = await Store.findAndCountAll({
            where: searchQuery,
            limit: pageSize,
            offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
        });

        stores = queryResult.rows;

        if (stores.length) res.send({ stores, total: queryResult.count });
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
        const [queryResults] = await sequelize.query(`
            SELECT DISTINCT city, province, state, country FROM stores;
            SELECT COUNT(city) AS cityCount, city FROM stores GROUP BY city;
        `);

        console.log(queryResults);

        const addresses: StoreAddressResult[] =
            (queryResults[0] as StoreAddressResult[]) || [];
        const cityCounts: CityCountResult[] =
            (queryResults[1] as CityCountResult[]) || [];
        const response: ResponseParsed[] = [];

        addresses.forEach((address) => {
            const addressData: Partial<ResponseParsed> = {};

            if (!response.find((r) => r.country === address.country)) {
                addressData.country = address.country;
                if (address.country === "Canada") {
                    addressData.stores = [
                        {
                            city: address.city,
                            province: address.province,
                            cityCount:
                                cityCounts.find((c) => c.city === address.city)
                                    ?.cityCount || 0,
                        },
                    ];
                } else if (address.country === "United States") {
                    addressData.stores = [
                        {
                            city: address.city,
                            state: address.state,
                            cityCount:
                                cityCounts.find((c) => c.city === address.city)
                                    ?.cityCount || 0,
                        },
                    ];
                }
                response.push(addressData as ResponseParsed);
                return;
            }

            const countryData = response.find((r) => r.country === address.country)!;
            if (address.country === "Canada") {
                countryData.stores.push({
                    city: address.city,
                    province: address.province,
                    cityCount:
                        cityCounts.find((c) => c.city === address.city)
                            ?.cityCount || 0,
                });
            } else if (address.country === "United States") {
                countryData.stores.push({
                    city: address.city,
                    state: address.state,
                    cityCount:
                        cityCounts.find((c) => c.city === address.city)
                            ?.cityCount || 0,
                });
            }
        });

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
