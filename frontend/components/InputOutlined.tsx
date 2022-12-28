import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ChangeEventHandler, KeyboardEventHandler } from "react";

const InputOutlinedStyle = styled(TextField)({
  "& input:valid + fieldset": {
    borderColor: "#9388A2",
    borderWidth: 2,
  },
  "& input:valid:hover + fieldset": {
    borderColor: "#9388A2",
  },
  "& input:valid:focus + fieldset": {
    padding: "4px !important",
    borderColor: "#9388A2",
  },
});

type Props = {
  focused?: boolean;
  disabled?: boolean;
  value: string;
  onChange: ChangeEventHandler<Element>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
  placeholder?: string;
};

const InputOutlined: React.FC<Props> = ({
  value,
  onChange,
  className,
  placeholder,
  onKeyDown,
  disabled = false,
  focused = false,
}) => {
  return (
    <InputOutlinedStyle
      focused={focused}
      disabled={disabled}
      variant="outlined"
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default InputOutlined;
