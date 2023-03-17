import { API_URL } from "@/config/index";
import { notFound } from "next/navigation";

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string; search?: string; category?: string };
}) => {
  const { id } = params;
  const { page, search, category } = searchParams;

  const storeReq = await fetch(`${API_URL}/stores/${id}`);
  const itemsReq = await fetch(
    `${API_URL}/items/store/${id}?page=${page ? +page : 1}&search=${
      search || ""
    }&category=${
      category
        ? (category as string).replaceAll(" ", "%20").replaceAll("&", "%26")
        : ""
    }`
  );

  const store = await storeReq.json();
  const items = await itemsReq.json();

  if (!store || !items) {
    notFound();
  }

  return <div>{id}</div>;
};

export default page;
