import React from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Link,
  Button,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
import { useRouter } from "next/router";
import Diversity2Icon from '@mui/icons-material/Diversity2';
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) => {
  const [open, setOpen] = React.useState(true);
  const [openSubItems, setOpenSubItems] = React.useState(false);
  const [indexOpen, setIndexOpen] = React.useState(0);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    console.log(index);
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  const handleOpenSubItems = (index) => {
    setOpenSubItems(!openSubItems)
    setIndexOpen(index)
  }


  let curl = useRouter();
  const location = curl.pathname;

  const SidebarContent = (
    <Box p={2} height="100%">
      <LogoIcon />
      <Box mt={2}>
        <List>
          {Menuitems.map((item, index) => (
            <List component="li" disablePadding key={item.title}>
              {!item.items ?
              <NextLink href={item.href}>
                <ListItem
                  onClick={() => handleClick(index)}
                  button
                  selected={location === item.href}
                  sx={{
                    mb: 1,
                    ...(location === item.href && {
                      color: "white",
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main}!important`,
                    }),
                  }}
                >

                  <ListItemIcon>
                    {item.href == "/commitments" ?
                      <Diversity2Icon 
                        fontSize='medium'
                        color="white"
                      />
                      :
                      <FeatherIcon
                        style={{
                          color: `${location === item.href ? "white" : ""} `,
                        }}
                        icon={item.icon}
                      />
                    }
                  </ListItemIcon>

                  <ListItemText>
                      {item.title}
                  </ListItemText>
                </ListItem>
              </NextLink>
              :
              <>
                <ListItem
                  onClick={() => handleOpenSubItems(index)}
                  button
                  selected={location === item.href}
                  sx={{
                    mb: 1,
                    ...(location === item.href && {
                      color: "white",
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main}!important`,
                    }),
                  }}
                >
                  <ListItemIcon>
                      <FeatherIcon
                        style={{
                          color: `${location === item.href ? "white" : ""} `,
                        }}
                        icon={item.icon}
                      />
                  </ListItemIcon>

                  <ListItemText>
                      {item.title}
                  </ListItemText>
                  { openSubItems ? <ExpandLess/> : <ExpandMore/> }
                </ListItem>
                { (openSubItems && indexOpen === index) && item.items.map((subitem, subindex) => (
                    <NextLink href={subitem.href}>
                      <ListItem
                        onClick={() => handleClick(subindex)}
                        button
                        selected={location === subitem.href}
                        sx={{
                          ml:3,
                          ...(location === subitem.href && {
                            color: "white",
                            backgroundColor: (theme) =>
                              `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemText sx={{ fontSize: "14px" }} disableTypography >
                         {subitem.title}
                        </ListItemText>
                      </ListItem>
                    </NextLink>
                ))

                }
              </>
              }
            </List>
          ))}
        </List>
      </Box>
    </Box>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: "265px",
            border: "0 !important",
            boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: "265px",
          border: "0 !important",
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
