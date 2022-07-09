import { GetServerSideProps } from "next";
import React from "react";

const index: React.FC<{}> = () => {
    return <div>This should return an error</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
    await fetch("localhost:4000/fail");
    return { props: {} };
};

export default index;
