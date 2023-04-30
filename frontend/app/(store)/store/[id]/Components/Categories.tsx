"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { RxCross2 } from "react-icons/rx";

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
    <div>
      {categorySelected && (
        <div>
          <RxCross2 />
        </div>
      )}
      <div>
        {categoriesData.map(({ count, category }) => (
          <Link href={`${pathName}?category=${category}`}>
            <div>
              {count} - {category}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;