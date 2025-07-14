import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Typography, CircularProgress, Paper, Button, Chip } from '@mui/material';
import { getMovieDetails } from '../../api/kinopoisk';
import type { IMovie } from '../../types/movie';
import { favoriteStore } from '../../stores/FavoriteStore';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { Star, StarBorder } from '@mui/icons-material';

const MovieDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFavorite = movie ? favoriteStore.isFavorite(movie.id) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError('ID фильма не предоставлен.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить информацию о фильме.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddFavoriteClick = () => {
    if (movie) setIsModalOpen(true);
  };

  const confirmAddFavorite = () => {
    if (movie) favoriteStore.addFavorite(movie);
    setIsModalOpen(false);
  };

  const handleRemoveFavoriteClick = () => {
    if (movie) favoriteStore.removeFavorite(movie.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Typography variant="body1">
          Возможно, фильма с таким ID не существует или произошла ошибка при загрузке.
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">Фильм не найден.</Typography>
      </Box>
    );
  }

  const posterUrl = movie.poster?.url || 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 33%' }, maxWidth: { xs: '100%', md: '33%' } }}>
          <img
            src={posterUrl}
            alt={movie.name}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 67%' }, maxWidth: { xs: '100%', md: '67%' } }}>
          <Typography variant="h4" gutterBottom>
            {movie.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Год: {movie.year || 'N/A'}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Рейтинг КП: {movie.rating?.kp?.toFixed(1) || 'N/A'}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Описание:</strong> {movie.description || 'Описание отсутствует.'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Дата выхода (Мир):</strong> {movie.premiere?.world || 'Неизвестно'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
              Жанры:
            </Typography>
            {movie.genres && movie.genres.length > 0 ? (
              movie.genres.map((g, index) => <Chip key={index} label={g.name} size="small" />)
            ) : (
              <Typography variant="body2" component="span">
                Нет информации
              </Typography>
            )}
          </Box>
          <Box sx={{ mt: 3 }}>
            {isFavorite ? (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveFavoriteClick}
                startIcon={<Star />}
              >
                Удалить из избранного
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFavoriteClick}
                startIcon={<StarBorder />}
              >
                В избранное
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmAddFavorite}
        onCancel={handleCloseModal}
        message={`Вы уверены, что хотите добавить "${movie.name}" в избранное?`}
        title="Добавить в избранное"
      />
    </Paper>
  );
});

export default MovieDetail;