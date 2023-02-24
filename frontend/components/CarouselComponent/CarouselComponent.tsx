"use client";

import Link from "next/link";
import Carousel from "react-material-ui-carousel";
import CarouselItem from "./CarouselItem";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "../../styles/Carousel.module.scss";
import { useEffect, useState } from "react";

const CarouselComponent = () => {
  const [displayNavButtons, setDisplayNavButtons] = useState(false);

  const updateMedia = () => {
    if (window.innerWidth < 500) {
      setDisplayNavButtons(false);
    } else {
      setDisplayNavButtons(true);
    }
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const items = [
    {
      imgUrl: "/inflation_icon.png",
      content: (
        <div>
          According to
          <Link href="https://www150.statcan.gc.ca/n1/daily-quotidien/220622/dq220622a-eng.htm">
            {" "}
            Stastics Canada
          </Link>
          , in May of 2022, the Consumer Price index rose by 7.7%. Prices for
          grocery stores rose by 9.7%. Some items, including edible fats and
          oils even saw a 30% increase. This is the largest increase in
          inflation in almost 40 years!
        </div>
      ),
    },
    {
      imgUrl: "/broken_link.png",
      content: (
        <div>
          There are many explainations as to why inflation is on the rise. The
          main explaination are the fact that Covid19 disrupted the supply
          chain.
        </div>
      ),
    },
    {
      imgUrl: "/favicon.png",
      content: (
        <div>
          There is no end to inflation in sight. FoodFlation is here to track
          the prices of everyday grocery store items to really gauge how much
          inflation is really impacting the economy.
        </div>
      ),
    },
  ];
  return (
    <div>
      <Carousel
        className={styles["carousel"]}
        NextIcon={<ArrowForwardIosIcon />}
        PrevIcon={<ArrowBackIosNewIcon />}
        autoPlay={false}
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: {
            backgroundColor: "#9388A2",
          },
        }}
        navButtonsAlwaysInvisible={!displayNavButtons}
      >
        {items.map((item, i) => (
          <CarouselItem key={i} imgUrl={item.imgUrl}>
            {item.content}
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
