import { getLocation } from "graphql";

type SearchParams = {
  country?: string;
  province?: string;
  state?: string;
  city?: string;
  search?: string;
};

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // const [locations, items] = await Promise.all([])

  return <div></div>;
};

export default Page;
