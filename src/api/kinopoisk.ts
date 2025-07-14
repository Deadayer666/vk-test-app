import axios from 'axios';
import type { IMovie, IMovieListResponse, IFilters } from '../types/movie';

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = import.meta.env.VITE_KINOPOISK_BASE_URL;

if (!API_KEY) {
    console.error("API Key for Kinopoisk is not defined. Please set VITE_KINOPOISK_API_KEY in your .env file.");
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'X-API-KEY': API_KEY || '',
        'Content-Type': 'application/json',
    },
});

export const getMovies = async (filters: IFilters, page: number, limit: number = 50): Promise<IMovieListResponse> => {
    try {
        const params: any = {
            page,
            limit,
            'notNullFields': 'name,poster,rating',
            'type': 'movie',
            ...(filters.genres.length > 0 && { 'genres.name': filters.genres.join(',') }),
            'rating.kp': `${filters.rating[0]}-${filters.rating[1]}`,
            'year': `${filters.year[0]}-${filters.year[1]}`,
        };

        const response = await api.get('/movie', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
};

export const getMovieDetails = async (id: string): Promise<IMovie> => {
    try {
        const response = await api.get(`/movie/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching movie details for ${id}:`, error);
        throw error;
    }
};

export const getMovieGenres = async (): Promise<Array<{ name: string }>> => {
    try {
        const response = await api.get('/v1/movie/possible-values-by-field?field=genres.name');
        return response.data.map((item: any) => ({ name: item.name }));
    } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
    }
};