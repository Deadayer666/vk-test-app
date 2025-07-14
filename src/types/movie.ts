export interface IMovie {
    id: string | number;
    name: string;
    description?: string;
    poster?: {
        url?: string;
        previewUrl?: string;
    };
    year?: number;
    rating?: {
        kp?: number; // Рейтинг Кинопоиск
        imdb?: number;
    };
    genres?: Array<{ name: string }>;
    premiere?: {
        world?: string; // Дата выхода
    };
}

export interface IMovieListResponse {
    docs: IMovie[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export interface IFilters {
    genres: string[];
    rating: [number, number];
    year: [number, number];
}