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
        <Link href={pathName}>
          <div className={categoryListStyles["category-list__clear--center"]}>
            <div className={categoryListStyles["category-list__clear"]}>
              <RxCross2 />
            </div>
          </div>
        </Link>
      )}
      <div className={categoryListStyles["category-list__items"]}>
        {categoriesData.map(({ count, category }) => (
          <Link
            href={`${pathName}?category=${category.replace("&", "%26")}`}
            key={category}
          >
            <div
              className={`${
                categoryStyles[`category__${getCategoryClassName(category)}`]
              } ${categoryListStyles["category-list__item"]} `}
            >
              {count} - {category}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
