import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBox() {
    const [show, setShow] = useState(false)

    return (
        <div>
            <h3>
                <FaSearch /> Find a store
            </h3>
            {show && (<div>
                
            </div>)}
        </div>
    );
}
