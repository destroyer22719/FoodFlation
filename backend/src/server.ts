import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import Keyv from "keyv";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import dotenv from "dotenv";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import KeyvRedis from "@keyv/redis";
import * as Sentry from "@sentry/serverless";

import { schema } from "./model/schema.js";
import { context } from "./db/context.js";
import redisClient from "./db/redis.js";

dotenv.config();

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
});

const keyV = new Keyv({
  store: new KeyvRedis(redisClient),
});

const server = new ApolloServer({
  schema,
  cache: new KeyvAdapter(keyV),
  plugins: [responseCachePlugin()],
});

export const graphqlHandler = Sentry.AWSLambda.wrapHandler(
  startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventV2RequestHandler(),
    {
      context: async (handler) => {
        return context(handler.event.requestContext.http.sourceIp);
      },
    }
  )
);
