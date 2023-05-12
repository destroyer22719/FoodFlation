"use client";

import { FC, useState } from "react";
import { BiTime, BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi";

import styles from "@/styles/components/CriticalValues.module.scss";
import timeAgo from "util/timeAgo";

type CriticalValueTypes = "latest" | "highest" | "lowest";

type CriticalValueObject = {
  price: number;
  date: string;
};

type Props = {
  latest: CriticalValueObject;
  highest: CriticalValueObject;
  lowest: CriticalValueObject;
};

const CriticalValuesComponents: FC<Props> = ({ highest, latest, lowest }) => {
  const [msg, setMsg] = useState("");

  let timeout: NodeJS.Timeout;

  const handleClick = (type: CriticalValueTypes) => {
    if (type === "latest") {
      setMsg(
        `Latest price: $${latest.price} | ${latest.date} (${timeAgo(
          new Date(latest.date)
        )})`
      );
    } else if (type === "highest") {
      setMsg(
        `Highest price: $${highest.price} | ${highest.date} (${timeAgo(
          new Date(highest.date)
        )})`
      );
    } else if (type === "lowest") {
      setMsg(
        `Lowest price: $${lowest.price} | ${lowest.date} (${timeAgo(
          new Date(lowest.date)
        )})`
      );
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setMsg("");
    }, 10000);
  };

  return (
    <div>
      <div className={styles["critical-vals__buttons"]}>
        <div
          className={styles["critical-vals__button"]}
          onClick={() => handleClick("latest")}
        >
          <BiTime />
          <div>
            ${latest.price} | {latest.date}
          </div>
        </div>
        <div
          className={styles["critical-vals__button"]}
          onClick={() => handleClick("highest")}
        >
          <BiUpArrowAlt />
          <div>
            ${highest.price} | {highest.date}
          </div>
        </div>
        <div
          className={styles["critical-vals__button"]}
          onClick={() => handleClick("lowest")}
        >
          <BiDownArrowAlt />
          <div>
            ${lowest.price} | {lowest.date}
          </div>
        </div>
      </div>
      <div className={styles["critical-vals__msg"]}>{msg}</div>
    </div>
  );
};

export default CriticalValuesComponents;
