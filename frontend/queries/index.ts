export const getCounts = async () => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          itemCount
          storeCount
        }
      `,
    }),
  });

  const res = await req.json();
  return res.data as QueryCountResult;
};

export const searchStores = async ({
  city,
  zipCode,
  postalCode,
  companyId,
  page,
}: QuerySearchStoreParams) => {
  if (!city && !zipCode && !postalCode && !companyId) {
    throw new Error(
      "At least one of city, zipCode, companyId or postalCode must be provided"
    );
  } else if (zipCode && postalCode) {
    throw new Error("Only one of zipCode or postalCode must be provided");
  }

  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($city: String, $postalCode: String, $zipCode: String, $companyId: String, $page: Int){
          storesSearch(city: $city, postalCode: $postalCode, zipCode: $zipCode, companyId: $companyId, page: $page) {
            stores {
              id
              name
              street
              city
              postalCode
              zipCode
            }
            total
        }
      `,
      variables: {
        city,
        postalCode,
        zipCode,
        companyId,
        page: page || 1,
      },
    }),
  });

  const res = await req.json();
  return res.data as QuerySearchStoreResult;
};

export const getLocationsAndCompanies = async () => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          companies {
            id
            name
          }
          locations {
            _count
            country
            city
            province
            state
          }
        }
      `,
    }),
  });

  const res = await req.json();
  return res.data as QueryLocationAndCompaniesResult;
};
