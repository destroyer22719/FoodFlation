import { GiSteak, GiFruitBowl, GiMilkCarton } from "react-icons/gi";
import { BiBowlHot } from "react-icons/bi";

import styles from "@/styles/components/Category.module.scss";
import { getCategoryClassName } from "util/getCategoryClassName";

type Category = {
  category: string;
};

const CategoryIcon: React.FC<Category> = ({ category }) => {
  return (
    <div
      className={styles[`category__${getCategoryClassName(category)}`]}
      title={category}
    >
      {(() => {
        switch (category) {
          case "Meat":
            return <GiSteak />;
          case "Fruits & Vegetables":
            return <GiFruitBowl />;
          case "Starches & Grains":
            return <GiFruitBowl />;
          case "Dairy":
            return <GiMilkCarton />;
          default:
            return <BiBowlHot />;
        }
      })()}
    </div>
  );
};

export default CategoryIcon;
