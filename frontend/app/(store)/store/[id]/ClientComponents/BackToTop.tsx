"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import Link from "next/link";
import styles from "@/styles/Store.module.scss";
import { usePathname } from "next/navigation";

const BackToTop = () => {
  const currentPath = usePathname();

  return (
    <div>
      <ButtonContained className={styles["store-page__back-to-top-button"]}>
        <Link
          href={`${currentPath}#header`}
          className={styles["store-page__back-to-top-button-link"]}
        >
          Back to top
        </Link>
      </ButtonContained>
    </div>
  );
};

export default BackToTop;
