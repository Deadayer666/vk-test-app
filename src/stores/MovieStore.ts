import { makeAutoObservable, runInAction } from 'mobx';
import { getMovies } from '../api/kinopoisk';
import { IMovie, IFilters } from '../types/movie';

class MovieStore {
    movies: IMovie[] = [];
    loading: boolean = false;
    error: string | null = null;
    page: number = 1;
    limit: number = 50;
    hasMore: boolean = true;
    totalMovies: number = 0;

    private appliedFilters: IFilters = { genres: [], rating: [1, 10], year: [1990, new Date().getFullYear()] };


    constructor() {
        makeAutoObservable(this);
    }


    async fetchMovies(filters: IFilters, reset: boolean = false) {

        if (this.loading || (!this.hasMore && !reset)) {
            return;
        }

        const filtersChanged = JSON.stringify(filters) !== JSON.stringify(this.appliedFilters);

        if (filtersChanged) {
            reset = true; 
            this.appliedFilters = filters; 
        }

        if (reset) {
            this.movies = [];
            this.page = 1;
            this.hasMore = true;
            this.totalMovies = 0;

            this.appliedFilters = filters;
        }


        this.loading = true;
        this.error = null;

        try {
            const data = await getMovies(this.appliedFilters, this.page, this.limit);
            runInAction(() => {
                this.movies = reset ? data.docs : [...this.movies, ...data.docs];
                this.totalMovies = data.total;
                this.page++;

                this.hasMore = data.page < data.pages; 
            });
        } catch (error: any) {
            runInAction(() => {
                this.error = error.message || "Не удалось загрузить фильмы.";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }


    resetStore() {
        runInAction(() => {
            this.movies = [];
            this.loading = false;
            this.error = null;
            this.page = 1;
            this.limit = 50;
            this.hasMore = true;
            this.totalMovies = 0;
            this.appliedFilters = { genres: [], rating: [1, 10], year: [1990, new Date().getFullYear()] };
        });
    }
}

export const movieStore = new MovieStore();