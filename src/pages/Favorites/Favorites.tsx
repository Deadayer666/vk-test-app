import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography } from '@mui/material';
import { favoriteStore } from '../../stores/FavoriteStore';
import MovieCard from '../../components/MovieCard/MovieCard';

const Favorites: React.FC = observer(() => {
  const { favorites } = favoriteStore;

  if (favorites.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center', p: 3 }}>
        <Typography variant="h5" gutterBottom>
          В списке избранного пока нет фильмов.
        </Typography>
        <Typography variant="body1">
          Начните добавлять фильмы с главной страницы!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Избранные фильмы
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {favorites.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              flex: {
                xs: '1 1 100%',
                sm: '1 1 47%',
                md: '1 1 31%',
                lg: '1 1 23%',
              },
              maxWidth: {
                xs: '100%',
                sm: '47%',
                md: '31%',
                lg: '23%',
              },
            }}
          >
            <MovieCard movie={movie} />
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default Favorites;