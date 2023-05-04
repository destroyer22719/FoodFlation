import Image from "next/image";
import Link from "next/link";

interface Props {
  store: Store & { companies: { id: string } };
}

const StoreInfo = ({ store }: Props) => {
  const {
    city,
    street,
    name,
    state,
    zipCode,
    postalCode,
    province,
    country,
    companies: company,
  } = store;

  return (
    <div>
      <div>
        <Link href={`/company/${company.id}`}>
          <Image
            src={`/store-logos/${name
              .toLocaleLowerCase()
              .replaceAll(" ", "_")}-logo.png`}
            alt={name}
            width={80}
            height={80}
          />
          <div>
            <h1>{name}</h1>
          </div>
        </Link>
        <div>
          <div>{street}</div>
          <div>
            {city}, {province || state}, {country}
          </div>
          <div>{zipCode || postalCode}</div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
