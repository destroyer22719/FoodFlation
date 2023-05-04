"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import styles from "@/styles/Components/Pagination.module.scss";

type Props = {
  resultsFound: number;
  resultsPerPage?: number;
};

const PaginationComponent = ({ resultsFound, resultsPerPage = 10 }: Props) => {
  const maxPages = Math.ceil(resultsFound / resultsPerPage);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pathname = usePathname();
  let url = pathname;

  const navigatePages = (page: number) => {
    if (page < 1 || page > maxPages) return;

    url += `/?${searchParams.toString()}`;

    if (searchParams.get("page")) {
      const regex = /(?<=\?|\&)page=\d*/;
      url = url.replace(regex, `page=${page}`);
    } else {
      url += `&page=${page}`;
    }

    if (!searchParams.get("resultsFound")) {
      url += `&resultsFound=${resultsFound}`;
    }
    
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

export default PaginationComponent;
