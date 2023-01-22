// import { GetServerSideProps } from "next";
import React, { useEffect } from "react";

// const Index: React.FC<null> = () => {
//     return <div>This should return an error</div>;
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//     await fetch("localhost:4000/fail");
//     return { props: {} };
// };

const Index: React.FC<null> = () => {
  useEffect(() => {
    (async () => {
      await fetch("localhost:4000/fail");
    })();
  }, []);
  return <div>This should return an error</div>;
};

export default Index;

// export default function index() {
//     useEffect(() => {
//         (async () => {
//             await fetch("localhost:4000/fail")
//         })();
//     }, []);
//     return <div>This should return an error</div>;
// }
