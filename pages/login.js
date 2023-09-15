import React, { useState, useContext} from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress,
  Container,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Dialog,
  Snackbar,
  Alert,
  DialogContent
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard"
import { Form } from "../src/components/Form";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import UserForm from "./user_form";
import { Close } from '@mui/icons-material';
import { useRouter } from "next/router";
import AuthContext from "../src/context/AuthContext";
import baseURL from "../src/utils/baseURL";

const Login = () =>{
    const defaultUser = {
      username: "Binor",
      password: "ronib2023",
      password2: "ronib2023",
      role: "Admin",
      is_active: 1,
    }
    const user = {
      username: "",
      password: ""
    };
    const { loginUser, invalid, loging } = useContext(AuthContext);
    const [formValues, setFormValues] = useState(user);
    const [showPassword, setShowPassword] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [openFailedToast, setOpenFailedToast] = React.useState(false);
    const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const router = useRouter()
    const validate = (fieldValues = values) => {
      let temp = { ...errors };
      if ("username" in fieldValues)
        temp.username = fieldValues.username ? "" : "Utilisateur est réquis";
      if ("password" in fieldValues)
        temp.password = fieldValues.password.toString().length > 2 ? "" : "Mot de passe est réquis";
      setErrors({
        ...temp,
      });
  
      if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    };
      
    const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    const handleSubmit = async (event) => {
     // event.preventDefault();
      let res = await loginUser(values)
      
      /* .then(
        (res) => {
          if (res === true) { */
            //console.log("login res ", res);
            //save to storage
            //navigate to home
            //router.push('/')
         /*  } else {
            console.log("login res ",res);
            setInvalid(true);
          }
        },
      ).then(() => {
        setLoading(false);
      }); */
    };
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    const handleOpenModal = () => {
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
    React.useEffect( async () => {
      const ronib = await fetch(`${baseURL}/profile/Binor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (ronib.status != 200) {
        const response = await fetch(`${baseURL}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(defaultUser)
        })
        if (response.status === 201) 
        console.log("default user has been created");
      }

    }, [])

    return (
    <Container>

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

      <form style={{height:'100vh' , display:'flex', justifyContent:'center', alignItems:'center'}} >
      <Grid item xs={12} lg={12} alignItems="center" justify="center" 
            style={{
                maxWidth:500, 
                borderRadius:20,
                backgroundColor:'#90d791',
                }} >
        <BaseCard title="Authentification" titleColor={"secondary"}>
        <Stack style={{...styles.stack, marginBottom:30 }}  spacing={10} direction="row">
                <img src='/static/images/SOGEM.jpg' alt="" />         

          {/* <Image
            src={userimg}
            alt={userimg}
            className="roundedCircle"
            fill
            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
          ></Image>  */}
          
         {/*  <img 
          loader={imageLoader}
          src= {require('../assets/images/users/8.jpg')}
          /> */}
 
        </Stack> 


        <Stack spacing={2} direction="column" style={{marginBottom:20}}>
            <TextField
              id="username"
              label="Utilisateur"
              name="username"
              variant="outlined"
              onChange={handleInputChange}
            />
            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" >
                <InputLabel htmlFor="outlined-adornment-password"> Mot de passe</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleInputChange}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Mot de passe"
                />
            </FormControl>
          </Stack>
          <Stack >
            <Button
                onClick={handleSubmit}
                style={{ fontSize: "20px" }}
                variant="contained"
                disabled={loging || !values.username || !values.password }
                mt={4}
                fullWidth
            >
              CONNEXION
                {loging && (
                <CircularProgress
                size={24}
                sx={{
                    color: 'primary',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                }}
                />
            )}
            </Button>
          </Stack>
          {invalid &&
          <Stack spacing={2} direction="row" style={{marginTop:15, marginBottom:5, display:'flex', justifyContent:'center'}}>
            <Box style={{fontSize:'20px', color:'red'}} color="danger"> Authentification invalide </Box>
          </Stack>
          }
          {users.length === 0 &&
          <Stack spacing={2} direction="row" style={{marginTop:10}}>
            <Button style={{fontSize:'20px'}} color="primary" onClick={handleOpenModal} > Inscription </Button>
          </Stack>
          }
        </BaseCard>
      </Grid>
    </form>

    </Container>
    )
}

 

const styles = {
    stack: {
      display: "flex",
      justifyContent:'center',
      marginBottom: 10,
    },
};


//<Image
//src='/static/images/users/8.jpg'
//placeholder="blur"
//alt=""
//width="200"
//height="150"
//className="roundedCircle"
//unoptimized
///>


export default Login;