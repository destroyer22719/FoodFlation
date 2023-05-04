"use client";

import { useSearchParams } from "next/navigation";

import PaginationComponent from "./PaginationComponent";

type Props = {
  resultsPerPage?: number;
};

const PaginationLoaderComponent = ({ resultsPerPage = 10 }: Props) => {
  const resultsFound = Number(useSearchParams().get("resultsFound")) || 0;

  return (
    <PaginationComponent resultsFound={resultsFound} />
  );
};

export default PaginationLoaderComponent;
