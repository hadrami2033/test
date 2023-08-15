import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value,error=null, onChange, type, id,style } = props;
    return (
        <TextField
            style={style}
            fullWidth={true}
            variant="outlined"
            label={label}
            name={name}
            value={value}
            type={type}
            id={id}
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}
