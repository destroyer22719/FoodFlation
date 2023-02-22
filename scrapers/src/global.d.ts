interface Address {
  street: string;
  city: string;
  postalCode?: string;
  zipCode?: string;
  country: string;
  province?: string;
  state?: string;
  company: CompanyName;
}

export type CanadianStoresOptions = {
  metro?: boolean;
  loblaws?: boolean;
  noFrills?: boolean;
};

export type AmericanStoresOptions = {
  wholeFoodsMarket?: boolean;
  aldi?: boolean;
  target?: boolean;
};

export interface StoresOptions
  extends CanadianStoresOptions,
    AmericanStoresOptions {}

export type CompanyName =
  | "Loblaws"
  | "Metro"
  | "Whole Foods Market"
  | "Aldi"
  | "No Frills"
  | "Target";

export type Province = "alberta" | "british_columbia" | "ontario" | "quebec";
export type State = "new_york" | "california" | "texas" | "michigan";
export type StoreIndex = {
  storeIndex: number;
  itemIndex: number;
  storeTotal: number;
  itemTotal: number;
};

export type StoreLists = {
  us: {
    new_york: Address[];
    california: Address[];
    texas: Address[];
    michigan: Address[];
  };
  canada: {
    alberta: Address[];
    british_columbia: Address[];
    ontario: Address[];
    quebec: Address[];
  };
  firstItems: [];
  items: [];
};

export type StoreConfig = {
  province?: Province;
  state?: State;
  itemStart: number = 0;
  storeStart: number = 0;
  canadianStoreOptions?: CanadianStoresOptions;
  americanStoreOptions?: AmericanStoresOptions;
};
