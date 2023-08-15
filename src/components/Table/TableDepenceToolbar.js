
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton, InputBase, MenuItem, Paper, Select, Stack, Tooltip } from '@mui/material';
import { Menu, Paid, Undo } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const EnhancedTableToolbar = (props) => {
    const { selected, field, editClick, onSearch, search, payed, goSearch, currentMonth, 
      selectMonth, months, cancelDepence } = props;
  
    console.log("all months in toolbar ", months);
    return (
      <Toolbar
        style={{display:"flex", 
        ...(selected !== null ? 
         {justifyContent: "space-between" }: 
         {justifyContent: "end" }
        ), 
        marginBottom:30}}
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(payed ? {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }:{
            bgcolor: (theme) =>
              alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {selected !== null ?
            <Stack spacing={2} direction="row">
                {!payed &&
                <Tooltip onClick={editClick} title="دفع">
                    <IconButton>
                        <Paid color='primary' fontSize='large' />
                    </IconButton>
                </Tooltip>
                }
                {payed &&
                <Tooltip onClick={cancelDepence} title="إلغاء الدفع">
                    <IconButton>
                      <Undo color='secondary' fontSize='large' />
                    </IconButton>
                </Tooltip>
                }
            </Stack>
          :
          <Stack spacing={2} direction="row" style={{width:'100%' }}>

            <Select
              id="page-size-select"
              value={currentMonth}
              onChange={selectMonth }
              label="pageSize"
              style={{fontSize:'24px', paddingInline: '10px', borderBottomWidth: 0}}
              variant ="standard"
            >
                {currentMonth &&
                  <MenuItem style={{fontSize:'24px', fontWeight:'bold'}} value={currentMonth}>
                    <em>{currentMonth.month}</em>
                  </MenuItem>
                }
                {
                  months.map(
                    month => <MenuItem style={{fontSize:'24px', fontWeight:'bold'}} value={month}>{month.month}</MenuItem>
                  )
                }
            </Select>
          </Stack>
        }

        {selected !== null ? (
          <Stack spacing={2} direction="row" style={{ width:"50%",display:'flex', 
          justifyContent:'space-between', alignItems:'center'}}>
            

         
            <Typography
              align="right"
              color="inherit"
              variant="subtitle1"
              component="div"
              fontSize={20}
              marginRight="30px"
            >
              {field}
            </Typography>
          </Stack>
        ) : 
        (
            <Paper
                slot='end'
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="بحث بالإسم أو الهاتف"
                    value={search}
                    onChange={onSearch}
                />
                <IconButton onClick={goSearch} type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
            </Paper>
        )}
  
        
      </Toolbar>
    );
  };

  export default EnhancedTableToolbar;