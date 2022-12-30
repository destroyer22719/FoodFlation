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
};

export interface StoresOptions
  extends CanadianStoresOptions,
    AmericanStoresOptions {}

export type CompanyName =
  | "Loblaws"
  | "Metro"
  | "Whole Foods Market"
  | "Aldi"
  | "No Frills";

export type Province = "alberta" | "british_columbia" | "ontario" | "quebec";
export type State = "new_york" | "california" | "texas" | "michigan";
