// https://sequelize.org/docs/v6/other-topics/aws-lambda/

import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import Item from "../model/Item.js";
import Price from "../model/Price.js";
import Store from "../model/Store.js";
import Company from "../model/Company.js";

if (!process.env.DATABASE_PASSWORD) {
  const dotEnvFile =
    process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
  dotenv.config({ path: dotEnvFile });
}

async function loadSequelize() {
  const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    dialect: "mysql",
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD,
    models: [Item, Price, Store, Company],
    host: process.env.DATABASE_HOST || "localhost",
    logging: true,
    dialectOptions: {
      multipleStatements: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  await sequelize.sync();
  return sequelize;
}

export default loadSequelize;
