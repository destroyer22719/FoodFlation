import { getItemsFromCity } from "@/graphql/queries";

type SearchParams = {
  city?: string;
  search?: string;
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { city, search } = searchParams;

  const items = await getItemsFromCity({
    city,
    search,
  });

  return (
    <div>
      <h1>Search Page</h1>
    </div>
  );
};

export default Page;
