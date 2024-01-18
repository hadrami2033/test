import React from 'react'
import { TextField } from '@mui/material';

export default function Input(props) {

    const { name, label, value,error=null, onChange, type, id,style, disabled = false , size = null } = props;
    return (
        <TextField
            style={style}
            fullWidth={true}
            variant="outlined"
            label={label}
            size={size}
            name={name}
            value={value}
            type={type}
            id={id}
            disabled = {disabled}
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}
