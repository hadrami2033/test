import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, IconButton, InputBase, Paper, Stack, Tooltip } from '@mui/material';
import { CreateOutlined, InfoOutlined, Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const EnhancedTableToolbar = (props) => {
    const { detail, selected, field, editClick, deleteClick, onSearch, search, openModal, goSearch } = props;
  
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
        {selected ? (
            <Stack spacing={2} direction="row">
                <Tooltip onClick={deleteClick} title="Supprimer">
                    <IconButton>
                        <DeleteIcon color='danger' fontSize='large'/>
                    </IconButton>
                </Tooltip>
                {editClick &&
                <Tooltip onClick={editClick} title="Modifier">
                    <IconButton>
                        <CreateOutlined fontSize='large' />
                    </IconButton>
                </Tooltip>
                }
                {detail &&
                <Tooltip onClick={detail} title="Detail">
                    <IconButton>
                        <InfoOutlined color='primary' fontSize='large' />
                    </IconButton>
                </Tooltip>
                }
            </Stack>

        ) : (
          <Stack spacing={2} direction="row">
            {openModal &&
            <Tooltip title="Ajouter">
              <Fab color="secondary" aria-label="Ajouter" onClick={openModal}>
                  <Add/>
              </Fab>
            </Tooltip>
            }
          </Stack>
        )}

        {selected !== null ? (
          <Stack spacing={2} direction="row" style={{ width:"50%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>
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
          onSearch ? 
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Chercher ..."
                    value={search}
                    onChange={onSearch}
                />
                <IconButton onClick={goSearch} type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper> : null
        )}
  
        
      </Toolbar>
    );
  };

  export default EnhancedTableToolbar;