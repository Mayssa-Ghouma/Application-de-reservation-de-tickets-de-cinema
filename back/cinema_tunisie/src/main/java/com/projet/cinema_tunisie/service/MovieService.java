package com.projet.cinema_tunisie.service;
import com.projet.cinema_tunisie.entity.Movie;
import com.projet.cinema_tunisie.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
	@Autowired
    private MovieRepository movieRepository;

    // Ajouter un film
    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    // Modifier un film
    public Movie updateMovie(Long id, Movie newMovie) {
        Optional<Movie> existing = movieRepository.findById(id);
        if (existing.isPresent()) {
            Movie movie = existing.get();
            movie.setTitle(newMovie.getTitle());
            movie.setDescription(newMovie.getDescription());
            movie.setGenre(newMovie.getGenre());
            movie.setPosterUrl(newMovie.getPosterUrl());
            movie.setReleaseDate(newMovie.getReleaseDate());
            movie.setShowTime(newMovie.getShowTime());
            movie.setPrice(newMovie.getPrice());
            movie.setTotalSeats(newMovie.getTotalSeats());
            return movieRepository.save(movie);
        } else {
            return null;
        }
    }

    // Supprimer un film
    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    // Récupérer tous les films
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Récupérer un film par ID
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }


	public MovieService() {
		// TODO Auto-generated constructor stub
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
}
