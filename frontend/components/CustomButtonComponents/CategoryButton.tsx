import ButtonContained from "./ButtonContained";
import styles from "../../styles/CategoryButton.module.scss";
import Link from "next/link";
import { UrlObject } from "url";
import { Category } from "../../global";

type Props = {
  category: Category;
  linkTo?: UrlObject | string;
  className?: string;
  count?: number;
};

const CategoryButton: React.FC<Props> = ({
  category,
  linkTo,
  className,
  count,
}) => {
  return (
    <Link href={linkTo ? linkTo : "#"}>
      <ButtonContained
        className={`${className || ""} ${
          styles[
            `category__${category
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("&", "and")}`
          ]
        }`}
      >
        {category} {count !== undefined ? `- ${count}` : ""}
      </ButtonContained>
    </Link>
  );
};

export default CategoryButton;
