"use client";

import { useSearchParams } from "next/navigation";
import PaginationComponent from "./Components/PaginationButtons";

const Loading = () => {
  const searchParams = useSearchParams();
  const resultsFound = searchParams.get("resultsFound");

  return (
    <div>
      <PaginationComponent resultsFound={resultsFound ? +resultsFound : 0} />
      <div>Loading...</div>
    </div>
  );
};

export default Loading;
