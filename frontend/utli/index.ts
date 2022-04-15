import { Price } from "../global";

export function sortItemPricesByDate (prices: Price[]): Price[] {
    return prices.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (dateA < dateB) return 1;
        else if (dateA > dateB) return -1;
        return 0;
    })
}
