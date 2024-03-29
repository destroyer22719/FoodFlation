import { Analytics } from "@vercel/analytics/react";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import style from "@/styles/pages/Layout.module.scss";

import "@/styles/global.scss";
import { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { redirect } from "next/navigation";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "FoodFlation",
  description: "Helping consumers undersand and navigate food inflation",
  keywords: "food, inflation, prices, groceries, grocery, canada, usa",
};

const Layout: React.FC<Props> = ({ children }) => {
  // if (1+1===2) {
  //   redirect("https://github.com/destroyer22719/FoodFlation?");
  // }

  return (
    <html lang="en">
      <body>
        <SpeedInsights />
        <div className={style["layout"]}>
          <Nav />
          <div className={style["layout__main"]}>{children}</div>
          <Footer />
        </div>
      </body>
      <Analytics />
    </html>
  );
};

export default Layout;
