interface Address {
    street: string;
    city: string;
    postalCode: string;
    company: CompanyName;
}

export type CompanyName = "Loblaws" | "Metro";
