import Image from "next/image";
import { GetItemsFromCityQuery } from "__generated__/graphql";

interface Props {
  item: GetItemsFromCityQuery["itemsFromCity"]["items"][0];
}

const ItemCard: React.FC<Props> = ({ item }) => {
  const { stores, imgUrl, name, prices } = item;
  return (
    <div>
      <Image src={imgUrl} alt={name} width={100} height={100} />
      <div>{name}</div>
      <div>{prices[0].price}</div>
      <div>{new Date(prices[0].createdAt).toISOString().split("T")[0]}</div>
      <div>
        <Image
          src={storeNameToUrl(stores.name)}
          alt={stores.name}
          width={60}
          height={60}
        />
        <div>
          <div>{stores.street}</div>
          <div>{stores.postalCode || stores.zipCode}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
