"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import styles from "@/styles/StoreList.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  maxPages: number;
};

const PaginationComponent: React.FC<Props> = ({ page = 1, maxPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
        <ButtonContained
          className={styles["store-list__pagination-button"]}
          disabled={page <= 1}
          onClick={() => router.push(navigatePages(page - 1))}
        >
          <div className={styles["store-list__pagination-button-link"]}>
            {"<"}
          </div>
        </ButtonContained>
        <ButtonContained className={styles["store-list__pagination-button"]}>
          <div className={styles["store-list__pagination-button-link"]}>
            Page {page}/{maxPages}
          </div>
        </ButtonContained>
        <ButtonContained
          className={styles["store-list__pagination-button"]}
          disabled={page >= maxPages}
          onClick={() => router.push(navigatePages(page + 1))}
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
