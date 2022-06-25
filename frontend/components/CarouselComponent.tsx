import { Paper } from "@mui/material";
import Link from "next/link";
import Carousel from "react-material-ui-carousel";
import CarouselItem from "./CarouselItem";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "../styles/Carousel.module.scss";

const CarouselComponent = () => {
    const items = [
        {
            imgUrl: "/statistics_canada.jpg",
            content: (
                <div>
                    According to
                    <Link href="https://www150.statcan.gc.ca/n1/daily-quotidien/220622/dq220622a-eng.htm">
                        Stastics Canada
                    </Link>
                    , in May of 2022, the Consumer Price index rose by 7.7%.
                    Prices for grocery stores rose by 9.7%. Some items,
                    including edible fats and oils even saw a 30% increase. This
                    is the largest increase in inflation in almost 40 years!
                </div>
            ),
        },
        {
            imgUrl: "/broken_link.png",
            content: (
                <div>
                    There are many explainations as to why inflation is on the
                    rise. The main explaination are the fact that Covid19
                    disrupted the supply chain.
                </div>
            ),
        },
        {
            imgUrl: "/favicon.png",
            content: (
                <div>
                    There is no end to inflation in sight. FoodFlation is here
                    to track the prices of everyday grocery store items to
                    really gauge how much inflation is really impacting the
                    economy.
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