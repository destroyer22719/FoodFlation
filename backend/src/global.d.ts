interface Address {
  street: string;
  city: string;
  postalCode: string;
  company: CompanyName;
}

export type CompanyName = "Loblaws" | "Metro" | "Whole Foods Marketplace" | "Aldi" | "No Frills" | "Target";

export type Category =
  | "Fruits & Vegetables"
  | "Meat"
  | "Dairy"
  | "Starches & Grains"
  | "Miscellaneous";
