import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';

export default function Select(props) {

    const { name, label, value,error=null, onChange, options, style } = props;
    return (
        <FormControl variant="outlined"
        {...(error && {error:true})}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                style={style}
                label={label}
                name={name}
                value={value}
                onChange={onChange}>
                <MenuItem value=""></MenuItem>
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id} >{item.label}</MenuItem>)
                    )
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
