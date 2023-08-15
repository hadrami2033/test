import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, CircularProgress, Fab, IconButton, InputBase, Paper, Stack, Tooltip, MenuItem, Select,  } from '@mui/material';
import { FileDownloadOutlined, Save, PlusOne } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { SheetJSFT } from '../../lib/types';

const EnhancedTableToolbar = (props) => {
    const { selected, deleteClick, onSearch, search, openModal, goSearch } = props;
  
    return (
      <Toolbar
        style={{display:"flex", justifyContent: "space-between", marginBottom:30}}
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...({
            bgcolor: (theme) =>
              alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
          }),
        }}
      >
        {selected.length > 0 ? (
            <Stack spacing={2} direction="row">
              {deleteClick && 
                <Tooltip onClick={deleteClick} title="حذف">
                    <IconButton>
                        <DeleteIcon color='danger' fontSize='large'/>
                    </IconButton>
                </Tooltip>
              }
            </Stack>
        ) : (
            <Stack spacing={2} direction="row">
                {openModal &&
                <Tooltip onClick={openModal} title="إضافة">
                   <Fab color="primary" aria-label="add">
                        <PlusOne/>
                    </Fab>
                </Tooltip>
                }
                
            </Stack>
        )}

        {selected.length > 0 ? (
          <Typography
            align="right"
            color="inherit"
            variant="subtitle1"
            component="div"
            fontSize={20}
            marginRight="30px"
          >
            {selected.length}
          </Typography>
        ) : 
        (
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
                >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="... بحث"
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