"use client";

// import { styled } from "@mui/material/styles";
// import Button from "@mui/material/Button";
import { MouseEventHandler } from "react";

// const ButtonContainedStyles = styled(Button)({
//   backgroundColor: "#9388A2",
//   border: "none",
//   "&:hover": {
//     backgroundColor: "#9388A2",
//     borderColor: "#9388A2",
//     boxShadow: "none",
//   },
//   "&:active": {
//     boxShadow: "none",
//     backgroundColor: "#9388A2",
//     borderColor: "#9388A2",
//   },
// });

type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const ButtonContained: React.FC<Props> = ({
  onClick,
  className,
  children,
  disabled = false,
}) => {
  return (
    // <ButtonContainedStyles
    //   className={className}
    //   onClick={onClick}
    //   variant="contained"
    //   disabled={disabled}
    // >
    //   {children}
    // </ButtonContainedStyles>
    <div></div>
  );
};

export default ButtonContained;
