import React, { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import apiService from "../src/services/apiService";
import { Form } from "../src/components/Form";
import Controls from "../src/components/controls/Controls";
import { useRouter } from "next/router";


const UserForm = (props) => {
  const {showSuccessToast, showFailedToast} = props;

  const defaultValues = {
    name: "",
    phone: "",
    password: "",
  } 

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter()

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "الإسم مطلوب";
    /* if ('nni' in fieldValues)
        temp.nni = fieldValues.nni.length !== 10 ? "" : "عشر أرقام " */
    //temp.nni = (/$^|.+@.+..+/).test(fieldValues.nni) ? "" : "nni is not valid."
    if ("phone" in fieldValues)
      temp.phone = /^[234][\d]{7}$/.test(fieldValues.phone)
        ? ""
        : "الرقم غير صحيح";
    if ("password" in fieldValues)
      temp.password =
        fieldValues.password.toString().length > 2 ? "" : " الرجاء إدخال كلمة السر";
    /* if ('departmentId' in fieldValues)
        temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required." */
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
    

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setLoading(true)
      console.log(values);

      apiService.newUser(values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
              resetForm();
              showSuccessToast()
              //save to storage
              if(!localStorage.getItem('user')){
                localStorage.setItem('user', res.data.name)
                localStorage.setItem('phone', res.data.phone)
                localStorage.setItem('password', res.data.password)
                //navigate to home
                router.push('/')                
              }

            }else{
              showFailedToast()
            }
          },
          (error) => {
            console.log(error);
            showFailedToast()
          } 
        ).then(() => {
          setLoading(false)
        });
      
    }
    //console.log(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} lg={12} alignItems="center" justify="center">
        <BaseCard title=" إنشاء حساب">
          <Stack style={styles.stack} spacing={10} direction="row">
            <Controls.Input
              id="name-input"
              name="name"
              label="الإسم"
              type="text"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              id="phone-input"
              name="phone"
              label="الهاتف"
              type="number"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
          </Stack>
          <br />

          <Stack style={styles.stack} spacing={10} direction="row">
            <Controls.Input
              id="password-input"
              name="password"
              label="كلمة السر "
              type="text"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
            />
          </Stack>

          <br />
          <Button
            type="submit"
            style={{ fontSize: "25px" }}
            variant="contained"
            disabled={loading}
            mt={4}
          >
            حفظ 
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
