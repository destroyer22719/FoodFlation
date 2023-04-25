import { prisma } from "../db/index.js";

export const companyResolver = async ({ id }: { id: string }) => {
  const company = await prisma.companies.findUnique({
    where: {
      id,
    },
  });
  return company;
};

export const companiesResolver = async () => {
  const companies = await prisma.companies.findMany();
  return companies;
};
