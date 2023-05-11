import type { CodegenConfig } from "@graphql-codegen/cli";

export const schema = `
enum CacheControlScope {
  PUBLIC
  PRIVATE
}

directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

type Company @cacheControl(maxAge: 604800) {
  id: ID!
  name: String!
  createdAt: String!
  updatedAt: String!
  stores: [Store!]!
}

type Store {
  id: ID!
  name: String!
  street: String!
  city: String!
  postalCode: String
  companyId: String!
  createdAt: String!
  updatedAt: String!
  province: String
  state: String
  zipCode: String
  country: String!
  items: [Item!]!
  companies: Company!
}

type Item {
  id: ID!
  name: String!
  storeId: String!
  imgUrl: String!
  createdAt: String!
  updatedAt: String!
  category: String!
  store: Store!
  prices: [Price!]!
}

type Price {
  id: ID!
  price: Float!
  itemId: String!
  createdAt: String!
  updatedAt: String!
  item: Item!
}

type Location {
  _count: Int!
  country: String!
  city: String!
  province: String
  state: String
}

type StoresSearchResult {
  stores: [Store!]!
  total: Int!
}

type CategoryData {
  count: Int!
  category: String!
}

type ItemSearchResult {
  items: [Item!]!
  total: Int!
  categories: [CategoryData!]!
  resultsFound: Int!
}

type Query @rateLimit(limit: 250, duration: 900) {
  companies: [Company!]! @cacheControl(maxAge: 604800)
  company(id: ID!): Company @cacheControl(maxAge: 604800)
  storesSearch(city: String, postalCode: String, zipCode: String, page: Int, companyId: ID): StoresSearchResult!
  store(id: ID!): Store
  itemsFromStore(storeId: ID!, page: Int, search: String, category: String): ItemSearchResult!
  itemsFromCity(city: String!, page: Int): [Item!]!
  item(id: ID!, offset: Int, limit: Int): Item
  storeCount: Int! @cacheControl(maxAge: 604800)
  itemCount: Int! @cacheControl(maxAge: 43200)
  locations: [Location!]! @cacheControl(maxAge: 604800)
}
`;

const config: CodegenConfig = {
  schema,
  generates: {
    "./src/resolvers/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
