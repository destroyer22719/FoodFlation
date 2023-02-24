"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import styles from "@/styles/StoreList.module.scss";
type Props = {
  page: number;
  maxPages: number;
};

const PaginationComponent: React.FC<Props> = ({ page, maxPages }) => {
  const pathname = usePathname();

  return (
    <div>
      <div className={styles["store-list__pagination-buttons"]}>
        <Link href={pathname}>
          <ButtonContained
            className={styles["store-list__pagination-button"]}
            disabled={page == 1}
            onClick={() => {}}
          >
            <div className={styles["store-list__pagination-button-link"]}>
              {"<"}
            </div>
          </ButtonContained>
        </Link>
        <ButtonContained className={styles["store-list__pagination-button"]}>
          <div className={styles["store-list__pagination-button-link"]}>
            Page {page}/{maxPages}
          </div>
        </ButtonContained>
        <ButtonContained
          className={styles["store-list__pagination-button"]}
          disabled={page == maxPages}
          onClick={() => {}}
        >
          <div className={styles["store-list__pagination-button-link"]}>
            {">"}
          </div>
        </ButtonContained>
      </div>
    </div>
  );
};

export default PaginationComponent;
