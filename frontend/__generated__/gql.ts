/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query getItemAndStoreCounts {\n  itemCount\n  storeCount\n}\n\nquery searchStore($city: String, $postalCode: String, $zipCode: String, $companyId: ID, $page: Int) {\n  storesSearch(\n    city: $city\n    postalCode: $postalCode\n    zipCode: $zipCode\n    companyId: $companyId\n    page: $page\n  ) {\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n    }\n    total\n  }\n}\n\nquery getLocationsAndCompanies {\n  companies {\n    id\n    name\n  }\n  locations {\n    _count\n    country\n    city\n    province\n    state\n  }\n}\n\nquery getStoreData($id: ID!) {\n  store(id: $id) {\n    country\n    id\n    name\n    street\n    city\n    postalCode\n    zipCode\n    state\n    province\n    companies {\n      id\n    }\n  }\n  itemsFromStore(storeId: $id) {\n    total\n    categories {\n      count\n      category\n    }\n  }\n}\n\nquery getItemsFromStore($id: ID!, $search: String, $category: String, $page: Int) {\n  itemsFromStore(storeId: $id, search: $search, category: $category, page: $page) {\n    items {\n      id\n      name\n      imgUrl\n      category\n      prices {\n        price\n        createdAt\n      }\n    }\n    resultsFound\n  }\n}\n\nquery getItemAndItsStoreData($itemId: ID!) {\n  item(id: $itemId) {\n    name\n    category\n    imgUrl\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n      state\n      province\n      country\n    }\n    prices {\n      createdAt\n      price\n    }\n  }\n}": types.GetItemAndStoreCountsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query getItemAndStoreCounts {\n  itemCount\n  storeCount\n}\n\nquery searchStore($city: String, $postalCode: String, $zipCode: String, $companyId: ID, $page: Int) {\n  storesSearch(\n    city: $city\n    postalCode: $postalCode\n    zipCode: $zipCode\n    companyId: $companyId\n    page: $page\n  ) {\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n    }\n    total\n  }\n}\n\nquery getLocationsAndCompanies {\n  companies {\n    id\n    name\n  }\n  locations {\n    _count\n    country\n    city\n    province\n    state\n  }\n}\n\nquery getStoreData($id: ID!) {\n  store(id: $id) {\n    country\n    id\n    name\n    street\n    city\n    postalCode\n    zipCode\n    state\n    province\n    companies {\n      id\n    }\n  }\n  itemsFromStore(storeId: $id) {\n    total\n    categories {\n      count\n      category\n    }\n  }\n}\n\nquery getItemsFromStore($id: ID!, $search: String, $category: String, $page: Int) {\n  itemsFromStore(storeId: $id, search: $search, category: $category, page: $page) {\n    items {\n      id\n      name\n      imgUrl\n      category\n      prices {\n        price\n        createdAt\n      }\n    }\n    resultsFound\n  }\n}\n\nquery getItemAndItsStoreData($itemId: ID!) {\n  item(id: $itemId) {\n    name\n    category\n    imgUrl\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n      state\n      province\n      country\n    }\n    prices {\n      createdAt\n      price\n    }\n  }\n}"): (typeof documents)["query getItemAndStoreCounts {\n  itemCount\n  storeCount\n}\n\nquery searchStore($city: String, $postalCode: String, $zipCode: String, $companyId: ID, $page: Int) {\n  storesSearch(\n    city: $city\n    postalCode: $postalCode\n    zipCode: $zipCode\n    companyId: $companyId\n    page: $page\n  ) {\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n    }\n    total\n  }\n}\n\nquery getLocationsAndCompanies {\n  companies {\n    id\n    name\n  }\n  locations {\n    _count\n    country\n    city\n    province\n    state\n  }\n}\n\nquery getStoreData($id: ID!) {\n  store(id: $id) {\n    country\n    id\n    name\n    street\n    city\n    postalCode\n    zipCode\n    state\n    province\n    companies {\n      id\n    }\n  }\n  itemsFromStore(storeId: $id) {\n    total\n    categories {\n      count\n      category\n    }\n  }\n}\n\nquery getItemsFromStore($id: ID!, $search: String, $category: String, $page: Int) {\n  itemsFromStore(storeId: $id, search: $search, category: $category, page: $page) {\n    items {\n      id\n      name\n      imgUrl\n      category\n      prices {\n        price\n        createdAt\n      }\n    }\n    resultsFound\n  }\n}\n\nquery getItemAndItsStoreData($itemId: ID!) {\n  item(id: $itemId) {\n    name\n    category\n    imgUrl\n    stores {\n      id\n      name\n      street\n      city\n      postalCode\n      zipCode\n      state\n      province\n      country\n    }\n    prices {\n      createdAt\n      price\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;