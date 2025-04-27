import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardHeader, 
  Chip, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Alert,
  CircularProgress,
  TableSortLabel
} from '@mui/material';
import { Create, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  deleteFoodAction, 
  getMenuItemsByResturantId, 
  updateMenuItemsAvailability 
} from '../../component/State/Menu/Action';

const MenuTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [updateStock, setUpdateStock] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const jwt = localStorage.getItem("jwt");
  const { restaurant, menu } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    dispatch(getMenuItemsByResturantId({
      restaurantId: restaurant.usersRestaurant.id,
      jwt,
      vegetarian: false,
      seasonal: false,
      nonveg: false,
      foodCategory: ""
    })).finally(() => setLoading(false));
    setUpdateStock(false);
  }, [dispatch, jwt, restaurant.usersRestaurant.id,updateStock]);


  const handleDeleteFood = (foodId) => {
    setError(null);
    dispatch(deleteFoodAction(foodId, jwt))
      .catch(err => setError("Failed to delete item. Please try again."));
  };

  const handleUpdateStock = (foodId) => {
    dispatch(updateMenuItemsAvailability({ foodId, jwt }))
      .catch(err => setError("Failed to update availability."));
    setUpdateStock(true);
  };

  const handleDeleteClick = (foodId) => {
    setItemToDelete(foodId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteFood(itemToDelete);
    setOpenDeleteDialog(false);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedItems = useMemo(() => {
    return [...menu.menuItems].sort((a, b) => {
      const compare = (a, b) => {
        if (a[orderBy] < b[orderBy]) return -1;
        if (a[orderBy] > b[orderBy]) return 1;
        return 0;
      };
      return order === 'asc' ? compare(a, b) : -compare(a, b);
    });
  }, [menu.menuItems, orderBy, order]);

  const paginatedItems = useMemo(() => {
    return sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedItems, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card className='mt-1'>
        <CardHeader
          action={
            <IconButton 
              onClick={() => navigate("/admin/restaurant/add-menu")} 
              aria-label="add menu item"
              color="primary"
            >
              <Create />
              <Box ml={1}>Add Item</Box>
            </IconButton>
          }
          title="Menu Items"
          sx={{ pt: 2, alignItems: 'center' }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, mx: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="menu table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {orderBy === 'name' ? (
                      <Box component="span">
                        {order === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Ingredients</TableCell>
                <TableCell align="right" sortDirection={orderBy === 'price' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'price'}
                    direction={orderBy === 'price' ? order : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Price
                    {orderBy === 'price' ? (
                      <Box component="span">
                        {order === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No menu items found. Add your first item!
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
                  <TableRow 
                    key={item.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar 
                        src={item.images[0]} 
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {item.integredients?.map((ingredient, index) => (
                          <Chip 
                            key={index} 
                            label={ingredient.name} 
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{item.price} DH</TableCell>
                    <TableCell align="center">
                      <Button 
                        onClick={() => handleUpdateStock(item.id)}
                        color={item.available ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      >
                        {item.available ? "In Stock" : "Out of Stock"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(item.id)}
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination would go here */}
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this menu item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuTable;