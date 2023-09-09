import React from 'react'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import dayjs from 'dayjs';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, FormHelperText } from '@mui/material';

export default function DatePiccker(props) {

    const { name, label, value, onChange, error, style } = props


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }


/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker disableToolbar variant="inline" inputVariant="outlined"
                label={label}
                format="MMM/dd/yyyy"
                name={name}
                value={value}
                onChange={date =>onChange(convertToDefEventPara(name,date))}

            />
        </MuiPickersUtilsProvider> */


    return (
        <Box sx={style}>
        <LocalizationProvider  dateAdapter={AdapterDayjs} 

        >
            <DatePicker
                sx ={{width:'100%'}}
                name = {name}
                label={label}
                //value={value}
                onChange={(newValue) => onChange({ value : formatDate(newValue)  , name : name })}
                defaultValue={dayjs(value)}
            />
        </LocalizationProvider>
        {error && <FormHelperText style={{color:"crimson"}} >{error}</FormHelperText>} 

        </Box>
    )
}
