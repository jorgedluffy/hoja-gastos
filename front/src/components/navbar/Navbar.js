import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const baseButtonStyle = {
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'none',
        margin: '0 10px',
    };

    const activeButtonStyle = {
        backgroundColor: '#ffffff',
        color: '#1976d2',
        '&:hover': {
            backgroundColor: '#e3f2fd',
        },
    };

    const renderButton = (label, path) => (
        <Button
            sx={{
                ...baseButtonStyle,
                ...(location.pathname === path ? activeButtonStyle : {}),
            }}
            onClick={() => navigate(path)}
        >
            {label}
        </Button>
    );

    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {renderButton('Dashboard', '/dashboard')}
                    {renderButton('Gráficos', '/graficos')}
                    {renderButton('Categorías', '/categorias')}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;