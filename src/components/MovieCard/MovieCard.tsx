import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import type { IMovie } from '../../types/movie'; // 'type' для импортов типов
import { observer } from 'mobx-react-lite';
import { favoriteStore } from '../../stores/FavoriteStore';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { Star, StarBorder } from '@mui/icons-material';

interface MovieCardProps {
    movie: IMovie;
}

const MovieCard: React.FC<MovieCardProps> = observer(({ movie }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const isFavorite = favoriteStore.isFavorite(movie.id);

    const handleAddFavoriteClick = () => {
        setIsModalOpen(true);
    };

    const confirmAddFavorite = () => {
        favoriteStore.addFavorite(movie);
        setIsModalOpen(false);
    };

    const handleRemoveFavoriteClick = () => {
        favoriteStore.removeFavorite(movie.id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const posterUrl = movie.poster?.previewUrl || 'https://via.placeholder.com/200x300?text=No+Poster';

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardMedia
                    component="img"
                    height="280"
                    image={posterUrl}
                    alt={movie.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                        {movie.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Год: {movie.year || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Рейтинг КП: {movie.rating?.kp?.toFixed(1) || 'N/A'}
                    </Typography>
                </CardContent>
            </Link>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                {isFavorite ? (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleRemoveFavoriteClick}
                        startIcon={<Star />}
                    >
                        Удалить
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleAddFavoriteClick}
                        startIcon={<StarBorder />}
                    >
                        В избранное
                    </Button>
                )}
            </Box>
            <ConfirmationModal
                isOpen={isModalOpen}
                onConfirm={confirmAddFavorite}
                onCancel={handleCloseModal}
                message={`Вы уверены, что хотите добавить "${movie.name}" в избранное?`}
                title="Добавить в избранное"
            />
        </Card>
    );
});

export default MovieCard;