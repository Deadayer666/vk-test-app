import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { IMovie } from '../types/movie';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

class FavoriteStore {
    favorites: IMovie[] = [];
    private localStorageKey = 'movie-favorites';

    constructor() {
        makeAutoObservable(this);
        this.loadFavorites();

        reaction(
            () => this.favorites.map(fav => fav.id), 

            (_ids) => { 
                saveToLocalStorage(this.localStorageKey, this.favorites);
            },
            { fireImmediately: false } 
        );
    }

    loadFavorites() {
        const storedFavorites = loadFromLocalStorage<IMovie[]>(this.localStorageKey);
        if (storedFavorites) {
            runInAction(() => {
                this.favorites = storedFavorites;
            });
        }
    }


    addFavorite(movie: IMovie) {
        runInAction(() => { 
            if (!this.favorites.some(fav => fav.id === movie.id)) {
                this.favorites.push(movie);
            }
        });
    }


    removeFavorite(movieId: string | number) {
        runInAction(() => { 
            this.favorites = this.favorites.filter(fav => fav.id !== movieId);
        });
    }


    isFavorite(movieId: string | number): boolean {
        return this.favorites.some(fav => fav.id === movieId);
    }
}

export const favoriteStore = new FavoriteStore();