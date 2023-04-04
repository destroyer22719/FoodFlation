import { API_URL } from "@/config/index";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const locationReq = await fetch(`${API_URL}/stores/locations`);
  const locations = await locationReq.json();

  return <div>layout</div>;
};

export default layout;
