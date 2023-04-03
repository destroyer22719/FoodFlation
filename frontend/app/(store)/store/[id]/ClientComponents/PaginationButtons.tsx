"use client";

import Link from "next/link";
import styles from "@/styles/Store.module.scss";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import { usePathname, useSearchParams } from "next/navigation";
import { newUrl } from "../util";

type Props = {
  resultsFound: number;
};

const PaginationComponent: React.FC<Props> = ({ resultsFound }) => {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const pathName = usePathname();
  const resultsFoundParam = searchParams.get("resultsFound");
  const fullPath = resultsFoundParam
    ? `${pathName}?${paramsString}`
    : `${pathName}?${paramsString}&resultsFound=${resultsFound}`;

  const pageSize = 10;
  const page = searchParams.get("page")
    ? +(searchParams.get("page") as string)
    : 1;

  const maxPages = Math.ceil(resultsFound / pageSize);

  return (
    <div className={styles["store-page__pagination-buttons"]}>
      <Link
        href={page <= 1 ? "#" : newUrl(fullPath, "page", (page - 1).toString())}
        className={styles["store-page__pagination-button-link"]}
      >
        <ButtonContained
          disabled={page <= 1}
          className={styles["store-page__pagination-button"]}
        >
          {"<"}
        </ButtonContained>
      </Link>
      <ButtonContained className={styles["store-page__pagination-button"]}>
        Page {page}/{maxPages}
      </ButtonContained>
      <Link
        href={
          page >= maxPages
            ? "#"
            : newUrl(fullPath, "page", (page + 1).toString())
        }
        className={styles["store-page__pagination-button-link"]}
      >
        <ButtonContained
          disabled={page >= maxPages}
          className={styles["store-page__pagination-button"]}
        >
          {">"}
        </ButtonContained>
      </Link>
    </div>
  );
};

export default PaginationComponent;
