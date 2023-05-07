import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import Keyv from "keyv";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import dotenv from "dotenv";
import responseCachePlugin from '@apollo/server-plugin-response-cache';

dotenv.config();

import { schema } from "./model/schema.js";
import { context } from "./db/context.js";

const keyV = new Keyv(process.env.REDIS_URL as string);

const server = new ApolloServer({
  schema,
  cache: new KeyvAdapter(keyV),
  plugins:[responseCachePlugin()],
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
