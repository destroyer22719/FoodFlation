import { Sequelize } from "sequelize-typescript";
import Item from "./model/Item";
import Price from "./model/Price";
import Store from "./model/Store";
import Company from "./model/Company";

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
