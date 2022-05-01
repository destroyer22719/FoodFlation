import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const ButtonContained = styled(Button)({
    backgroundColor: "#9388A2",
    border: "none",
    width: "100%",
    height: "100%",
    "&:hover": {
        backgroundColor: "#9388A2",
        borderColor: "#9388A2",
        boxShadow: "none",
    },
    "&:active": {
        boxShadow: "none",
        backgroundColor: "#9388A2",
        borderColor: "#9388A2",
    },
    "&:focus": {
        // boxShadow: "0 0 0 0.2rem #9388A2",
    },
});

export const ButtonOutlined = styled(Button)({
    border: "2px solid #9388A2",
    "&:hover": {
        backgroundColor: "rgb(147, 136, 162, 0.5)",
        border: "2px solid #9388A2",
        borderRadius: "3px",
        outline: "none"
    },
    "&:active": {
        boxShadow: "none",
        backgroundColor: "rgb(147, 136, 162, 0.5)",
        border: "2px solid #9388A2",
    },
});
