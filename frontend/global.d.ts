export interface Company {
    id: string;
    name: string;
    stores: Store[];
}

export type Category =
    | "Fruits & Vegetables"
    | "Meat"
    | "Dairy"
    | "Starches & Grains"
    | "Miscellaneous";

export interface Store {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode?: string;
    zipCode?: string;
    country: string;
    companyId: string;
    company: Company;
    items: Item[];
}

export interface Item {
    id: string;
    name: string;
    storeId: string;
    store: Store;
    imgUrl: string;
    prices: Price[];
    price: number;
    lastUpdated?: Date;
    category: Category;
}

export interface Price {
    id: string;
    price: number;
    item: Item;
    itemId: string;
    createdAt: string;
}
