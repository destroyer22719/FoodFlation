/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type CategoryData = {
  __typename?: 'CategoryData';
  category: Scalars['String'];
  count: Scalars['Int'];
};

export type Company = {
  __typename?: 'Company';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  stores: Array<Store>;
  updatedAt: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  category: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  imgUrl: Scalars['String'];
  name: Scalars['String'];
  prices: Array<Price>;
  storeId: Scalars['String'];
  stores: Store;
  updatedAt: Scalars['String'];
};

export type ItemCitySearchResult = {
  __typename?: 'ItemCitySearchResult';
  items: Array<Item>;
  resultsFound: Scalars['Int'];
};

export type ItemStoreSearchResult = {
  __typename?: 'ItemStoreSearchResult';
  categories: Array<CategoryData>;
  items: Array<Item>;
  resultsFound: Scalars['Int'];
  total: Scalars['Int'];
};

export type Location = {
  __typename?: 'Location';
  _count: Scalars['Int'];
  city: Scalars['String'];
  country: Scalars['String'];
  province?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type Price = {
  __typename?: 'Price';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  item: Item;
  itemId: Scalars['String'];
  price: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  company?: Maybe<Company>;
  item?: Maybe<Item>;
  itemCount: Scalars['Int'];
  itemsFromCity: ItemCitySearchResult;
  itemsFromStore: ItemStoreSearchResult;
  locations: Array<Location>;
  store?: Maybe<Store>;
  storeCount: Scalars['Int'];
  storesSearch: StoresSearchResult;
};


export type QueryCompanyArgs = {
  id: Scalars['ID'];
};


export type QueryItemArgs = {
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryItemsFromCityArgs = {
  city: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
  search: Scalars['String'];
};


export type QueryItemsFromStoreArgs = {
  category?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  storeId: Scalars['ID'];
};


export type QueryStoreArgs = {
  id: Scalars['ID'];
};


export type QueryStoresSearchArgs = {
  city?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
  postalCode?: InputMaybe<Scalars['String']>;
  zipCode?: InputMaybe<Scalars['String']>;
};

export type Store = {
  __typename?: 'Store';
  city: Scalars['String'];
  companies: Company;
  companyId: Scalars['String'];
  country: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  items: Array<Item>;
  name: Scalars['String'];
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street: Scalars['String'];
  updatedAt: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
};

export type StoresSearchResult = {
  __typename?: 'StoresSearchResult';
  stores: Array<Store>;
  total: Scalars['Int'];
};

export type GetItemAndStoreCountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetItemAndStoreCountsQuery = { __typename?: 'Query', itemCount: number, storeCount: number };

export type SearchStoreQueryVariables = Exact<{
  city?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  zipCode?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
}>;


export type SearchStoreQuery = { __typename?: 'Query', storesSearch: { __typename?: 'StoresSearchResult', total: number, stores: Array<{ __typename?: 'Store', id: string, name: string, street: string, city: string, postalCode?: string | null, zipCode?: string | null }> } };

export type GetLocationsAndCompaniesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsAndCompaniesQuery = { __typename?: 'Query', companies: Array<{ __typename?: 'Company', id: string, name: string }>, locations: Array<{ __typename?: 'Location', _count: number, country: string, city: string, province?: string | null, state?: string | null }> };

export type GetStoreDataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetStoreDataQuery = { __typename?: 'Query', store?: { __typename?: 'Store', country: string, id: string, name: string, street: string, city: string, postalCode?: string | null, zipCode?: string | null, state?: string | null, province?: string | null, companies: { __typename?: 'Company', id: string } } | null, itemsFromStore: { __typename?: 'ItemStoreSearchResult', total: number, categories: Array<{ __typename?: 'CategoryData', count: number, category: string }> } };

export type GetItemsFromStoreQueryVariables = Exact<{
  id: Scalars['ID'];
  search?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
}>;


export type GetItemsFromStoreQuery = { __typename?: 'Query', itemsFromStore: { __typename?: 'ItemStoreSearchResult', resultsFound: number, items: Array<{ __typename?: 'Item', id: string, name: string, imgUrl: string, category: string, prices: Array<{ __typename?: 'Price', price: number, createdAt: string }> }> } };

export type GetItemsFromCityQueryVariables = Exact<{
  city: Scalars['String'];
  search: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type GetItemsFromCityQuery = { __typename?: 'Query', itemsFromCity: { __typename?: 'ItemCitySearchResult', resultsFound: number, items: Array<{ __typename?: 'Item', id: string, name: string, imgUrl: string, category: string, prices: Array<{ __typename?: 'Price', price: number, createdAt: string }>, stores: { __typename?: 'Store', id: string, name: string, street: string, postalCode?: string | null, zipCode?: string | null } }> } };

export type GetItemAndItsStoreDataQueryVariables = Exact<{
  itemId: Scalars['ID'];
}>;


export type GetItemAndItsStoreDataQuery = { __typename?: 'Query', item?: { __typename?: 'Item', name: string, category: string, imgUrl: string, stores: { __typename?: 'Store', id: string, name: string, street: string, city: string, postalCode?: string | null, zipCode?: string | null, state?: string | null, province?: string | null, country: string }, prices: Array<{ __typename?: 'Price', createdAt: string, price: number }> } | null };

export type GetLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', country: string, city: string, province?: string | null, state?: string | null }> };


export const GetItemAndStoreCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getItemAndStoreCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"storeCount"}}]}}]} as unknown as DocumentNode<GetItemAndStoreCountsQuery, GetItemAndStoreCountsQueryVariables>;
export const SearchStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"city"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postalCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storesSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"city"},"value":{"kind":"Variable","name":{"kind":"Name","value":"city"}}},{"kind":"Argument","name":{"kind":"Name","value":"postalCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postalCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"zipCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<SearchStoreQuery, SearchStoreQueryVariables>;
export const GetLocationsAndCompaniesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLocationsAndCompanies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_count"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<GetLocationsAndCompaniesQuery, GetLocationsAndCompaniesQueryVariables>;
export const GetStoreDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStoreData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"store"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"companies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemsFromStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]}}]} as unknown as DocumentNode<GetStoreDataQuery, GetStoreDataQueryVariables>;
export const GetItemsFromStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getItemsFromStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsFromStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"resultsFound"}}]}}]}}]} as unknown as DocumentNode<GetItemsFromStoreQuery, GetItemsFromStoreQueryVariables>;
export const GetItemsFromCityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getItemsFromCity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"city"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsFromCity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"city"},"value":{"kind":"Variable","name":{"kind":"Name","value":"city"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"resultsFound"}}]}}]}}]} as unknown as DocumentNode<GetItemsFromCityQuery, GetItemsFromCityQueryVariables>;
export const GetItemAndItsStoreDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getItemAndItsStoreData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"imgUrl"}},{"kind":"Field","name":{"kind":"Name","value":"stores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetItemAndItsStoreDataQuery, GetItemAndItsStoreDataQueryVariables>;
export const GetLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<GetLocationsQuery, GetLocationsQueryVariables>;