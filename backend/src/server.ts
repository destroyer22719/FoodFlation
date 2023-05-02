import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./model/schema.js";
import { context } from "./db/context.js";

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context,
  }
);
