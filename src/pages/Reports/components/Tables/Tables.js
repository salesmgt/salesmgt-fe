import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Chip,
  TableSortLabel,
  withStyles,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { MdFirstPage, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdLastPage } from 'react-icons/md';
import PropTypes from 'prop-types';
import classes from './Tables.module.scss';
import { useSchool } from '../../hooks/SchoolContext';
import MenuOptions from '../MenuOptions/MenuOptions';
import * as ReducerActions from '../../hooks/reducer-action-type';

// Customize component TablePagination
function TablePaginationActions(props) {
  const theme = useTheme();

  const { count, page, rowsPerPage, totalPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0); // firstPage has index = 0
    console.log('first page: count = ', count);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.ceil(count / rowsPerPage) - 1);
  };

  const handleBackPageButtonClick = (event) => {
    onChangePage(event, page - 1); // current page - 1
  };

  const handleNextPageButtonClick = (event) => {
    onChangePage(event, page + 1); // current page + 1
  };

  return (
    <div className={classes.paging}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <MdLastPage /> : <MdFirstPage />}
      </IconButton>
      <IconButton onClick={handleBackPageButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </IconButton>
      <span>{page + 1} / {totalPage}</span>
      <IconButton onClick={handleNextPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <MdFirstPage /> : <MdLastPage />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  totalPage: PropTypes.number.isRequired
};

function SortableTableHeaders(props) {
  const { columns, direction, column, onRequestSort } = props;
  const createSortHandler = (col, direction) => {
    onRequestSort(col, direction);
  };

  const MuiTableSortLabel = withStyles({
    root: {
      color: 'white !important',
      '&:hover': {
        color: 'white !important',
      },
      '&$active': {
        color: 'white !important',
      },
    },
    active: {},
    icon: {
      color: 'white !important',
    },
  })(TableSortLabel);

  return (
    <TableHead>
      <TableRow className={classes.tHead}>
        {columns.map((col) => (
          <TableCell key={col.key} className={classes.tHeadCell} sortDirection={column === col.key ? direction : false}>
            <MuiTableSortLabel active={column === col.key} direction={column === col.key ? direction : 'asc'}
              onClick={() => createSortHandler(col, direction)}>
              {col.name}
            </MuiTableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SortableTableHeaders.propTypes = {
  columns: PropTypes.array.isRequired,
  direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
  column: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

// Customize component Table
function Tables(props) {
  const { columns, rows, totalRecord, totalPage } = props;

  const {
    params, dispatchParams,
    limit, direction, column,
    setColumn, setLimit, setPage, setDirection
  } = useSchool();

  // ====================Paging====================
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatchParams({
      type: ReducerActions.CHANGE_PAGE,
      payload: {
        page: newPage,
        limit: params.limit
      }
    })
  };

  const handleChangeLimit = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
    dispatchParams({
      type: ReducerActions.CHANGE_PAGE,
      payload: {
        page: 0,
        limit: parseInt(event.target.value, 10)
      }
    })
  };

  const onSortBy = (col, direction) => {
    if (col.sortable) {
      setDirection(direction === 'desc' ? 'asc' : 'desc');
      setColumn(col.key);

      dispatchParams({
        type: ReducerActions.SORT_BY,
        payload: {
          column: col.key,
          direction: direction
        }
      })
    }
  }

  const setPurposeChipColor = (purpose) => {
    switch (purpose) {
      case 'Sales mới':
        return <Chip label={purpose} style={{ backgroundColor: '#f57c00', color: 'white' }} />;
      case 'Chăm sóc':
        return <Chip label={purpose} style={{ backgroundColor: '#4caf50', color: 'white' }} />;
      case 'Tái ký hợp đồng':
        return <Chip label={purpose} style={{ backgroundColor: '#1976d2', color: 'white' }} />;
      case 'Ký mới hợp đồng':
        return <Chip label={purpose} style={{ backgroundColor: '#6d33ff', color: 'white' }} />;
      default:
        // #5c21f3
        return <Chip label={purpose} />;
    }
  };

  const truncateString = (str) => {
    return str.length > 10 ? str.substring(0, 7) + "..." : str;
  }

  return (
    <div className={classes.wrapper}>
      <TableContainer className={classes.container} component='div'>
        <Table className={classes.table} stickyHeader size="small" aria-label="sticky table">
          <SortableTableHeaders columns={columns} direction={direction} column={column} onRequestSort={onSortBy} />
          <TableBody className={classes.tBody}>
            {rows?.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.id} className={classes.tBodyRow}>
                  <TableCell className={classes.tableCell} align="center">{params.page * params.limit + index + 1}</TableCell>
                  <TableCell className={classes.tBodyCell} style={{ fontSize: '1rem' }}>{row.date}</TableCell>
                  <TableCell className={classes.tBodyCell} style={{ fontSize: '1rem' }}>
                    <ListItemText
                      primary={`${row.educationalLevel} ${row.name}`}
                      secondary={row.district}
                    />
                  </TableCell>
                  <TableCell className={classes.tBodyCell}>
                    <ListItem style={{ padding: 0, margin: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={row.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        className={classes.picName}
                        primary={row.fullName}
                        primaryTypographyProps={{ style: { fontSize: '0.875rem' } }}
                        secondary={row.username}
                        secondaryTypographyProps={{ style: { fontSize: '0.8rem' } }}
                      />
                    </ListItem>
                  </TableCell>
                  <TableCell className={classes.tBodyCell}>
                    {setPurposeChipColor(row.purpose)}
                  </TableCell>
                  <TableCell className={classes.tBodyCell}>{row.result}</TableCell>
                  <TableCell className={classes.tBodyCell}>{truncateString(row.description)}</TableCell>
                  <TableCell className={classes.tBodyCell} align="right">
                    <MenuOptions id={row.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <i style={{ color: 'gray', fontSize: '1.3em' }}>No records found.</i>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalRecord ? totalRecord : 0}
        rowsPerPage={limit}
        page={params.page}
        SelectProps={{
          inputProps: {
            'aria-label': 'rows per page',
          },
          native: true,
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeLimit}
        ActionsComponent={() =>
          <TablePaginationActions
            count={totalRecord ? totalRecord : 0}
            page={params.page}
            rowsPerPage={params.limit}
            totalPage={totalPage}
            onChangePage={handleChangePage}
          />
        }
      />
    </div>
  );
}

export default React.memo(Tables);

Tables.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  totalRecord: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
};