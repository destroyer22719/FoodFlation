import { GiSteak, GiFruitBowl, GiMilkCarton } from "react-icons/gi";
import { BiBowlHot } from "react-icons/bi";

import styles from "@/styles/Components/Category.module.scss";

type Category = {
  category: string;
};

const CategoryIcon: React.FC<Category> = ({ category }) => {
  const categories = [
    "Meat",
    "Fruits & Vegetables",
    "Starches & Grains",
    "Dairy",
    "Miscellaneous",
  ];
  let categoryClassName = category.toLowerCase().replace(/\s/g, "-");

  if (!categories.includes(category)) {
    categoryClassName = "miscellaneous";
  }
  return (
    <div className={styles[`category__${categoryClassName}`]} title={category}>
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
