declare global {
  type Country = "canada" | "us";

  interface Address {
    street: string;
    city: string;
    postalCode?: string;
    zipCode?: string;
    country: Country;
    province?: string;
    state?: string;
    company: CompanyName;
  }

  type CanadianStoresOptions = {
    metro?: boolean;
    loblaws?: boolean;
    noFrills?: boolean;
  };

  type AmericanStoresOptions = {
    wholeFoodsMarket?: boolean;
    aldi?: boolean;
    target?: boolean;
  };

  interface StoresOptions
    extends CanadianStoresOptions,
      AmericanStoresOptions {}

  type CompanyName =
    | "Loblaws"
    | "Metro"
    | "Whole Foods Market"
    | "Aldi"
    | "No Frills"
    | "Target";

  type Province = "alberta" | "british_columbia" | "ontario" | "quebec";
  type State = "new_york" | "california" | "texas" | "michigan";
  type StoreIndexes = {
    storeIndex: number;
    itemIndex: number;
    storeTotal: number;
    itemTotal: number;
  };

  type StoreLists = {
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
    storeStart: number = 0;
  };

  type StoreConfig = {
    canadaOnly?: boolean = false;
    usOnly?: boolean = false;
    province?: Province;
    state?: State;
    itemStart: number = 0;
    storeStart: number = 0;
    canadianStoreOptions?: CanadianStoresOptions;
    americanStoreOptions?: AmericanStoresOptions;
  };
  type GetStoreIdParams = {
    companyId: string;
    city: string;
    street: string;
    country: Country;
    province?: string;
    postalCode?: string;
    zipCode?: string;
    state?: string;
    name: string;
  };
  type UpdateItemParams = {
    storeId: string;
    result: {
      name: string;
      price: number;
      imgUrl: string;
    };
  };
}

export {};
