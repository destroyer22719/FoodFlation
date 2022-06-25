import { Sequelize } from "sequelize-typescript";
import Item from "../../backend/src/model/Item.js";
import Price from "../../backend/src/model/Price.js";
import Store from "../../backend/src/model/Store.js";
import Company from "../../backend/src/model/Company.js";
import dotenv from "dotenv";
import path from "path";

if (!process.env.DATABASE_PASSWORD) {
    const dotEnvFile =
        process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
    dotenv.config({ path: path.resolve(__dirname,"../", "../", "../", dotEnvFile)});
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
