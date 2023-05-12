import { GiSteak, GiFruitBowl, GiMilkCarton } from "react-icons/gi";
import { BiBowlHot } from "react-icons/bi";

import styles from "@/styles/components/Category.module.scss";
import { getCategoryClassName } from "@/utils/getCategoryClassName";

type Category = {
  category: string;
  format?: boolean;
  className?: string;
};

const CategoryIcon: React.FC<Category> = ({
  category,
  format = true,
  className,
}) => {
  return (
    <div
      className={`
        ${styles[`category__${getCategoryClassName(category)}`]} 
        ${format ? styles[`category__icon--format`] : ""}
        ${className ? className : ""}
      `}
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
