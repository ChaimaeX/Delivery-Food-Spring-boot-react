import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Users from '../Users/Users';
import Restaurants from '../Restaurants/Restaurants';
import Orders from '../Orders/Orders';
import ViewListIcon from '@mui/icons-material/ViewList';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUser, logout } from '../../component/State/Authentication/Action';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  switch (pathname) {
    case '/users':
      return <Users />;
    case '/restaurants':
      return <Restaurants />;
    case '/orders':
      return <Orders />;
    default:
      return (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Welcome to the Dashboard</Typography>
        </Box>
      );
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Dashboard(props) {
  const { window } = props;
  const [searchQuery, setSearchQuery] = React.useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const router = useDemoRouter('/'); // Initialisez router ici
  const {auth} = useSelector((store)=>store);
  const jwt = localStorage.getItem("jwt") || auth.jwt;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  //gestion de authorize
  useEffect(()=>{
    dispatch(getUser({jwt}));
    if (auth.user?.role != "ROLE_ADMIN") {
      navigate("/unauthorized")
    }
  },[dispatch,jwt])

  // Gestion de la déconnexion
  useEffect(() => {
    if (router && router.pathname === '/logout') { // Vérifiez que router est défini
      dispatch(logout());
      navigate('/');
    }
  }, [router, dispatch, navigate]); // Ajoutez router comme dépendance

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={[
        {
          segment: 'users',
          title: 'Users',
          icon: <PeopleAltIcon />,
          href: '/users',
        },
        {
          segment: 'restaurants',
          title: 'Restaurants',
          icon: <RestaurantIcon />,
          href: '/restaurants',
        },
        {
          segment: 'orders',
          title: 'Orders',
          icon: <ShoppingCartIcon />,
          href: '/orders',
        },
        {
          segment: 'logout',
          title: 'Logout',
          icon: <LogoutIcon />,
          href: '/logout',
        },
      ]}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout title="Dashboard">
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Dashboard;