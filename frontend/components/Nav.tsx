import Link from "next/link";
import styles from "@/styles/components/Nav.module.scss";
import { MdSearch } from "react-icons/md";

const Nav = () => {
  return (
    <nav className={styles["nav"]}>
      <div className={styles["nav__section"]}>
        <Link href={"#"} className={styles["nav__item"]}>
          Home
        </Link>
      </div>
      <div className={styles["nav__section--center"]}>
        <Link href={"/stores"} className={styles["nav__item"]}>
          <MdSearch />
          <div>Search Stores</div>
        </Link>
        <Link href={"/search"} className={styles["nav__item"]}>
          <MdSearch />
          <div>Search Items</div>
        </Link>
      </div>
      <div className={styles["nav__section"]}>
        <Link href={"#"} className={styles["nav__item"]}>
          FAQ
        </Link>
        <Link href={"#"} className={styles["nav__item"]}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
