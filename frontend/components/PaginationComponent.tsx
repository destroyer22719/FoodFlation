"use client";

import Link from "next/link";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import styles from "@/styles/StoreList.module.scss";

type Props = {
  page: number;
  maxPages: number;
};

const PaginationComponent: React.FC<Props> = ({ page, maxPages }) => {
  const pathname = window.location.href;

  function navigatePages(page: number) {
    const regex = /(?<=\?|\&)page=\d*/;

    if (pathname.match(regex)) {
      return pathname.replace(regex, `page=${page}`);
    }

    return pathname + `&page=${page}`;
  }

  return (
    <div>
      <div className={styles["store-list__pagination-buttons"]}>
        <Link href={navigatePages(page - 1)}>
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
        <Link href={navigatePages(page + 1)}>
          <ButtonContained
            className={styles["store-list__pagination-button"]}
            disabled={page == maxPages}
            onClick={() => {}}
          >
            <div className={styles["store-list__pagination-button-link"]}>
              {">"}
            </div>
          </ButtonContained>
        </Link>
      </div>
    </div>
  );
};

export default PaginationComponent;