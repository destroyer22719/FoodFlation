"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import styles from "@/styles/components/Pagination.module.scss";
import Link from "next/link";

type Props = {
  resultsFound: number;
  resultsPerPage?: number;
};

const PaginationComponent = ({ resultsFound, resultsPerPage = 10 }: Props) => {
  const maxPages = Math.ceil(resultsFound / resultsPerPage);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pathname = usePathname();

  const navigatePages = (page: number) => {
    let url = pathname;
    url += `?${searchParams.toString()}`;
    if (page < 1 || page > maxPages) return url;

    if (searchParams.get("page")) {
      const regex = /(?<=\?|\&)page=\d*/;
      url = url.replace(regex, `page=${page}`);
    } else {
      url += `&page=${page}`;
    }

    if (!searchParams.get("resultsFound")) {
      url += `&resultsFound=${resultsFound}`;
    }

    return url;
  };

  return (
    <div className={styles["pagination"]}>
      <Link href={navigatePages(page - 1)}>
        <div className={styles["pagination__button"]}>
          {page > 1 && <BiChevronLeft />}
        </div>
      </Link>
      <Link href="#">
        <div className={styles["pagination__button"]}>
          <div>{maxPages > 0 && `${page} / ${maxPages}`}</div>
        </div>
      </Link>
      <Link href={navigatePages(page + 1)}>
        <div className={styles["pagination__button"]}>
          {page < maxPages && <BiChevronRight />}
        </div>
      </Link>
    </div>
  );
};

export default PaginationComponent;
