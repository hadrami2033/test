import * as React from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { styled, Typography } from '@mui/material';

function EnhancedTableHead(props) {
    const {  order, orderBy, rowCount, onRequestSort, headCells, headerBG, txtColor } = props;
    const createSortHandler = (property) => (event) => {
      if(onRequestSort)
      onRequestSort(event, property);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }))
    //"#ecf0f2"
    return (
      <TableHead >
        <TableRow>
        <TableCell style={{backgroundColor:headerBG}} align="right"></TableCell>

          {headCells.map((headCell) => (
            <TableCell

              style={{backgroundColor:headerBG, paddingLeft:'15px'}}
              key={headCell.id}
              align='left'
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography variant="h4" color={txtColor}>
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  export default EnhancedTableHead