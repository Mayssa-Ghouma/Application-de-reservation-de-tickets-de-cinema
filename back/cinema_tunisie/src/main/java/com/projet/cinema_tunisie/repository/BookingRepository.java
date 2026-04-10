package com.projet.cinema_tunisie.repository;

import com.projet.cinema_tunisie.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByMovieId(Long movieId);
    List<Booking> findByEmail(String email);
    List<Booking> findByFullNameContainingIgnoreCase(String fullName);
    boolean existsBySeatNumberAndMovieId(Integer seatNumber, Long movieId);
    int countByMovieId(Long movieId);
    Optional<Booking> findByQrCode(String qrCode);
}