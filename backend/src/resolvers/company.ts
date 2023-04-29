import { Context } from "../db/context.js";
import { Company, QueryCompanyArgs } from "./resolvers-types.js";

export const companyResolver = async (
  _: {},
  { id }: QueryCompanyArgs,
  ctx: Context
) => {
  const company = await ctx.prisma.companies.findUnique({
    where: {
      id,
    },
  });
  return company as unknown as Company;
};

export const companiesResolver = async (_: {}, __: {}, ctx: Context) => {
  const companies = await ctx.prisma.companies.findMany();
  return companies as unknown as Company[];
};
