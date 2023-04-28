"use client";

import ButtonContained from "./ButtonContained";
// import styles from "@/styles/CategoryButton.module.scss";

type Props = {
  className: string;
};

const CategoryButtonSkeleton = ({ className }: Props) => {
  const categories = [
    "meat",
    "miscellaneous",
    "fruits-and-vegetables",
    "dairy",
    "starches-and-grains",
    "canned-food",
  ];

  const category = categories.sort(() => 0.5 - Math.random())[0];
  //${styles[`category__${category}--skeleton`]}
  return (
    <ButtonContained
      className={`${className} `}
    >
      <></>
    </ButtonContained>
  );
};

export default CategoryButtonSkeleton;
