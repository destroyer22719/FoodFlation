import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { MouseEventHandler } from "react";

const ButtonOutlinedStyled = styled(Button)({
    border: "2px solid #9388A2",
    "&:hover": {
        backgroundColor: "rgb(147, 136, 162, 0.5)",
        border: "2px solid #9388A2",
        borderRadius: "3px",
        outline: "none",
    },
    "&:active": {
        boxShadow: "none",
        backgroundColor: "rgb(147, 136, 162, 0.5)",
        border: "2px solid #9388A2",
    },
});

type Props = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode;
};

const ButtonOutlined: React.FC<Props> = ({ onClick, children }) => {
    return (
        <ButtonOutlinedStyled variant="contained" onClick={onClick}>
            {children}
        </ButtonOutlinedStyled>
    );
};

export default ButtonOutlined;
