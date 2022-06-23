import { Sequelize } from "sequelize-typescript";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";
import Company from "../model/Company.js";

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: "mysql",
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD,
    models: [Item, Price, Store, Company],
    host: process.env.NODE_ENV === "development" ? "localhost" : process.env.DATABASE_HOST,
    logging: false
});

export default sequelize;
