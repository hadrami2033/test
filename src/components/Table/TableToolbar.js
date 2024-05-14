import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, FormControl, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Tooltip } from '@mui/material';
import { CreateOutlined, InfoOutlined, Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const EnhancedTableToolbar = (props) => {
    const { onSearch, search, openModal, type="propriete", byLot, lot } = props;
  
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
          <Stack spacing={2} direction="row">
            {openModal && type=="propriete" &&
            <Tooltip title="Ajouter">
              <Fab color="secondary" size='medium' aria-label="Ajouter" onClick={openModal}>
                  <Add/>
              </Fab>
            </Tooltip>
            }
          </Stack>

      
            <Paper component="form" sx={{ p: '2px 4px', display:"flex", flexDirection:"row"}} >
                {type=="propriete" &&
                  <InputBase
                    sx={{ 
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      width:"200px",
                      mr: 5, 
                      borderRadius:2, 
                      ...({
                      bgcolor: (theme) =>
                        alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
                    }),
                    }}
                    placeholder="      Lot"
                    value={lot} 
                    onChange={byLot}
                  />
                }

                {type=="proprietaire" &&
                  <InputBase
                    sx={{ 
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      width:"200px",
                      mr: 5, 
                      borderRadius:2, 
                      ...({
                      bgcolor: (theme) =>
                        alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
                    }),
                    }}
                    placeholder="      Recherche"
                    value={search} 
                    onChange={onSearch}
                  />
                }    
                {type!="proprietaire" &&

                <FormControl style={{marginInline:15}} >
                  <InputLabel id="demo-simple-select-label">Filtrer ... </InputLabel>
                  {type=="propriete" &&
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={search}
                    label="Par zone"
                    onChange={onSearch}
                    style={{ width:200}}
                    sx={{
                      ...({
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
                      }),
                    }}
                  >
                    <MenuItem value={""}></MenuItem>
                    <MenuItem value={"Administrative"}>Administrative</MenuItem>
                    <MenuItem value={"Commerciale"}>Commerciale</MenuItem>
                    <MenuItem value={"Pêche"}>Pêche</MenuItem>
                    <MenuItem value={"Extension"}>Extension</MenuItem>
                  </Select>
                  }
                  {type=="proprietaire" &&
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={search}
                    label="Par zone"
                    onChange={onSearch}
                    style={{ width:200}}
                    sx={{
                      ...({
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
                      }),
                    }}
                  >
                    <MenuItem value={""}></MenuItem>
                    <MenuItem value={"Administrative"}>Administrative</MenuItem>
                    <MenuItem value={"Commerciale"}>Commerciale</MenuItem>
                    <MenuItem value={"Pêche"}>Pêche</MenuItem>
                    <MenuItem value={"Extension"}>Extension</MenuItem>
                  </Select>
                  }
                  {type=="local" &&
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={search}
                    label="Par zone"
                    onChange={onSearch}
                    style={{ width:200}}
                    sx={{
                      ...({
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
                      }),
                    }}
                  >
                  <MenuItem value={""}></MenuItem>
                  <MenuItem value={"Habitation"}>Habitation</MenuItem>
                  <MenuItem value={"Activité Commerçiale"}>Activité Commerçiale</MenuItem>
                  </Select>
                  }
                </FormControl>
                }
            </Paper> 
  
        
      </Toolbar>
    );
  };

  export default EnhancedTableToolbar;