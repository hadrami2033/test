import React, { useState } from "react";
import {
  Button,
  Grid,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import { Form } from "../src/components/Form";
import Controls from "../src/components/controls/Controls";
import { useRouter } from "next/router";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import baseURL from "../src/utils/baseURL";


const UserForm = (props) => {
  const {showSuccessToast, showFailedToast} = props;
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  const roles = [
    {
      id:"Admin",
      label:"Admin"
    },
    {
      id:"User",
      label:"User"
    },
    {
      id:"Agent",
      label:"Agent"
    }
  ]
  const defaultValues = {
    username: "",
    password: "",
    password2: "",
    role: ""
  } 

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter()

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("username" in fieldValues)
      temp.username = fieldValues.username ? "" : "Utilisateur est réquis";
    if ("role" in fieldValues)
      temp.role = fieldValues.role ? "" : "Role est réquis";
    if ("password" in fieldValues)
      temp.password = fieldValues.password.toString().length > 2 ? "" : "Mot de passe est réquis";
    if ("password2" in fieldValues)
      temp.password2 = conform(values.password, fieldValues.password2) ? "" : "Confirmation non compatible avec le mot de passe";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  /* useEffect(() => {
    if(client !== null){
      console.log("element to edit => ",client);
      setFormValues(client)
    }
  }, [client]) */

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
  
  const conform = (p1, p2) =>{
    if(p1 === p2)
    return true
    else return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      setLoading(true)
      const response = await fetch(`${baseURL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      })
      if (response.status === 201) {
        resetForm();
        showSuccessToast()
        setLoading(false)
      }else{
        showFailedToast()
        setLoading(false)
      }
  };
};
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} lg={12} alignItems="center" justify="center">
        <BaseCard title="Nouveau utilisateur">
          <Stack style={styles.stack} spacing={2} direction="column">
            <Controls.Input
              id="name-input"
              name="username"
              label="Utilisateur"
              type="text"
              value={values.username}
              onChange={handleInputChange}
              error={errors.username}
            />
            <Controls.Select
              name="role"
              label="Role"
              value={values.role}
              onChange={handleInputChange}
              options={roles}
              error={errors.role}
            />
            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" >
                <InputLabel htmlFor="outlined-adornment-password">Mot de passe </InputLabel>
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
                    //error={errors.password}
                    {...(errors.password && {error:true,helperText:errors.password})}
                />

            </FormControl>
            {errors.password &&
              <Stack spacing={2} direction="row" style={{marginTop:5, marginInline:15, display:'flex'}}>
                <Box style={{fontSize:'12px', color:'crimson'}}> {errors.password} </Box>
              </Stack>
            }
            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined" >
                <InputLabel htmlFor="outlined-adornment-password">Confirmer le mot de passe </InputLabel>
                <OutlinedInput
                    id="password2"
                    type={showPassword2 ? 'text' : 'password'}
                    name="password2"
                    onChange={handleInputChange}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label=" Confirmer le mot de passe"
                    {...(errors.password2 && {error:true,helperText:errors.password2})}
                />
            </FormControl>
            {errors.password2 &&
              <Stack spacing={2} direction="row" style={{marginTop:5, marginInline:15, display:'flex'}}>
                <Box style={{fontSize:'12px', color:'crimson'}}> {errors.password2} </Box>
              </Stack>
            }
          </Stack>

          <br />
          <Stack>
          <Button
            type="submit"
            style={{ fontSize: "20px" }}
            variant="contained"
            disabled={loading}
            mt={4}
            fullWidth
          >
            Sauvegarder 
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

        </BaseCard>
      </Grid>
    </form>
  );
};

const styles = {
  stack: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
};
export default UserForm;
