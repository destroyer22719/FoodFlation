import Image from "next/image";

type Props = {
  item: {
    name: string;
    price: number;
    imgUrl: string;
    id: string;
  };
  store: {
    name: string;
    address: string;
  };
};

export const ItemFromStoreCard: React.FC<Props> = ({ item, store }) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <div>
        <Image src={item.imgUrl} alt={item.name} />
        <div>
          <Image
            src={`/store-logos/${store.name
              .toLocaleLowerCase()
              .replaceAll(" ", "_")}-logo.png`}
            alt={store.name}
            width={80}
            height={80}
          />
          <div>{store.address}</div>
        </div>
      </div>
    </div>
  );
};
