import React from "react";
import { Paper } from "@mui/material";
import Image from "next/image";
import styles from "../styles/Carousel.module.scss";

type Props = {
    imgUrl: string;
    children: React.ReactNode;
};

const CarouselItem: React.FC<Props> = ({ imgUrl, children }) => {
    return (
        <div className={styles["carousel__item"]}>
            <div>{children}</div>
            {imgUrl && <Image width={100} height={100} src={imgUrl} alt={""}/>}
        </div>
    );
};

export default CarouselItem;
