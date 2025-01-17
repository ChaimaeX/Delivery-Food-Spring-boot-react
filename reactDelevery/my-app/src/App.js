import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './component/Theme/DarkTheme';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './component/State/Authentication/Action';
import CustomerRouter from './Routers/CustomerRouter';
import Routers from './Routers/Routers';
import { getRestaurantById, getRestaurantByUserId } from './component/State/Restaurant/Action';

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector(store => store.auth);

  useEffect(() => {
    if (jwt) {  // Vérifiez d'abord si le JWT est dans localStorage
      dispatch(getUser(auth.jwt||jwt));  // Déclencher l'action pour récupérer l'utilisateur
    }
  }, [auth.jwt, dispatch]);

  useEffect(()=>{
    dispatch(getRestaurantByUserId(auth.jwt || jwt));
    
   
  },[auth.user])
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routers />
      </ThemeProvider>
    </div>
  );
}

export default App;
