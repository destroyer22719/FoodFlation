import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  unit: Scalars['String'];
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
  sortByAsc?: InputMaybe<Scalars['Boolean']>;
  sortByPrice?: InputMaybe<Scalars['Boolean']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CacheControlScope: CacheControlScope;
  CategoryData: ResolverTypeWrapper<CategoryData>;
  Company: ResolverTypeWrapper<Company>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Item: ResolverTypeWrapper<Item>;
  ItemCitySearchResult: ResolverTypeWrapper<ItemCitySearchResult>;
  ItemStoreSearchResult: ResolverTypeWrapper<ItemStoreSearchResult>;
  Location: ResolverTypeWrapper<Location>;
  Price: ResolverTypeWrapper<Price>;
  Query: ResolverTypeWrapper<{}>;
  Store: ResolverTypeWrapper<Store>;
  StoresSearchResult: ResolverTypeWrapper<StoresSearchResult>;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  CategoryData: CategoryData;
  Company: Company;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Item: Item;
  ItemCitySearchResult: ItemCitySearchResult;
  ItemStoreSearchResult: ItemStoreSearchResult;
  Location: Location;
  Price: Price;
  Query: {};
  Store: Store;
  StoresSearchResult: StoresSearchResult;
  String: Scalars['String'];
}>;

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']>;
  maxAge?: Maybe<Scalars['Int']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CategoryDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryData'] = ResolversParentTypes['CategoryData']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imgUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prices?: Resolver<Array<ResolversTypes['Price']>, ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stores?: Resolver<ResolversTypes['Store'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemCitySearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemCitySearchResult'] = ResolversParentTypes['ItemCitySearchResult']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['Item']>, ParentType, ContextType>;
  resultsFound?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemStoreSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemStoreSearchResult'] = ResolversParentTypes['ItemStoreSearchResult']> = ResolversObject<{
  categories?: Resolver<Array<ResolversTypes['CategoryData']>, ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Item']>, ParentType, ContextType>;
  resultsFound?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = ResolversObject<{
  _count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Price'] = ResolversParentTypes['Price']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['Item'], ParentType, ContextType>;
  itemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompanyArgs, 'id'>>;
  item?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemArgs, 'id'>>;
  itemCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  itemsFromCity?: Resolver<ResolversTypes['ItemCitySearchResult'], ParentType, ContextType, RequireFields<QueryItemsFromCityArgs, 'city' | 'search'>>;
  itemsFromStore?: Resolver<ResolversTypes['ItemStoreSearchResult'], ParentType, ContextType, RequireFields<QueryItemsFromStoreArgs, 'storeId'>>;
  locations?: Resolver<Array<ResolversTypes['Location']>, ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryStoreArgs, 'id'>>;
  storeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  storesSearch?: Resolver<ResolversTypes['StoresSearchResult'], ParentType, ContextType, Partial<QueryStoresSearchArgs>>;
}>;

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = ResolversObject<{
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companies?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Item']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StoresSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoresSearchResult'] = ResolversParentTypes['StoresSearchResult']> = ResolversObject<{
  stores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CategoryData?: CategoryDataResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  ItemCitySearchResult?: ItemCitySearchResultResolvers<ContextType>;
  ItemStoreSearchResult?: ItemStoreSearchResultResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Price?: PriceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  StoresSearchResult?: StoresSearchResultResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
}>;
