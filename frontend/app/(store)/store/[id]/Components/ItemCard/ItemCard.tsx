import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import Link from "next/link";

type Props = {
  item: Omit<Item, "createdAt" | "updatedAt" | "storeId">;
};

const ItemCard = ({ item }: Props) => {
  const { category, id, imgUrl, name, prices } = item;
  const price = prices[0].price;
  const lastUpdated = new Date(prices[0].createdAt).toLocaleDateString();
  
  return (
    <Link href={`/item/${id}`}>
      <div>
        <Image alt={name} height={200} width={200} src={imgUrl} />
        <div>
          <CategoryIcon category={category} />
          <div>{name}</div>
        </div>
        <div>{price}</div>
        <div>{lastUpdated}</div>
      </div>
    </Link>
  );
};

export default ItemCard;
