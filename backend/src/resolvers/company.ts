import { prisma } from "../db/index.js";
import { Company, QueryCompanyArgs } from "./resolvers-types.js";

export const companyResolver = async (_: {}, { id }: QueryCompanyArgs) => {
  const company = await prisma.companies.findUnique({
    where: {
      id,
    },
  });
  return company as unknown as Company;
};

export const companiesResolver = async () => {
  const companies = await prisma.companies.findMany();
  return companies as unknown as Company[];
};
