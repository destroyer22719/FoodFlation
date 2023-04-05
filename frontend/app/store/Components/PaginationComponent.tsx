"use client";

import Link from "next/link";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import styles from "@/styles/StoreList.module.scss";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  maxPages: number;
};

const PaginationComponent: React.FC<Props> = ({ page, maxPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigatePages(page: number) {
    let url = pathname;
    const regex = /(?<=\?|\&)page=\d*/;
    url += `?${searchParams.toString()}`;

    if (url.match(regex)) {
      return url.replace(regex, `page=${page}`);
    }

    return url + `&page=${page}#storeList`;
  }

  return (
    <div>
      <div className={styles["store-list__pagination-buttons"]}>
        <Link href={navigatePages(page - 1)}>
          <ButtonContained
            className={styles["store-list__pagination-button"]}
            disabled={page == 1}
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
