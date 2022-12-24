import React from "react";
import Image from "next/image";
import styles from "../../styles/Carousel.module.scss";

type Props = {
  imgUrl: string;
  children: React.ReactNode;
};

const CarouselItem: React.FC<Props> = ({ imgUrl, children }) => {
  return (
    <div className={styles["carousel__item"]}>
      <div>{children}</div>
      {imgUrl && (
        <div className={styles["carousel__item-img"]}>
          <Image src={imgUrl} alt={""} width={125} height={125} />
        </div>
      )}
    </div>
  );
};

export default CarouselItem;
