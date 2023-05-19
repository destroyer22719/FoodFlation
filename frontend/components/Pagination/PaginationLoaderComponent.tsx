"use client";

import { useSearchParams } from "next/navigation";

import PaginationComponent from "./PaginationComponent";

type Props = {
  resultsPerPage?: number;
};

const PaginationLoaderComponent = ({}: Props) => {
  const searchParams = useSearchParams()!;
  const resultsFound = Number(searchParams.get("resultsFound")) || 0;

  return <PaginationComponent resultsFound={resultsFound} />;
};

export default PaginationLoaderComponent;
