import { buildSchema } from "graphql";

export const schema = buildSchema(`
scalar UUID
scalar DateTime

type Company {
  id: UUID!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  stores: [Store!]!
}

type Store {
  id: UUID!
  name: String!
  street: String!
  city: String!
  postalCode: String
  companyId: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  province: String
  state: String
  zipCode: String
  country: String!
  items: [Item!]!
  company: Company!
}

type Item {
  id: UUID!
  name: String!
  storeId: String!
  imgUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
  category: String!
  store: Store!
  prices: [Price!]!
}

type Price {
  id: UUID!
  price: Float!
  itemId: String!
  createdAt: DateTime!
  updatedAt: DateTime!
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
  company(id: UUID!): Company
  stores(companyId: UUID!): [Store!]!
  store(id: UUID!): Store
  itemsFromStore(storeId: UUID!, page: Int, search: String): [Item!]!
  item(id: UUID!, offset: Int, limit: Int): Item
  itemCount: Int!
  locations: [Location!]!
}
`);
