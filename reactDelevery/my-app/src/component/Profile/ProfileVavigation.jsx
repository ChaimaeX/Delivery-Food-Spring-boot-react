import React, { use, useEffect, useState } from 'react';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TodayIcon from '@mui/icons-material/Today';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../State/Authentication/Action';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const menu = [
  { title: 'Orders', icon: <ShoppingBagIcon /> },
  { title: 'Favorites', icon: <FavoriteIcon /> },
  { title: 'Address', icon: <HomeIcon /> },
//   { title: 'Payments', icon: <AccountBalanceWalletIcon /> },
  { title: 'Notification', icon: <NotificationsIcon /> },
//   { title: 'Events', icon: <TodayIcon /> },
  { title: 'Logout', icon: <LogoutIcon /> },
];


const ProfileNavigation = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(!isMobile);
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleNavigate=(item)=>{
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/")
    }
    else{
      navigate(`/my-profile/${item.title.toLowerCase()}`)
    }

    // navigate(`/my-profile/${item.title.toLowerCase()}`)
  };

  const toggleDrawer = () => {
    if (isMobile) {
        setMobileOpen(!mobileOpen);
    } else {
        setOpen(!open);
    }
  };
  return (
    <>
    {/* Bouton Hamburger pour mobile seulement */}
    {isMobile && (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
                position: 'fixed',
                left: 16,
                top: 80,
                zIndex: 1200,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }
            }}
        >
            <MenuIcon />
        </IconButton>
    )}

    {/* Barre latérale principale */}
    <nav 
        className={`
            fixed h-full p-2 flex flex-col transition-all duration-300 ease-in-out 
            bg-gray-900 text-white z-10
            ${isMobile ? 
                `w-64 ${mobileOpen ? 'left-0' : '-left-64'}` : 
                `${open ? 'w-64' : 'w-20'}`
            }
            shadow-xl
        `}
    >
        {/* Header avec bouton de fermeture */}
        <div className='px-3 py-2 h-20 flex justify-end items-center'>
            <IconButton 
                onClick={toggleDrawer} 
                sx={{ 
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                }}
            >
                {isMobile ? <CloseIcon /> : <MenuOpenIcon className={`transition-transform ${!open && 'rotate-180'}`} />}
            </IconButton>
        </div>

        {/* Menu Items */}
        <ul className='flex-1 overflow-y-auto'>
            {menu.map((item, i) => (
                <React.Fragment key={i}>
                    <li 
                        onClick={() => handleNavigate(item)}
                        className={`
                            px-3 py-3 my-1 ${isMobile ? '' : 'hover:bg-blue-700'} rounded-md 
                            transition-colors duration-200 cursor-pointer flex items-center
                            ${item.title === "Logout" ? 'text-red-200' : ''}
                            group
                        `}
                    >
                        <div className='flex items-center justify-center min-w-[40px]'>
                            {React.cloneElement(item.icon, { className: 'text-xl' })}
                        </div>
                        <span className={`ml-4 whitespace-nowrap`}>
                            {item.title}
                        </span>
                        {/* Tooltip pour la version réduite */}
                        {!open && (
                            <div className='
                                absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white 
                                text-sm rounded-md shadow-lg opacity-0 pointer-events-none
                                transition-opacity duration-200 group-hover:opacity-100
                                z-50
                            '>
                                {item.title}
                            </div>
                        )}
                    </li>
                    {i !== menu.length - 1 && <Divider className='bg-gray-700' />}
                </React.Fragment>
            ))}
        </ul>
    </nav>

    {/* Overlay pour mobile */}
    {isMobile && mobileOpen && (
        <div 
            className='fixed inset-0 bg-black bg-opacity-50 z-0 transition-opacity duration-300'
            onClick={() => setMobileOpen(false)}
        />
    )}
  </>
  );
};

export default ProfileNavigation;
