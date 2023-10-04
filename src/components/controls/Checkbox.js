import { FormControl, FormControlLabel, FormHelperText, Checkbox as MuiCheckbox } from '@mui/material';
import React from 'react'
//import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';

export default function Checkbox(props) {

    const { name, label, value, error=null, onChange } = props;


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <FormControl style={{display:'flex', justifyContent:'center', alignItems:'center'}} >
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color="primary"
                    checked={value}
                    onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                    {...(error && {error:true,helperText:error})}
                />}
                label={label}
            />
        </FormControl>
    )
}
