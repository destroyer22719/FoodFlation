import PaginationComponent from "@/components/Pagination/PaginationComponent";
import { getItemsFromCity } from "@/graphql/queries";
import { Suspense } from "react";

type SearchParams = {
  city?: string;
  search?: string;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { city, search } = searchParams;

  const { resultsFound, items } = await getItemsFromCity({
    city,
    search,
  });

  return (
    <div>
      <Suspense fallback={<div></div>}>
        <PaginationComponent resultsFound={resultsFound} />
      </Suspense>
    </div>
  );
};

export default Page;
