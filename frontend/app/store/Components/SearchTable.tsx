"use client";

import { useState } from "react";
import {
  MdOutlineLocationOn,
  MdSearch,
} from "react-icons/md";
import { BsInputCursor } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import styles from "@/styles/Components/SearchTable.module.scss";
import LocationTable from "./LocationTable/LocationTable";
import SearchStore from "./SearchStore";

type Props = {
  locations: LocationObj;
};

const SearchTable = ({ locations }: Props) => {
  const [showComponent, setShowComponent] = useState(0);
  const [show, setShow] = useState(true);

  return (
    <div className={styles["search-table"]}>
      <div className={styles["search-table__buttons"]}>
        <div
          onClick={() => setShow(!show)}
          className={styles["search-table__button"]}
        >
          {show ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        <div
          onClick={() => {
            setShowComponent(0);
            setShow(true);
          }}
          className={styles["search-table__button"]}
        >
          <MdOutlineLocationOn />
        </div>
        <div
          onClick={() => {
            setShowComponent(1);
            setShow(true);
          }}
          className={styles["search-table__button"]}
        >
          <BsInputCursor />
        </div>
        <div
          onClick={() => {
            setShowComponent(2);
            setShow(true);
          }}
          className={styles["search-table__button"]}
        >
          <MdSearch />
        </div>
      </div>
      <div>
        {show &&
          (() => {
            switch (showComponent) {
              case 1:
                return <SearchStore/>;
              case 2:
                return <div>Company</div>;
              default:
                return <LocationTable locations={locations} />;
            }
          })()}
      </div>
    </div>
  );
};

export default SearchTable;
