import { Suspense } from "react";
import LoadingComponent from "./components/LoadingComponent";

const Loading = () => {
  return (
    <div>
      <Suspense fallback={<div></div>}>
        <LoadingComponent />
      </Suspense>
    </div>
  );
};

export default Loading;
