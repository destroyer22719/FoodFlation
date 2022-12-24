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

export type CompanyName = "Loblaws" | "Metro" | "Whole Foods Market" | "Aldi";
export type Province = "alberta" | "british_columbia" | "ontario" | "quebec";
export type State = "new_york" | "california" | "texas" | "michigan";
