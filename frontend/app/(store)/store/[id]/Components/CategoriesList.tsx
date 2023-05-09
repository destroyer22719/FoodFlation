"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

import { getCategoryClassName } from "util/getCategoryClassName";

import categoryListStyles from "@/styles/Components/CategoryList.module.scss";
import categoryStyles from "@/styles/Components/Category.module.scss";

type Props = {
  categoriesData: {
    category: string;
    count: number;
  }[];
};

const Categories = ({ categoriesData }: Props) => {
  const searchParams = useSearchParams();
  const categorySelected = searchParams.get("category");
  const pathName = usePathname();

  return (
    <div className={categoryListStyles["category-list"]}>
      {categorySelected && (
        <div>
          <RxCross2 />
        </div>
      )}
      <>
        {categoriesData.map(({ count, category }) => (
          <Link href={`${pathName}?category=${category}`} key={category}>
            <div
              className={
                `${categoryStyles[`category__${getCategoryClassName(category)}`]} ${categoryListStyles["category-list__item"]} `
              }
            >
              {count} - {category}
            </div>
          </Link>
        ))}
      </>
    </div>
  );
};

export default Categories;
