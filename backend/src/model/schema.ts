import { rateLimitDirective } from "graphql-rate-limit-directive";
import {
  IRateLimiterRedisOptions,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import { GraphQLError } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { schema as typeDefs } from "../../codegen.js";
import { Context } from "../db/context.js";
import { resolvers } from "../resolvers/index.js";
import { RateLimitKeyGenerator } from "graphql-rate-limit-directive";
import redisClient from "../db/redis.js";

const keyGenerator: RateLimitKeyGenerator<Context> = (
  _directiveArgs,
  _source,
  _args,
  context,
  _info
) => `${context.ip}`;

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
  rateLimitDirective<Context, IRateLimiterRedisOptions>({
    onLimit: () => {
      throw new GraphQLError("Too many requests", {
        extensions: {
          code: "TOO_MANY_REQUESTS",
        },
      });
    },
    keyGenerator: keyGenerator,
    limiterClass: RateLimiterRedis,
    limiterOptions: {
      storeClient: redisClient,
    },
  });

export const schema = rateLimitDirectiveTransformer(
  makeExecutableSchema({
    typeDefs: [rateLimitDirectiveTypeDefs, typeDefs],
    resolvers,
  })
);
