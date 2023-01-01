import { NextFunction, Request, Response } from "express";
import sequelize from "../config/db.js";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";

const pageSize = 10;

type ResultsFound = [
  {
    resultsFound: number;
  }
];

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
          offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
        },
      }
    );
    res.send(items);
  } catch (err) {
    next(err);
  }
};

export const getAllItemsInCity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [items] = await sequelize.query(
      `
      SELECT
          stores.name AS storeName,
          stores.street,
          items.id,
          items.name, 
          items.imgUrl, 
          items.category,
          prices.price AS price, 
          prices.createdAt AS lastUpdated
      FROM 
          stores
          INNER JOIN items ON stores.id = items.storeId
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
      WHERE stores.city = :city
      AND prices.createdAt >= NOW() - INTERVAL 7 DAY
      ${req.query.search && `AND items.name LIKE "%${req.query.search}%"`}
      ${req.query.orderBy ? `ORDER BY ${req.query.orderBy}` : ""}
      ${req.query.sortBy ? req.query.sortBy : ""}
      LIMIT :pageSize
      OFFSET :offset
      `,
      {
        replacements: {
          city: req.params.city,
          pageSize,
          offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
        },
      }
    );

    const [resultsFound] = await sequelize.query(
      `
      SELECT
          COUNT(*) AS resultsFound
      FROM 
          stores
          INNER JOIN items ON stores.id = items.storeId
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
      WHERE stores.city = :city
      AND prices.createdAt >= NOW() - INTERVAL 7 DAY
      ${req.query.search ? `AND items.name LIKE "%${req.query.search}%"` : ""}
      ${
        req.query.category ? `AND items.category = "${req.query.category}"` : ""
      }
      `,
      {
        replacements: {
          city: req.params.city,
        },
      }
    );

    res.send({
      items,
      resultsFound: (resultsFound[0] as { resultsFound: number }).resultsFound,
    });
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
      ${req.query.search ? `AND items.name LIKE "%${req.query.search}%"` : ""}
      ${
        req.query.category ? `AND items.category = "${req.query.category}"` : ""
      }
      LIMIT :pageSize
      OFFSET :offset
      `,
      {
        replacements: {
          storeId: req.params.storeId,
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
      ${req.query.search ? `AND items.name LIKE "%${req.query.search}%"` : ""}
      ${
        req.query.category ? `AND items.category = "${req.query.category}"` : ""
      }
      `,
      {
        replacements: {
          storeId: req.params.storeId,
          pageSize,
          offset: req.query.page ? (+req.query.page - 1) * pageSize : 0,
        },
      }
    );

    const [categoryData] = await sequelize.query(
      `SELECT 
                COUNT(category) as categoryCount, category 
            FROM 
                items 
            WHERE 
                storeId = :storeId
            GROUP BY 
                category 
            `,
      {
        replacements: {
          storeId: req.params.storeId,
        },
      }
    );

    res.send({
      total,
      resultsFound: (resultsFound as ResultsFound)[0].resultsFound,
      categoryData,
      items,
    });
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
