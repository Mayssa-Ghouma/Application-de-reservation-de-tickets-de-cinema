package com.projet.cinema_tunisie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.cinema_tunisie.entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long>{

}
