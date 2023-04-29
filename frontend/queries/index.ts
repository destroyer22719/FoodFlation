export const getCounts = async () => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($city: String, $postalCode: String, $zipCode: String, $companyId: ID, $page: Int){
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

  return res.data.storesSearch as QuerySearchStoreResult;
};

export const getLocationsAndCompanies = async () => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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

export const getStoreData = async (id: string) => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($id: ID!) {
          store(id: $id) {
            country
            id
            name
            street
            city
            postalCode
            zipCode
            state
            province
            company {
              id
              name
            }
          }
          itemsFromStore(storeId: $id) {
            total
            categories {
              count
              category
            }
          }
        }
      `,
      variables: {
        id,
      },
    }),
  });

  const res = await req.json();
  return res.data as QueryStoreResult;
};
