"use client";

import { useSearchParams } from "next/navigation";
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

  return (
    <div>
      {categorySelected && (
        <div>
          <RxCross2 />
        </div>
      )}
      <div>
        {categoriesData.map(({ count, category }) => (
          <div>
            <div>
              {count} - {category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
