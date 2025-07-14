import { makeAutoObservable, observable, computed, action } from 'mobx';
import type { IFilters } from '../types/movie'; 

class FilterStore {
    @observable selectedGenres: string[] = [];
    @observable rating: [number, number] = [1, 10];
    @observable year: [number, number] = [1990, new Date().getFullYear()]; 

    constructor() {
        makeAutoObservable(this);
    }

    @computed
    get currentFilters(): IFilters { 
        return {
            genres: this.selectedGenres,
            rating: this.rating,
            year: this.year,
        };
    }

    @action
    setGenres(genres: string[]) {
        this.selectedGenres = genres;
    }

    @action
    setRating(newRating: [number, number]) {
        this.rating = newRating;
    }

    @action
    setYear(newYear: [number, number]) {
        this.year = newYear;
    }

    @action
    resetFilters() {
        this.selectedGenres = [];
        this.rating = [1, 10];
        this.year = [1990, new Date().getFullYear()];
    }
}

export const filterStore = new FilterStore();