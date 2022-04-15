import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_URL } from "../config";

export default function SearchBox() {
    const [show, setShow] = useState(false);
    const [locations, setLocations] = useState([]);

    // useEffect(() => {
    //     (async () => {
    //         const data = await fetch(`${API_URL}/stores/locations`);
    //         const res = await data.json();

    //         setLocations(res);
    //     })()
    // }, [])

    return (
        <div>
            <h3 onClick={() => setShow(true)}>
                <FaSearch /> Find a store
            </h3>
            {show && <div></div>}
        </div>
    );
}
