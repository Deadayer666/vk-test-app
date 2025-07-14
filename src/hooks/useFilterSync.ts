import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IFilters } from '../types/movie';
import { movieStore } from '../stores/MovieStore';
import { filterStore } from '../stores/FilterStore';
import { reaction } from 'mobx';

export const useFilterSync = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
        const ratingParam = searchParams.get('rating');
        const yearParam = searchParams.get('year');

        const rating: [number, number] = ratingParam ?
            ratingParam.split('-').map(Number) as [number, number] :
            [1, 10];
        const year: [number, number] = yearParam ?
            yearParam.split('-').map(Number) as [number, number] :
            [1990, new Date().getFullYear()];

        filterStore.setGenres(genres);
        filterStore.setRating(rating);
        filterStore.setYear(year);

        // movieStore.fetchMovies сам обрабатывает сброс, если фильтры изменились
        movieStore.fetchMovies(filterStore.currentFilters, true);

    }, [searchParams]);

    useEffect(() => {
        const dispose = reaction(
            () => filterStore.currentFilters,
            (currentFilters) => {
                const newSearchParams = new URLSearchParams();

                if (currentFilters.genres.length > 0) {
                    newSearchParams.set('genres', currentFilters.genres.join(','));
                } else {
                    newSearchParams.delete('genres');
                }

                if (currentFilters.rating[0] !== 1 || currentFilters.rating[1] !== 10) {
                    newSearchParams.set('rating', `${currentFilters.rating[0]}-${currentFilters.rating[1]}`);
                } else {
                    newSearchParams.delete('rating');
                }

                const currentYear = new Date().getFullYear();
                if (currentFilters.year[0] !== 1990 || currentFilters.year[1] !== currentYear) {
                    newSearchParams.set('year', `${currentFilters.year[0]}-${currentFilters.year[1]}`);
                } else {
                    newSearchParams.delete('year');
                }

                setSearchParams(newSearchParams, { replace: true });
            },
            {
                fireImmediately: false
            }
        );

        return () => dispose();
    }, []);

    const applyFiltersAndReloadMovies = useCallback(() => {
        movieStore.fetchMovies(filterStore.currentFilters, true);
    }, []);

    return { applyFiltersAndReloadMovies };
};