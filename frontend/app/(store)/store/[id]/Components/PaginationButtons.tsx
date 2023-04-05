"use client";

import styles from "@/styles/Store.module.scss";
import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { newUrl } from "../util";

type Props = {
  resultsFound: number;
};

const PaginationComponent: React.FC<Props> = ({ resultsFound }) => {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const pathName = usePathname();
  const router = useRouter();

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
      <ButtonContained
        disabled={page <= 1}
        className={styles["store-page__pagination-button"]}
        onClick={() =>
          router.push(newUrl(fullPath, "page", (page - 1).toString()))
        }
      >
        {"<"}
      </ButtonContained>
      <ButtonContained className={styles["store-page__pagination-button"]}>
        Page {page}/{maxPages}
      </ButtonContained>
      <ButtonContained
        disabled={page >= maxPages}
        className={styles["store-page__pagination-button"]}
        onClick={() =>
          router.push(newUrl(fullPath, "page", (page + 1).toString()))
        }
      >
        {">"}
      </ButtonContained>
    </div>
  );
};

export default PaginationComponent;
