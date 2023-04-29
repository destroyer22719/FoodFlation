import { getStoreData } from "@/queries/index";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

const Layout = async ({ params }: Props) => {
  const { id } = params;
  const { store, itemsFromStore } = await getStoreData(id);

  const {
    city,
    companies: company,
    street,
    name,
    state,
    zipCode,
    postalCode,
    province,
    country
  } = store;
  return (
    <div>
      <Link href={`/company/${company.id}`}>
        <Image
          src={`${name.toLocaleLowerCase().replaceAll(" ", "_")}-logo.png`}
          alt={name}
        />
        <div>
          <h1>{name}</h1>
        </div>
      </Link>
      <div>
        <div>{street}</div>
        <div>
          {city}, {province || state!}, {country}
        </div>
        <div>{zipCode || postalCode}</div>
      </div>
    </div>
  );
};

export default Layout;
