"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import styles from "@/styles/Components/Pagination.module.scss";

type Props = {
  resultsPerPage?: number;
};

const PaginationLoaderComponent = ({ resultsPerPage = 10 }: Props) => {
  const resultsFound = Number(useSearchParams().get("resultsFound")) || 0;
  const maxPages = Math.ceil(resultsFound / resultsPerPage);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pathname = usePathname();
  let url = pathname;

  const navigatePages = (page: number) => {
    const regex = /(?<=\?|\&)page=\d*/;
    url += `?${searchParams.toString()}`;

    if (url.match(regex)) {
      url = url.replace(regex, `page=${page}`);
    } else {
      url += `&page=${page}`;
    }

    if (!searchParams.get("resultsFound")) {
      url += `&resultsFound=${resultsFound}`;
    }

    if (page < 1 || page > maxPages) return;
    router.push(url);
  };

  return (
    <div className={styles["pagination"]}>
      <div
        onClick={() => navigatePages(page - 1)}
        className={styles["pagination__button"]}
      >
        {page > 1 && <BiChevronLeft />}
      </div>
      <div className={styles["pagination__button"]}>
        {page} / {maxPages}
      </div>
      <div
        onClick={() => navigatePages(page + 1)}
        className={styles["pagination__button"]}
      >
        {page < maxPages && <BiChevronRight />}
      </div>
    </div>
  );
};

export default PaginationLoaderComponent;
