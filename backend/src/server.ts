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

import { schema } from "./model/schema.js";
import { context } from "./db/context.js";
import redisClient from "./db/redis.js";

dotenv.config();

const keyV = new Keyv({
  store: new KeyvRedis(redisClient),
});

const server = new ApolloServer({
  schema,
  cache: new KeyvAdapter(keyV),
  plugins: [responseCachePlugin()],
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async (handler) => {
      return context(handler.event.requestContext.http.sourceIp);
    },
  }
);
