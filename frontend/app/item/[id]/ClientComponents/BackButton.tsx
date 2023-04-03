"use client";

import ButtonContained from "@/components/CustomButtonComponents/ButtonContained";
import styles from "@/styles/Item.module.scss";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <div onClick={() => router.back()}>
      <ButtonContained className={styles["item-page__back-button"]}>
        {"<"}
      </ButtonContained>
    </div>
  );
};

export default BackButton;
