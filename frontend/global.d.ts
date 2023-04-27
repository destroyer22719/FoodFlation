declare global {
  type QueryCountResult = {
    itemCount: number;
    storeCount: number;
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
