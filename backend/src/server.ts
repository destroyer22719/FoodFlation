import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

import { schema } from "./model/schema.js";
import { context } from "./db/context.js";

const server = new ApolloServer({
  schema,
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
