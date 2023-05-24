export const getCategoryClassName = (category: string) => {
  const categories = [
    "Meat",
    "Fruits & Vegetables",
    "Starches & Grains",
    "Dairy",
    "Miscellaneous",
  ];
  let categoryClassName = category
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace("&", "and");

  if (!categories.includes(category)) {
    categoryClassName = "miscellaneous";
  }

  return categoryClassName;
};

