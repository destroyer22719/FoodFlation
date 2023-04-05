"use client";

import { useSearchParams } from "next/navigation";
import PaginationComponent from "./Components/PaginationButtons";
import SkeletonItemCard from "./Components/SkeletonItemCard";

const Loading = () => {
  const searchParams = useSearchParams();
  const resultsFound = searchParams.get("resultsFound");

  return (
    <div>
      <PaginationComponent resultsFound={resultsFound ? +resultsFound : 0} />
      <div>
        {[1, 2, 3].map((id) => (
          <SkeletonItemCard key={id} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
