import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress } from '@mui/material';
import { movieStore } from '../../stores/MovieStore';
import { filterStore } from '../../stores/FilterStore';
import MovieCard from '../../components/MovieCard/MovieCard';
import Filters from '../../components/Filters/Filters';
import { useInView } from 'react-intersection-observer';

const MovieList: React.FC = observer(() => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && movieStore.hasMore && !movieStore.loading) {
      movieStore.fetchMovies(filterStore.currentFilters, true);
    }
  }, [inView, movieStore.hasMore, movieStore.loading, filterStore.currentFilters]);

  useEffect(() => {
    if (!movieStore.loading) {
      console.log('Fetching movies on filter change or initial load', filterStore.currentFilters);
      movieStore.fetchMovies(filterStore.currentFilters, false);
    }
  }, [filterStore.currentFilters]);

  if (movieStore.error && movieStore.movies.length === 0 && !movieStore.loading) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Ошибка загрузки фильмов: {movieStore.error}
        </Typography>
        <Typography variant="body1">
          Пожалуйста, проверьте ваш API ключ или попробуйте позже.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Filters />

      {movieStore.loading && movieStore.movies.length === 0 && !movieStore.error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!movieStore.loading && movieStore.movies.length === 0 && !movieStore.error && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          По вашему запросу фильмов не найдено. Попробуйте изменить фильтры.
        </Typography>
      )}

      {movieStore.movies.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mt: 2,
            justifyContent: 'center',
          }}
        >
          {movieStore.movies.map((movie) => (
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
      )}

      {movieStore.hasMore && (movieStore.loading || movieStore.movies.length > 0) && (
        <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', mt: 4, height: '50px' }}>
          {movieStore.loading && movieStore.movies.length > 0 && <CircularProgress />}
        </Box>
      )}

      {!movieStore.hasMore && movieStore.movies.length > 0 && !movieStore.loading && (
        <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Все доступные фильмы загружены.
        </Typography>
      )}
    </Box>
  );
});

export default MovieList;