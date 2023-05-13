import { getLocation } from "graphql";

type SearchParams = {
  country?: string;
  province?: string;
  state?: string;
  city?: string;
  search?: string;
};

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  // const [locations, items] = await Promise.all([])
  const { country, province, state, city, search } = searchParams;
  
  if (city && search) {

  }
  return (
    <div>
      <h1>Search Page</h1>
    </div>
  );
};

export default Page;
