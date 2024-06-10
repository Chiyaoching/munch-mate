import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import ButtonBase from "@mui/material/ButtonBase";

// project imports
import Logo from "ui-component/Logo";
import { MENU_OPEN } from "store/actions";
import { Avatar, Box } from "@mui/material";
import logo from "assets/images/logo.png";
// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar src={logo}></Avatar>
      {/* <Logo /> */}
      <Box sx={{ ml: 2 }}>Munch-mate</Box>
    </Box>
    // <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to='/'>
    // </ButtonBase>
  );
};

export default LogoSection;
