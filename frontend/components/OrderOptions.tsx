import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import ButtonContained from "./CustomButtonComponents/ButtonContained";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type Props = {
  column: string;
  order: boolean;
  handleColumnChange: (e: SelectChangeEvent) => void;
  handleOrderChange: () => void;
};

const OrderOptions: React.FC<Props> = ({
  column,
  order,
  handleColumnChange,
  handleOrderChange,
}) => {
  return (
    <div>
      <Select value={column} onChange={handleColumnChange} placeholder="Sort By">
        <MenuItem value={"price"}>Price</MenuItem>
        <MenuItem  value={"lastUpdated"}>Last Updated</MenuItem>
      </Select>
      {column === "price" && (
        <ButtonContained onClick={() => handleOrderChange()}>
          {order ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </ButtonContained>
      )}
    </div>
  );
};

export default OrderOptions;
