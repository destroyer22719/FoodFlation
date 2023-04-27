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

export const searchStores = async ({}: QuerySearchStoreParams) => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($city: String, $postalCode: String, $zipCode: String){
          storesSearch(city: $city, postalCode: $postalCode, zipCode: $zipCode) {
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
    }),
  });

  const res = await req.json();
  return res.data as QuerySearchStoreResult;
};
