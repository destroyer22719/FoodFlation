import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import morgan from "morgan";
import cors from "cors";

import itemRouter from "./routes/items.js";
import storeRouter from "./routes/stores.js";
import companyRouter from "./routes/companies.js";

const port = process.env.PORT || 4000;
dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("tiny"));


app.use("/items", itemRouter);
app.use("/stores", storeRouter);
app.use("/companies", companyRouter);

app.listen(port, async () => {
    await sequelize.sync();
    console.log(`listening on port ${port}`);
});
