import Image from "next/image";

import styles from "@/styles/Components/SearchTable.module.scss";
import Link from "next/link";

type Props = {
  companies: Company[];
};

const CompanyButtons = ({ companies }: Props) => {
  return (
    <div className={styles["search-table__companies"]}>
      {companies.map((company) => (
        <Link href={`/stores?companyId=${company.id}`}>
          <div className={styles["search-table__company"]}>
            <Image
              width={60}
              height={60}
              alt={company.name}
              src={`/store-logos/${company.name
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
