import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import helmet from "helmet";
import compression from "compression";
import serverless from "serverless-http";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./model/index.js";
import { root } from "./resolvers/index.js";

const port = process.env.PORT || 3000;

const dotEnvFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: dotEnvFile });

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(cors());
app.use(morgan("tiny"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(helmet());
app.use(compression());

app.use(Sentry.Handlers.errorHandler());

app.all("/graphql", createHandler({ rootValue: root, schema }));

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
});

export const handler = serverless(app);
