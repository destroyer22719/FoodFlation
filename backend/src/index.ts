import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
// import serverless from "serverless-http";
// import * as afe from "azure-function-express";

// const {createHandler} = afe;

import itemRouter from "./routes/items.js";
import storeRouter from "./routes/stores.js";
import companyRouter from "./routes/companies.js";

const port = process.env.PORT || 4000;
const dotEnvFile = process.env.NODE_ENV === "production" ? "env.prod": ".env";
dotenv.config({ path: dotEnvFile });

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(morgan("tiny"));
app.use(limiter);

app.use("/items", itemRouter);
app.use("/stores", storeRouter);
app.use("/companies", companyRouter);

app.listen(port, async () => {
    await sequelize.sync();
    console.log(`listening on port ${port}`);
});

// export default createHandler(app);
// export default serverless(app);