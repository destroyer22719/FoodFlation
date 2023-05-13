import { gql } from "@apollo/client";
import {
  GetItemAndStoreCountsQuery,
  GetItemAndStoreCountsQueryVariables,
  QueryStoresSearchArgs,
  SearchStoreQuery,
  SearchStoreQueryVariables,
  GetLocationsAndCompaniesQuery,
  GetStoreDataQuery,
  GetStoreDataQueryVariables,
  GetItemsFromStoreQueryVariables,
  GetItemsFromStoreQuery,
  GetItemAndItsStoreDataQuery,
  GetItemAndItsStoreDataQueryVariables,
  GetItemsFromCityQuery,
  GetItemsFromCityQueryVariables,
  GetLocationsQuery,
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
  if (!city && !zipCode && !postalCode && !companyId) {
    return {
      stores: [],
      total: 0,
    };
  }

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

  return data.storesSearch;
};

export const getLocationsAndCompanies = async () => {
  const query = gql`
    query getLocationsAndCompanies {
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
  `;

  const client = getClient();

  const { data } = await client.query<GetLocationsAndCompaniesQuery>({
    query,
  });

  return data;
};

export const getStoreData = async (id: string) => {
  const query = gql`
    query getStoreData($id: ID!) {
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
  `;

  const client = getClient();

  const { data } = await client.query<
    GetStoreDataQuery,
    GetStoreDataQueryVariables
  >({
    query,
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
  });

  return data;
};

export const getItemsFromStore = async ({
  id,
  search,
  category,
  page,
}: GetItemsFromStoreQueryVariables) => {
  const query = gql`
    query getItemsFromStore(
      $id: ID!
      $search: String
      $category: String
      $page: Int
    ) {
      itemsFromStore(
        storeId: $id
        search: $search
        category: $category
        page: $page
      ) {
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
  `;

  const client = getClient();

  const { data } = await client.query<
    GetItemsFromStoreQuery,
    GetItemsFromStoreQueryVariables
  >({
    query,
    variables: {
      id,
      search,
      category,
      page,
    },
    fetchPolicy: "no-cache",
  });

  return data.itemsFromStore;
};

export const getItemsAndItsStoreData = async (id: string) => {
  const query = gql`
    query getItemAndItsStoreData($itemId: ID!) {
      item(id: $itemId) {
        name
        category
        imgUrl
        stores {
          id
          street
          city
          postalCode
          zipCode
          state
          province
          country
          name
        }
        prices {
          createdAt
          price
        }
      }
    }
  `;

  const client = getClient();
  const { data } = await client.query<
    GetItemAndItsStoreDataQuery,
    GetItemAndItsStoreDataQueryVariables
  >({
    query,
    variables: {
      itemId: id,
    },
  });

  return data.item;
};

export const getItemsFromCity = async ({
  city,
  search,
  page,
}: {
  city?: string;
  search?: string;
  page?: number;
}) => {
  if (!city && !search) {
    return {
      items: [],
      resultsFound: 0,
    };
  }

  const query = gql`
    query getItemsFromCity($city: String!, $search: String!, $page: Int) {
      itemsFromCity(city: $city, search: $search, page: $page) {
        items {
          id
          name
          imgUrl
          category
          prices {
            price
            createdAt
          }
          stores {
            id
            name
            street
            postalCode
            zipCode
          }
        }
        resultsFound
      }
    }
  `;

  const client = getClient();

  const { data } = await client.query<
    GetItemsFromCityQuery,
    GetItemsFromCityQueryVariables
  >({
    query,
    variables: {
      city: city!,
      search: search!,
      page,
    },
    fetchPolicy: "no-cache",
  });

  return data.itemsFromCity;
};

export const getLocations = async () => {
  const query = gql`
    query getLocations {
      locations {
        country
        city
        province
        state
      }
    }
  `;

  const client = getClient();

  const { data } = await client.query<GetLocationsQuery>({
    query,
  });

  return data.locations;
};
