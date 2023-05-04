
type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  return <div>{children}</div>;
};

export default layout;
