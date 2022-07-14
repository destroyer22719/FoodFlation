// import { GetServerSideProps } from "next";
import React, {useEffect} from "react";

// const index: React.FC<null> = () => {
//     return <div>This should return an error</div>;
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//     await fetch("localhost:4000/fail");
//     return { props: {} };
// };

// export default index;

export default function index() {
    useEffect(() => {
        (async () => {
            await fetch("localhost:4000/fail")
        })();
    }, []);
    return <div>This should return an error</div>;
}
