import React, { useEffect, useState, useRef } from 'react';
import { 
  Avatar, 
  Badge, 
  Box, 
  IconButton, 
  List, 
  ListItem, 
  Paper, 
  CircularProgress,
  Snackbar,
  Alert 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMenus } from '../State/Menu/Action';

export const Navbar = () => {
  const { auth, cart, menu } = useSelector(store => store);
  const [input, setInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt") || auth.jwt;
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        await dispatch(getAllMenus({ jwt }));
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenus();
  }, [dispatch, jwt]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAvatarClick = () => {
    if (!auth.user) {
      navigate("/account/login");
      return;
    }
    
    const roleRoutes = {
      "ROLE_CUSTOMER": "/my-profile",
      "ROLE_RESTAURANT_OWNER": "/admin/restaurant",
      "ROLE_ADMIN": "/admin",
      "ROLE_LIVREUR":"/delivery"
    };
    
    navigate(roleRoutes[auth.user.role] || "/");
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setInput(searchTerm);
    
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = menu.menus?.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    ) || [];
    
    setSearchResults(results);
  };

  const handleResultClick = (item) => {
    if (!item.restaurant) return;
    if(item.restaurant.open) {
      navigate(`/restaurant/${item.restaurant.address.city}/${item.restaurant.name}/${item.restaurant.id}#food-${item.id}`);
    } else {
      setSnackbarMessage(`Le restaurant ${item.restaurant.name} est actuellement fermé.`);
      setSnackbarOpen(true);
    }
    
    setInput('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <Box className="px-5 sticky top-0 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between items-center">
      {/* Logo Section */}
      <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
        <li 
          onClick={() => navigate("/")} 
          className="logo font-serif text-gray-300 text-2xl list-none"
          aria-label="Home"
          role="link"
        >
          {isMobile ? "D-Food" : "Delivery Food"}
        </li>
      </div>

      {/* Search and User Section */}
      <div className="flex items-center space-x-2 lg:space-x-10">
        <div className="relative" ref={searchRef}>
          <div className='search'>
            <input
              placeholder="Search…"
              value={input}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              aria-label="Search for food items"
              aria-expanded={isSearchFocused && searchResults.length > 0}
              className={`search-Input text-sm lg:text-base ${isMobile ? 'py-1 px-2' : 'py-2 px-3'}`}
            />
            <IconButton aria-label="search" disabled={isLoading}
              sx={{ 
              padding: { xs: '4px', sm: '8px' },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1rem', sm: '1.5rem' }
              }
             }}
            >
              {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </div>

          {isSearchFocused && (
               <Paper className="absolute top-full left-0 w-full mt-1 max-h-60 overflow-auto z-50 ">
                 <List>
                   {isLoading ? (
                     <ListItem>
                       <CircularProgress size={20} />
                       <span className="ml-2">Recherche en cours...</span>
                     </ListItem>
                   ) : searchResults.length > 0 ? (
                     searchResults.map(item => (
                       <ListItem button key={item.id} onClick={() => handleResultClick(item)} className='cursor-pointer'>
                         {item.name}, {item?.restaurant?.name}
                       </ListItem>
                     ))
                   ) : input.trim() !== '' ? (
                     <ListItem disabled className="text-gray-500 italic">
                       Aucun élément trouvé pour "{input}"
                     </ListItem>
                   ) : (
                     <ListItem disabled className="text-gray-500 italic">
                       Entrez votre recherche...
                     </ListItem>
                   )}
                 </List>
               </Paper>
             )}
        </div>

        {/* User Avatar */}
        <div>
          {auth.user ? (
             <Avatar 
             onClick={handleAvatarClick}
             sx={{ 
               bgcolor: 'white', 
               color: pink.A400, 
               cursor: 'pointer',
               width: { xs: 24, sm: 32 }, // Taille responsive
               height: { xs: 24, sm: 32 },
               fontSize: { xs: '0.8rem', sm: '1rem' }
             }}
            >
              {auth.user?.fullName[0]?.toUpperCase()}
            </Avatar>
          ) : (
            <IconButton 
              onClick={() => navigate("/account/login")}
              aria-label="Login"
              sx={{ 
                padding: { xs: '4px', sm: '8px' }, // Réduction sur mobile
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1rem', sm: '1.5rem' } // Taille icône
                }
              }}
            >
              <PersonIcon />
            </IconButton>
          )}
        </div>

        {/* Cart */}
        {/* Cart */}
        <div className='relative'>
          <IconButton 
            onClick={() => navigate("/Cart")}
            aria-label={`Shopping cart with ${cart.cartItems?.length || 0} items`}
            sx={{ 
              padding: { xs: '4px', sm: '8px' },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.2rem', sm: '1.5rem' }  // Ajustement icône
              }
            }}
          >
            <Badge 
              color='primary' 
              badgeContent={cart.cartItems?.length || 0}
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: { xs: '0.6rem', sm: '0.75rem' },
                  height: { xs: 16, sm: 20 },
                  minWidth: { xs: 16, sm: 20 },
                  top: 2,
                  right: { xs: 2, sm: 5 },
                  padding: { xs: '0 2px', sm: '0 4px' }
                }
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </div>
      </div>

      {/* Snackbar pour afficher les messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};