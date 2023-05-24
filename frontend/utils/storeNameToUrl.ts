export const storeNameToUrl = (storeName: string) => {
  return `/store-logos/${storeName
    .toLocaleLowerCase()
    .replaceAll(" ", "_")}-logo.png`;
};
