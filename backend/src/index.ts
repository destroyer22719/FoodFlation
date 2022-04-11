import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

import itemRouter from "./routes/items.js";
import storeRouter from "./routes/stores.js";
import companyRouter from "./routes/companies.js";

const port = process.env.PORT || 4000;
dotenv.config();

const app = express();

app.use("/item", itemRouter);
app.use("/store", storeRouter);
app.use("/company", companyRouter);

app.listen(port, async () => {
    await sequelize.sync();
    console.log(`listening on port ${port}`);
});
