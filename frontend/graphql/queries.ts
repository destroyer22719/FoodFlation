import { gql } from "@apollo/client";
import {
  GetItemAndStoreCountsQuery,
  GetItemAndStoreCountsQueryVariables,
  QueryStoresSearchArgs,
  SearchStoreQuery,
  SearchStoreQueryVariables,
} from "__generated__/graphql";
import { getClient } from "@/graphql/apolloClient";

export const getCounts = async () => {
  const query = gql`
    query getItemAndStoreCounts {
      itemCount
      storeCount
    }
  `;

  const client = getClient();
  const { data } = await client.query<
    GetItemAndStoreCountsQuery,
    GetItemAndStoreCountsQueryVariables
  >({
    query,
  });

  return data;
};

export const searchStores = async ({
  city,
  zipCode,
  postalCode,
  companyId,
  page,
}: QueryStoresSearchArgs) => {
  const query = gql`
    query searchStore(
      $city: String
      $postalCode: String
      $zipCode: String
      $companyId: ID
      $page: Int
    ) {
      storesSearch(
        city: $city
        postalCode: $postalCode
        zipCode: $zipCode
        companyId: $companyId
        page: $page
      ) {
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
  `;

  const client = getClient();

  const { data } = await client.query<
    SearchStoreQuery,
    SearchStoreQueryVariables
  >({
    query,
    variables: {
      city,
      zipCode,
      postalCode,
      companyId,
      page,
    },
  });

  return data;
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
            companies {
              id
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

export const getItemsFromStore = async (
  id: string,
  {
    search,
    category,
    page,
  }: {
    search?: string;
    category?: string;
    page?: number;
  }
) => {
  const req = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: `
        query ($id: ID!, $search: String, $category: String, $page: Int) {
          itemsFromStore(storeId: $id, search: $search, category: $category, page: $page) {
            items {
              id
              name
              imgUrl
              category
              prices {
                price
                createdAt
              }
            }
            resultsFound
          }
        }
      `,
      variables: {
        id,
        search,
        category,
        page,
      },
    }),
  });

  const res = await req.json();

  return res.data.itemsFromStore as QueryItemsFromStoreResult;
};
