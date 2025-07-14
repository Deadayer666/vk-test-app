import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import MovieList from './pages/MovieList/MovieList';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Favorites from './pages/Favorites/Favorites';
import NotFound from './pages/NotFound/NotFound';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {}
            <Router>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Movie Explorer
                            </Link>
                        </Typography>
                        <Button color="inherit" component={Link} to="/">Фильмы</Button>
                        <Button color="inherit" component={Link} to="/favorites">Избранное</Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        <Route path="/" element={<MovieList />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;