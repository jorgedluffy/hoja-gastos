import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de que el archivo CSS esté correctamente importado

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                {/* Contenedor de botones */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        sx={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'none' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </Button>
                    <Button
                        sx={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'none' }}
                        onClick={() => navigate('/graficos')}
                    >
                        Gráficos
                    </Button>
                    <Button
                        sx={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'none' }}
                        onClick={() => navigate('/categorias')}
                    >
                        Categorías
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
