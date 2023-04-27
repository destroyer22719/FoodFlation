declare global {
  type QueryCountResult = {
    itemCount: number;
    storeCount: number;
  };

  type QuerySearchStoreParams = {
    city?: string;
    postalCode?: string;
    zipCode?: string;
  };

  type QuerySearchStoreResult = {
    stores: Store[];
    total: number;
  };

  type QueryLocationResult = {
    _count: number;
    country: string;
    city: string;
    province?: string;
    state?: string;
  };

  type Store = {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode?: string;
    zipCode?: string;
  };
}

export {};
