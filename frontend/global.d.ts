export interface Company {
    id: string;
    name: string;
    stores: Store[];
}

export interface Store {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    companyId: string;
    company: Company;
    items: Item[]
}

export interface Item {
    id: string,
    name: string,
    storeId: string,
    store: Store,
    imgUrl: string,
    prices: Price[]
}

export interface Price {
    id: string,
    price: number,
    item: Item,
    itemId: string
    createdAt: string
}