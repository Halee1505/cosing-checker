import React from 'react';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [user] = useAuthState(auth);
    const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    })
  };

  return (
    <AppBar position="static">
      <Toolbar 
        style={{ display: 'flex', justifyContent: 'flex-end', background: '#fff' }}>
        {user ? (
          <>
            <Typography variant="subtitle1" style={{ marginRight: '20px', color: '#000' }}>
              Welcome, {user.email}
            </Typography>
            <Button color="inherit" onClick={() => navigate('/reset')} style={{ color: '#000' }}>
              Đổi mật khẩu
            </Button>
            <Button color="inherit" onClick={handleLogout} style={{ color: '#000' }}>
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="subtitle1">
            Please log in or register
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
