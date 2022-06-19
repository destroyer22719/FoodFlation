import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ChangeEventHandler } from "react";

const InputFilledStyle = styled(TextField)({
    "& input:valid + fieldset": {
        borderColor: "#9388A2",
        borderWidth: 2,
    },
    "& input:valid:hover + fieldset": {
        borderColor: "#9388A2",
    },
    "& input:valid:focus + fieldset": {
        borderLeftWidth: 6,
        padding: "4px !important", // override inline-style,
        borderColor: "#9388A2",
    },
});

type Props = {
    value: string;
    onChange: ChangeEventHandler<Element>;
    className?: string;
    placeholder?: string;
};

const InputFilled: React.FC<Props> = ({
    value,
    onChange,
    className,
    placeholder,
}) => {
    return (
        <InputFilledStyle
            variant="outlined"
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={onChange}
        />
    );
};

export default InputFilled;
