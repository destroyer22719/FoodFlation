import { Sequelize } from "sequelize-typescript";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";
import Company from "../model/Company.js";
import dotenv from "dotenv";

if (!process.env.DATABASE_PASSWORD) {
    const dotEnvFile =
        process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
    dotenv.config({ path: dotEnvFile });
}

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: "mysql",
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD,
    models: [Item, Price, Store, Company],
    host: process.env.DATABASE_HOST || "localhost",
    logging: false,
});

export default sequelize;
