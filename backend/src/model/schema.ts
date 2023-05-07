import { rateLimitDirective } from "graphql-rate-limit-directive";
import { schema as typeDefs } from "../../codegen.js";
import {
  IRateLimiterRedisOptions,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import { Redis } from "ioredis";
import { Context } from "../db/context.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "../resolvers/index.js";
import { RateLimitKeyGenerator } from "graphql-rate-limit-directive";
import { GraphQLError } from "graphql";

const keyGenerator: RateLimitKeyGenerator<Context> = (
  _directiveArgs,
  _source,
  _args,
  context,
  _info
) => `${context.ip}`;

const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

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
