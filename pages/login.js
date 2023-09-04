import React, { useState } from "react";
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
import apiService from "../src/services/apiService";
import { Form } from "../src/components/Form";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import UserForm from "./user_form";
import { Close } from '@mui/icons-material';
import { useRouter } from "next/router";


const Login = () =>{

    const user = {
        phone: "",
        password: ""
      };
    
      const [formValues, setFormValues] = useState(user);
      const [loading, setLoading] = React.useState(false);
      const [showPassword, setShowPassword] = React.useState(false);
      const [invalid, setInvalid] = React.useState(false);
      const [openModal, setOpenModal] = React.useState(false);
      const [openFailedToast, setOpenFailedToast] = React.useState(false);
      const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
      const [users, setUsers] = React.useState([]);
      const router = useRouter()

      const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("phone" in fieldValues)
          temp.phone = /^[234][\d]{7}$/.test(fieldValues.phone)
            ? ""
            : "الرقم غير صحيح";
        if ("password" in fieldValues)
          temp.password = fieldValues.password.toString().length > 2 ? "" : " الرجاء إدخال كلمة مرور";
        setErrors({
          ...temp,
        });
    
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
      };
        
      const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);

      const handleSubmit = (event) => {
       // event.preventDefault();
        setLoading(true);
        apiService.login(values.phone, values.password).then(
              (res) => {
                console.log("added => ", res);
                if (res.data) {
                  //save to storage
                  localStorage.setItem('user', res.data.name)
                  localStorage.setItem('phone', res.data.phone)
                  localStorage.setItem('password', res.data.password)
                  //navigate to home
                  router.push('/')
                } else {
                  setInvalid(true);
                }
              },
              (error) => {
                console.log(error);
                setInvalid(true);
              }
            )
            .then(() => {
              setLoading(false);
            });
      };

      const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
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

      React.useEffect(() => {
        apiService.getUsers().then(
            (res) => {
              console.log("res => ", res.data);
              setUsers(res.data)
            },
            (error) => {
              console.log(error);
            }
        )
      }, [])

    return (
    <Container>

      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openSuccessToast} autoHideDuration={6000} onClose={closeSuccessToast}>
        <Alert onClose={closeSuccessToast} severity="success" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          تمت العملية بنجاح 
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedToast} autoHideDuration={6000} onClose={closeFailedToast}>
        <Alert onClose={closeFailedToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          واجهتك مشكلة ,العملية لم تتم
        </Alert>
      </Snackbar>
      
      <Dialog open={openModal} onClose={handleCloseModal}>
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
                backgroundColor:'#03c9d7',
                }} >
        <BaseCard title=" تسجيل الدخول">
        <Stack style={{...styles.stack, marginBottom:30 }}  spacing={10} direction="row">
                <img src='/static/images/users/8.jpg' alt="" />         

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
              id="phone"
              label="الهاتف"
              name="phone"  
              type="number"
              variant="outlined"
              onChange={handleInputChange}
            />

            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" >
                <InputLabel htmlFor="outlined-adornment-password">كلمة المرور</InputLabel>
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
                    label="كلمة المرور"
                />
            </FormControl>

            
            {/* <Controls.Input
              id="phone-input"
              name="phone"
              label="الهاتف"
              type="number"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />

            <Controls.Input
              id="price-input"
              name="password"
              label=" كلمة المرور"
              type="password"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
            /> */}
          </Stack>


            
          <Stack >
            <Button
                onClick={handleSubmit}
                style={{ fontSize: "20px" }}
                variant="contained"
                disabled={loading || !values.phone || !values.password }
                mt={4}
                fullWidth
            >
             تسجيل الدخول
                {loading && (
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
            <Box style={{fontSize:'20px', color:'red'}} color="danger"> خطأ في الهاتف أو كلمة المرور </Box>
          </Stack>
          }
          {users.length === 0 &&
          <Stack spacing={2} direction="row" style={{marginTop:10}}>
            <Button style={{fontSize:'20px'}} color="primary" onClick={handleOpenModal} >إنشاء حساب</Button>
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