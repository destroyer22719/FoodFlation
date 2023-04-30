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

  type QueryStoreResult = {
    store: Store & { companies: { id: string } };
    itemsFromStore: {
      total: number;
      categories: Category[];
    };
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

  type QueryItemsFromStoreResult = {
    items: Item[];
    total: number;
    categories: Category[];
  };

  interface Item {
    id: string;
    name: string;
    storeId: string;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    storeId: string;
    price: Price[];
  }

  interface Price {
    price: number;
    createdAt: string;
  }

  interface Store {
    id: string;
    name: string;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    zipCode?: string;
    state?: string;
    province?: string;
  }

  interface Company {
    id: string;
    name: string;
  }

  interface Category {
    category: string;
    count: number;
  }

  type LocationObj = {
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
}

export {};
