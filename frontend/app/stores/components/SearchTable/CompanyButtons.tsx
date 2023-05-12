import Image from "next/image";

import styles from "@/styles/components/SearchTable.module.scss";
import Link from "next/link";

type Props = {
  companies: Company[];
};

const CompanyButtons = ({ companies }: Props) => {
  return (
    <div className={styles["search-table__companies"]}>
      {companies.map(({ name, id }) => (
        <Link href={`/stores?companyId=${id}`} key={id}>
          <div className={styles["search-table__company"]}>
            <Image
              width={60}
              height={60}
              alt={name}
              src={`/store-logos/${name
                .toLocaleLowerCase()
                .replaceAll(" ", "_")}-logo.png`}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CompanyButtons;
