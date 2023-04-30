import styles from "@/styles/Store.module.scss";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
  };
};

const StoreIdPage = async ({
  params,
  searchParams: { page = "", category = "", search = "" },
}: Props) => {
  const { id } = params;

  

  return (
    <div>

    </div>
  );
};

export default StoreIdPage;
