declare global {
  interface Item {
    id: string;
    name: string;
    storeId: string;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    storeId: string;
    prices: Price[];
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

  interface StoreWithCompany extends Store {
    companies: {
      id: string;
    };
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
