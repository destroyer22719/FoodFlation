import type { CodegenConfig } from "@graphql-codegen/cli";

export const schema = `
#graphql

type Company {
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
  company: Company!
}

type Item {
  id: ID!
  name: String!
  storeId: String!
  imgUrl: String
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

type CityCount {
  city: Int!
}

type Location {
  _count: CityCount
  country: String!
  city: String!
  province: String
  state: String
}

type Query {
  companies: [Company!]!
  company(id: ID!): Company
  stores(companyId: ID!): [Store!]!
  store(id: ID!): Store
  storesCount: Int!
  itemsFromStore(storeId: ID!, page: Int, search: String): [Item!]!
  itemsFromCity(city: String!, page: Int): [Item!]!
  item(id: ID!, offset: Int, limit: Int): Item
  itemCount: Int!
  locations: [Location!]!
}
`

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
