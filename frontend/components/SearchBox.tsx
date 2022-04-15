import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_URL } from "../config";

interface fetchResultElement {
    city: string;
}

export default function SearchBox() {
    const [show, setShow] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const data = await fetch(`${API_URL}/stores/locations`);
            const res: fetchResultElement[] = await data.json();
            const parsedData: string[] = [];
            res.forEach((x) => parsedData.push(x.city));
            setLocations(parsedData);
        })();
    }, []);

    useEffect(() => {
        locations.forEach((location: string) => {
            const city = location.split(", ")[0];
            const province = location.split(", ")[1];

            if (!provinces.includes(province))
                setProvinces((oldArray) => [...oldArray, province]);
            if (!cities.includes(city))
                setCities((oldArray) => [...oldArray, city]);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locations]);

    return (
        <div>
            <h3 onClick={() => setShow(!show)}>
                <FaSearch /> Find a store
            </h3>
            {show && (
                <div>
                    {provinces.map((province, i) => (
                        <div key={i}>
                            <div>{province}</div>
                            {cities.map((city, i) => (
                                <div key={i}>{city}</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
