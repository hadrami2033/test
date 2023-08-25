import React from "react";
import FeatherIcon from "feather-icons-react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
// Dropdown Component
import SearchDD from "./SearchDD";
import ProfileDD from "./ProfileDD";

const Header = ({ sx, customClass, toggleMobileSidebar, position }) => {
  return (
    <AppBar sx={sx} position={position} elevation={0} className={customClass}>
      <Toolbar>
        
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <SearchDD /> */}
        {/* ------------ End Menu icon ------------- */}



        <Box flexGrow={1} >
           <Typography
              color={"primary"} //2596be

              fontSize="30px" fontWeight={'1000'} variant="h1"
              sx={{
                ml: 1,
              }}
              display={'flex'}
              justifyContent={'center'}
            >
              SOCIÉTÉ DE GESTION DE L'ENERGIE DE MANANTALI
            </Typography>
          </Box>

        {/* <Box style={{width:'50px'}} /> */}
        {/* <Box style={{width:'100px'}} /> */}
        

        <ProfileDD />
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  position: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
