import { getLocations } from "@/graphql/queries";
import Form from "./components/Form";

type Props = {
  country?: string;
  province?: string;
  state?: string;
  city?: string;
  search?: string;
};

const layout = async (props: Props) => {
  const locations = await getLocations();

  const locationsMap = locations.reduce(
    (acc, { country, city, province, state }) => {
      const key = province || state || "";
      const subKey =
        key !== "" && country === "United States" ? "states" : "provinces";
      const subMap = acc[country] || {};

      subMap[key] = [...(subMap[key] || []), city];
      acc[country] = { ...subMap, [subKey]: Object.keys(subMap) };

      return acc;
    },
    {} as LocationMap
  );

  return (
    <div>
      <Form {...props} locations={locationsMap} />
      <div>{}</div>
    </div>
  );
};

export default layout;
