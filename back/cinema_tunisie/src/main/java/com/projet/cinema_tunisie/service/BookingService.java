package com.projet.cinema_tunisie.service;

import com.projet.cinema_tunisie.entity.Booking;
import com.projet.cinema_tunisie.entity.Movie;
import com.projet.cinema_tunisie.entity.Paiement;
import com.projet.cinema_tunisie.repository.BookingRepository;
import com.projet.cinema_tunisie.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private MovieRepository movieRepository;

    public Booking createBooking(Booking booking, Paiement paiement) {
        try {
            System.out.println("🎯 DÉBUT createBooking");
            
            // Vérifier que le film existe
            Movie movie = booking.getMovie();
            if (movie == null || movie.getId() == null) {
                throw new RuntimeException("Film non spécifié");
            }

            // ✅ CORRECTION : Charger le film depuis la base
            Optional<Movie> movieOpt = movieRepository.findById(movie.getId());
            if (movieOpt.isEmpty()) {
                throw new RuntimeException("Film non trouvé");
            }
            
            Movie persistedMovie = movieOpt.get();

            // ✅ CORRECTION : Initialisation SÉCURISÉE
            if (persistedMovie.getTotalSeats() == null) {
                persistedMovie.setTotalSeats(100); // Valeur par défaut
            }
            if (persistedMovie.getAvailableSeats() == null) {
                persistedMovie.setAvailableSeats(persistedMovie.getTotalSeats());
                movieRepository.save(persistedMovie); // ✅ Sauvegarder la correction
            }

            // ✅ Vérifier la disponibilité
            if (persistedMovie.getAvailableSeats() <= 0) {
                throw new RuntimeException("Plus de places disponibles pour ce film");
            }

            // Vérifier si le siège est déjà pris
            if (bookingRepository.existsBySeatNumberAndMovieId(booking.getSeatNumber(), persistedMovie.getId())) {
                throw new RuntimeException("Ce siège est déjà réservé");
            }

            // Définir la date de réservation
            booking.setBookingDate(LocalDateTime.now());

            // ✅ CORRECTION : Lier le paiement (sera sauvegardé par CASCADE)
            booking.setPaiement(paiement);

            // Lier le film persisté
            booking.setMovie(persistedMovie);

            // Calculer le prix total
            booking.setTotalPrice(persistedMovie.getPrice());

            // ⭐⭐⭐ CORRECTION : GÉNÉRATION QR CODE UUID SÉCURISÉ ⭐⭐⭐
            String qrUUID = generateSecureQRCode();
            booking.setQrCode(qrUUID);
            System.out.println("🔐 QR Code généré: " + qrUUID);

            System.out.println("💾 Sauvegarde de la réservation avec CASCADE...");
            
            // ✅ SAUVEGARDER la réservation (CASCADE sauvegardera automatiquement le paiement)
            Booking savedBooking = bookingRepository.save(booking);

            // ✅ Mettre à jour les places disponibles après sauvegarde
            updateAvailableSeats(persistedMovie.getId(), -1);

            System.out.println("✅ Réservation créée avec succès: " + savedBooking.getId());
            return savedBooking;

        } catch (Exception e) {
            System.err.println("❌ ERREUR dans createBooking: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // ⭐⭐⭐ NOUVELLE MÉTHODE : Génération QR code sécurisé ⭐⭐⭐
    private String generateSecureQRCode() {
        // Génère un UUID unique et sécurisé
        return "TICKET-" + UUID.randomUUID().toString().toUpperCase();
    }

    // ⭐⭐⭐ NOUVELLE MÉTHODE : Validation QR code pour l'app mobile ⭐⭐⭐
    public Booking validateQRCode(String qrData) {
        System.out.println("🔍 Validation QR code: " + qrData);
        
        // Recherche directe par QR code
        Optional<Booking> bookingOpt = bookingRepository.findByQrCode(qrData);
        
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("QR code invalide - Ticket non trouvé");
        }
        
        Booking booking = bookingOpt.get();
        
        // Vérifier que la séance n'est pas passée
        LocalDateTime showDateTime = LocalDateTime.of(
            booking.getMovie().getReleaseDate(),
            booking.getMovie().getShowTime()
        );
        
        if (LocalDateTime.now().isAfter(showDateTime)) {
            throw new RuntimeException("La séance est déjà passée");
        }
        
        System.out.println("✅ QR code validé pour: " + booking.getFullName());
        return booking;
    }

    // Récupérer toutes les réservations
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Récupérer une réservation par ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Récupérer les réservations d'un film
    public List<Booking> getBookingsByMovieId(Long movieId) {
        return bookingRepository.findByMovieId(movieId);
    }

    // Récupérer les réservations par email
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }

    // Annuler une réservation
    public boolean cancelBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            // Remboursement des places
            updateAvailableSeats(booking.get().getMovie().getId(), 1);
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Mettre à jour les places disponibles
    private void updateAvailableSeats(Long movieId, int change) {
        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (movieOpt.isPresent()) {
            Movie movie = movieOpt.get();
            // Initialiser si null
            if (movie.getAvailableSeats() == null) {
                movie.setAvailableSeats(movie.getTotalSeats());
            }
            movie.setAvailableSeats(movie.getAvailableSeats() + change);
            movieRepository.save(movie);
        }
    }

    // ⭐⭐⭐ ANCIENNE MÉTHODE (conservée pour compatibilité) ⭐⭐⭐
    public Booking validateQRCodeOld(String qrCode) {
        return bookingRepository.findAll().stream()
            .filter(booking -> qrCode.equals(booking.getQrCode()))
            .findFirst()
            .orElse(null);
    }

    // Compter les réservations pour un film
    public int getBookingCountForMovie(Long movieId) {
        return bookingRepository.countByMovieId(movieId);
    }
}