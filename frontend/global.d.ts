declare global {
  type QueryCountResult = {
    itemCount: number;
    storeCount: number;
  };

  type QuerySearchStoreParams = {
    city?: string;
    postalCode?: string;
    zipCode?: string;
    companyId?: string;
    page?: number;
  };

  type QuerySearchStoreResult = {
    stores: Store[];
    total: number;
  };

  type Company = {
    id: string;
    name: string;
  };

  type QueryLocationAndCompaniesResult = {
    companies: Company[];
    locations: {
      _count: number;
      country: string;
      city: string;
      province?: string;
      state?: string;
    }[];
  };

  type Store = {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode?: string;
    zipCode?: string;
  };

  type LocationObj = {
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
}

export {};
