import React from "react";
import FeatherIcon from "feather-icons-react";
import {
  Box,
  Menu,
  Typography,
  ListItemButton,
  List,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
  Snackbar,
  Alert
} from "@mui/material";
import { Close } from "@material-ui/icons";
import UserForm from "../../../pages/user_form";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ProfileDD = () => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const router = useRouter()
  const { authTokens, logoutUser } = useContext(AuthContext);
  const user = authTokens ? jwt_decode(authTokens.access) : {};

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const handleOpenModal = () => {
    console.log('open modal');
    setOpenModal(true)
  };

  const handleCloseModal = (event, reason) => {
    if (reason === "backdropClick") {
        console.log(reason);
    } else {
        setOpenModal(false)
    }
  };

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

  const closeFailedToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFailedToast(false);
  };

  const closeSuccessToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessToast(false);
  };

  return (
    <>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openSuccessToast} autoHideDuration={6000} onClose={closeSuccessToast}>
        <Alert onClose={closeSuccessToast} severity="success" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          L'oppération a été effectué avec succée
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedToast} autoHideDuration={6000} onClose={closeFailedToast}>
        <Alert onClose={closeFailedToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          Vous avez rencontré un probléme !
        </Alert>
      </Snackbar>
      <Dialog fullWidth={true} open={openModal} onClose={handleCloseModal}>
        <DialogContent>
          <div style={{display:"flex", justifyContent:"end"}}>
            <IconButton onClick={handleCloseModal}>
              <Close fontSize='large'/>
            </IconButton>
          </div>
          <UserForm
            showSuccessToast={showSuccessToast}
            showFailedToast={showFailedToast}
          />
        </DialogContent>
      </Dialog>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <img src='/static/images/users/3.jpg' alt="" width="30" height="30" />
    
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {user.username}
            </Typography>
            <FeatherIcon icon="chevron-down" width="20" height="20" />
          </Box>
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        sx={{
          "& .MuiMenu-paper": {
            width: "385px",
          },
        }}
      >
        <Box>
        {/*           <Box p={2} pt={0}>
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              onClick={handleClose4}
            >
              <ListItemButton onClick={handleOpenModal} >
                <Button fullWidth variant="contained" color="grey" style={{fontSize:"22px"}}>
                  Ajouter un utilisateur
                </Button>
              </ListItemButton>
            </List>
          </Box> */}
          {/* <Divider /> */}
          <Box p={2}>
              <Button onClick={logoutUser} fullWidth variant="contained" color="secondary" style={{fontSize:"20px"}}>
                Déconnecter
              </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

//<Image
//src='/static/images/users/8.jpg'
//placeholder="blur"
//alt=""
//width="30"
//height="30"
//className="roundedCircle"
//unoptimized
///>


export default ProfileDD;
