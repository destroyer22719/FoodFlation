import { createContext, useContext, useState } from "react";
import { Store } from "../global";

type UpdateListConfigs = {
    changePage?: boolean;
    pageInc?: number;
    pageSearch?: number;
    citySearch?: string;
    stateSearch?: string;
    provinceSearch?: string;
};

export type StoreContextType = {
    stores: Store[];
    updateStoreList: (arg0: UpdateListConfigs) => Promise<void>;
    searchByCode: (
        postalCodeSearch: string,
        isZipCode?: boolean
    ) => Promise<void>;
    totalStores: number;
    loading: boolean;
};

const StoreContext = createContext<StoreContextType | {}>({});

type Props = {
    children: React.ReactNode;
};

const StoreContextProvider: React.FC<Props> = ({ children }) => {
    const [stores, setStores] = useState<Store[]>([]);
    const [totalStores, setTotalStores] = useState(1);
    const [loading, setLoading] = useState(false);

    const [postalCode, setPostalCode] = useState("");
    const [zipCode, setZipCode] = useState("");

    const [city, setCity] = useState("");
    const [page, setPage] = useState(1);
    const [province, setProvince] = useState("");
    const [state, setState] = useState("");

    const updateStoreList = async ({
        changePage,
        citySearch,
        provinceSearch,
        stateSearch,
        pageSearch = 1,
        pageInc = 0,
    }: UpdateListConfigs) => {
        setStores([]);
        setTotalStores(1);
        setLoading(true);

        let storeReq: Response;
        let storeRes: {
            stores: Store[];
            total: number;
        };

        if (!changePage) {
            storeReq = await fetch(
                `${
                    process.env.NEXT_PUBLIC_API_URL
                }/stores?page=${pageSearch}&city=${citySearch}&${
                    provinceSearch
                        ? `province=${provinceSearch}`
                        : `state=${stateSearch}`
                }`
            );

            setPage(pageSearch);
            setCity(citySearch!);
            if (provinceSearch) {
                setProvince(provinceSearch);
            } else if (stateSearch) {
                setState(stateSearch);
            }
        } else {
            if (postalCode || zipCode)
                storeReq = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/stores?page=${
                        page + pageInc
                    }&${
                        zipCode
                            ? `zipCode=${zipCode}`
                            : `postalCode=${postalCode}`
                    }`
                );
            else
                storeReq = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/stores?page=${
                        page + pageInc
                    }&city=${city}&${
                        province ? `province=${province}` : `state=${state}`
                    }`
                );

            setPage(page + pageInc);
        }
        storeRes = await storeReq.json();

        setStores(storeRes.stores);
        setTotalStores(storeRes.total);
        setLoading(false);
    };

    const searchByCode = async (codeSearch: string, isZipCode = false) => {
        setLoading(true);
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores?${
                isZipCode ? `zipCode=${codeSearch}` : `postalCode=${codeSearch}`
            }`
        );
        const data = await res.json();

        setStores(data.stores);
        setTotalStores(data.total);
        setPostalCode(codeSearch);
        setLoading(false);
    };

    return (
        <StoreContext.Provider
            value={{
                stores,
                updateStoreList,
                totalStores,
                searchByCode,
                loading,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export function useStoreContext(): StoreContextType {
    return useContext(StoreContext) as StoreContextType;
}

export default StoreContextProvider;
