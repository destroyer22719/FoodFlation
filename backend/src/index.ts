import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import helmet from "helmet";
import compression from "compression";
import serverless from "serverless-http";


const prisma = new PrismaClient();

const port = process.env.PORT || 4000;
const dotEnvFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: dotEnvFile });

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(morgan("tiny"));
app.use(limiter);
app.use(helmet());
app.use(compression());

app.use(Sentry.Handlers.errorHandler());

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
});

export const handler = serverless(app);
