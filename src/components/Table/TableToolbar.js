import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, IconButton, InputBase, Paper, Stack, Tooltip, CircularProgress,  MenuItem, Select, Button, } from '@mui/material';
import { CreateOutlined, FileDownloadOutlined, Menu, PersonAdd, Save } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { SheetJSFT } from '../../lib/types';
import { Box } from '@material-ui/core';

const EnhancedTableToolbar = (props) => {
    const { selected, field, editClick, deleteClick, onSearch, search, openModal, goSearch, showMnthsNoPaids
    } = props;
  
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
        {selected !== null ? (
            <Stack spacing={2} direction="row">
                {!selected.deleted &&
                <Tooltip onClick={deleteClick} title="حذف">
                    <IconButton>
                        <DeleteIcon color='danger' fontSize='large'/>
                    </IconButton>
                </Tooltip>
                }
                {!selected.deleted &&
                <Tooltip onClick={editClick} title="تغيير">
                    <IconButton>
                        <CreateOutlined fontSize='large' />
                    </IconButton>
                </Tooltip>
                }
                {showMnthsNoPaids &&
                <Button onClick={showMnthsNoPaids} title={"أشهر لم يدفعها " + field}>
                    أشهر لم يدفعها الزبون
                </Button>
                }
            </Stack>

        ) : (
          <Stack spacing={2} direction="row">
            <Tooltip title="إضافة">
              <Fab color="primary" aria-label="إضافة" onClick={openModal}>
                  <PersonAdd/>
              </Fab>
            </Tooltip>
          
            
       
          </Stack>
        )}

        {selected === null &&
        (
            <Paper
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