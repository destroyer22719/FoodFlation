interface Address {
    street: string;
    city: string;
    postalCode: string;
    company: CompanyName;
}

export type CompanyName = "Loblaws" | "Metro";

export type Category = "Fruits & Vegetables" | "Meat" | "Dairy" | "Starches & Grains" | "Miscellaneous";
