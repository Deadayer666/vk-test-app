import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 64px)', 
            textAlign: 'center',
            p: 3,
        }}>
            <Typography variant="h1" component="div" gutterBottom sx={{ color: 'primary.main' }}>
                404
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
                Страница не найдена
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Извините, но запрошенная вами страница не существует.
            </Typography>
            <Button variant="contained" component={Link} to="/">
                Вернуться на главную
            </Button>
        </Box>
    );
};

export default NotFound;