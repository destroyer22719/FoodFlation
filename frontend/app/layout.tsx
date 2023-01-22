"use client";
import Footer from "@/components/Footer";
import Nav from "../components/Nav";
import style from "../styles/Layout.module.scss";
import "../styles/global.scss";

type Props = {
  title: string;
  children: React.ReactNode;
};


const Layout: React.FC<Props> = ({ children }) => {
  return (
    <html>
      <body>
        <div className={style["layout"]}>
          <Nav />
          <div className={style["layout__main"]}>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default Layout;
