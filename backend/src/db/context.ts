import { PrismaClient } from "@prisma/client";

export interface Context {
  ip: string;
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

export const context = async (ip: string): Promise<Context> => {
  return { ip, prisma };
};
