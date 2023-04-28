import Image from "next/image";

import styles from "@/styles/Components/SearchTable.module.scss";
import Link from "next/link";

const CompanyButtons = () => {
  const companies = [
    "Metro",
    "Loblaws",
    "No Frills",
    "Whole Foods Market",
    "Aldi",
  ];

  return (
    <div className={styles["search-table__companies"]}>
      {companies.map((company) => (
        <Link href={`/stores?company=${company}`}>
          <div className={styles["search-table__company"]}>
            <Image
              width={60}
              height={60}
              alt={company}
              src={`/store-logos/${company
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
