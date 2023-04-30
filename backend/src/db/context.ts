import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

export const context = async (): Promise<Context> => {
  return { prisma };
};
