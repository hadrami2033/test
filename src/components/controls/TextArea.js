import React from 'react'
import { TextField } from '@mui/material';

export default function TextArea(props) {

    const { name, label, value,error=null, onChange, type, id,style } = props;
    return (
        <TextField
            style={style}
            fullWidth={true}
            variant="outlined"
            label={label}
            multiline
            rows={4}
            name={name}
            value={value}
            type={type}
            id={id}
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}
