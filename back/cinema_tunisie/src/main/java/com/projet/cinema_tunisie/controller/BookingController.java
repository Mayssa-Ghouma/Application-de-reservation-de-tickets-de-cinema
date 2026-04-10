package com.projet.cinema_tunisie.controller;

import com.projet.cinema_tunisie.entity.Booking;
import com.projet.cinema_tunisie.entity.Paiement;
import com.projet.cinema_tunisie.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;

    // Créer une réservation
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            Booking booking = bookingRequest.getBooking();
            Paiement paiement = bookingRequest.getPaiement();
            
            Booking createdBooking = bookingService.createBooking(booking, paiement);
            return ResponseEntity.ok(createdBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Récupérer toutes les réservations
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Récupérer une réservation par ID
    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // Récupérer les réservations d'un film
    @GetMapping("/movie/{movieId}")
    public List<Booking> getBookingsByMovieId(@PathVariable Long movieId) {
        return bookingService.getBookingsByMovieId(movieId);
    }

    // Récupérer les réservations par email
    @GetMapping("/email/{email}")
    public List<Booking> getBookingsByEmail(@PathVariable String email) {
        return bookingService.getBookingsByEmail(email);
    }

    // Annuler une réservation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        boolean cancelled = bookingService.cancelBooking(id);
        if (cancelled) {
            return ResponseEntity.ok("Réservation annulée avec succès");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Valider un QR code
    @GetMapping("/validate-qr/{qrCode}")
    public ResponseEntity<?> validateQRCode(@PathVariable String qrCode) {
        Booking booking = bookingService.validateQRCode(qrCode);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Compter les réservations pour un film
    @GetMapping("/count/movie/{movieId}")
    public int getBookingCountForMovie(@PathVariable Long movieId) {
        return bookingService.getBookingCountForMovie(movieId);
    }

    // Classe pour la requête de réservation
    public static class BookingRequest {
        private Booking booking;
        private Paiement paiement;

        public Booking getBooking() { return booking; }
        public void setBooking(Booking booking) { this.booking = booking; }
        public Paiement getPaiement() { return paiement; }
        public void setPaiement(Paiement paiement) { this.paiement = paiement; }
    }
}