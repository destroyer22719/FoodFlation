interface Address {
    street: string;
    city: string;
    postalCode: string;
    company: CompanyName;
}

export type CompanyName = "Loblaws" | "Metro";
export type Province = "alberta" | "british_columbia" | "ontario" | "quebec";