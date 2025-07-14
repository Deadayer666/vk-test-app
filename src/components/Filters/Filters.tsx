import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Typography, Select, MenuItem, Slider, InputLabel, FormControl, Button, Chip, OutlinedInput, CircularProgress, SelectChangeEvent } from '@mui/material';
import { filterStore } from '../../stores/FilterStore';
import { useFilterSync } from '../../hooks/useFilterSync';
import { getMovieGenres } from '../../api/kinopoisk';

const Filters: React.FC = observer(() => {
    const { applyFiltersAndReloadMovies } = useFilterSync();
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const [loadingGenres, setLoadingGenres] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            setLoadingGenres(true);
            try {
                const genresData = await getMovieGenres();
                // Фильтрация и преобразование, чтобы гарантировать string[]
                if (Array.isArray(genresData)) {
                    setAllGenres(genresData.map(g => g.name).filter((name): name is string => typeof name === 'string'));
                } else {
                    console.error("API did not return an array for genres:", genresData);
                    setAllGenres([]);
                }
            } catch (error) {
                console.error("Failed to load genres:", error);
                setAllGenres([]);
            } finally {
                setLoadingGenres(false);
            }
        };
        fetchGenres();
    }, []);

    const handleGenreChange = (event: SelectChangeEvent<string[]>) => {
        filterStore.setGenres(event.target.value as string[]);
        applyFiltersAndReloadMovies();
    };

    // --- КЛЮЧЕВЫЕ ИЗМЕНЕНИЯ: Типизация 'event' изменена на 'Event | React.SyntheticEvent' ---
    const handleRatingChange = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
        filterStore.setRating(newValue as [number, number]);
    };
    const handleRatingChangeCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
        filterStore.setRating(newValue as [number, number]);
        applyFiltersAndReloadMovies();
    };

    const handleYearChange = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
        filterStore.setYear(newValue as [number, number]);
    };
    const handleYearChangeCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
        filterStore.setYear(newValue as [number, number]);
        applyFiltersAndReloadMovies();
    };
    // --- Конец ключевых изменений ---

    const resetAllFilters = () => {
        filterStore.resetFilters();
        applyFiltersAndReloadMovies();
    };

    return (
        <Box sx={{ mb: 4, p: 3, border: '1px solid #444', borderRadius: '8px', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Фильтры</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="genres-label">Жанры</InputLabel>
                {loadingGenres ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} /></Box>
                ) : (
                    <Select
                        labelId="genres-label"
                        multiple
                        value={filterStore.selectedGenres}
                        onChange={handleGenreChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Жанры" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(selected as string[]).map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 224,
                                    width: 250,
                                },
                            },
                        }}
                    >
                        {allGenres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </FormControl>

            <Typography gutterBottom>Рейтинг Кинопоиск: {filterStore.rating[0].toFixed(1)} - {filterStore.rating[1].toFixed(1)}</Typography>
            <Slider
                value={filterStore.rating}
                onChange={handleRatingChange}
                onChangeCommitted={handleRatingChangeCommitted}
                min={1}
                max={10}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Год выпуска: {filterStore.year[0]} - {filterStore.year[1]}</Typography>
            <Slider
                value={filterStore.year}
                onChange={handleYearChange}
                onChangeCommitted={handleYearChangeCommitted}
                min={1990}
                max={new Date().getFullYear()}
                step={1}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
            />

            <Button variant="outlined" onClick={resetAllFilters} fullWidth>Сбросить фильтры</Button>
        </Box>
    );
});

export default Filters;