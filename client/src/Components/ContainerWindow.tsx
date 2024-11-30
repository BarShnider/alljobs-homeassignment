import { ReactNode } from "react";
import { useAppContext } from "../Contexts/AppContext";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
interface ContainerWindowProps {
  children: ReactNode;
  containerClassName?: string; // Optional
  wrapperClassName?: string; // Optional
}

export default function ContainerWindow({
  children,
  containerClassName,
  wrapperClassName,
}: ContainerWindowProps) {
  const { isLoading, isDarkMode, toggleDarkMode } = useAppContext();
  return (
    <div className={`container ${containerClassName}`}>
      <div
        className={`wrapper ${wrapperClassName}`}
        style={{ alignItems: isLoading ? "center" : "start" }}
      >
        <FormControlLabel
          className="MuiFormControlLabel-root"
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              color="secondary"
            />
          }
          label={isDarkMode ? "Dark" : "Light"}
          labelPlacement={"start"}
        />

        {isLoading ? <CircularProgress size={"75px"} /> : children}
      </div>
    </div>
  );
}
