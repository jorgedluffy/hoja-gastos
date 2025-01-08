import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, TextField, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            const res = await axios.get('http://localhost:5000/categorias');
            setCategorias(res.data);
        };
        fetchCategorias();
    }, []);

    const handleAddCategoria = async () => {
        if (!nuevaCategoria.trim()) {
            alert('El nombre de la categoría no puede estar vacío.');
            return;
        }
        const res = await axios.post('http://localhost:5000/categorias', { nombre: nuevaCategoria });
        setCategorias([...categorias, res.data]);
        setNuevaCategoria('');
        setDialogOpen(false);
    };

    const handleDeleteCategoria = async (id) => {
        await axios.delete(`http://localhost:5000/categorias/${id}`);
        setCategorias(categorias.filter((cat) => cat._id !== id));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h3" align="center" gutterBottom>
                Categorías
            </Typography>

            <Grid container justifyContent="center" style={{ marginBottom: '2rem' }}>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                    Añadir Nueva Categoría
                </Button>
            </Grid>

            <Grid container spacing={3}>
                {categorias.map((cat) => (
                    <Grid item xs={12} sm={6} md={4} key={cat._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{cat.nombre}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleDeleteCategoria(cat._id)}
                                >
                                    Eliminar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <div style={{ padding: '2rem', minWidth: '300px' }}>
                    <Typography variant="h6" gutterBottom>
                        Nueva Categoría
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nombre de la categoría"
                        variant="outlined"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={() => setDialogOpen(false)} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddCategoria} variant="contained" color="primary">
                            Guardar
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Categorias;
