package com.projet.cinema_tunisie.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.cinema_tunisie.entity.Booking;
import com.projet.cinema_tunisie.service.BookingService;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = "*")
public class QRController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping("/validate/{qrData}")
    public ResponseEntity<?> validateQRCode(@PathVariable String qrData) {
        try {
            Booking booking = bookingService.validateQRCode(qrData);
            
            // Réponse pour l'app mobile
            Map<String, Object> response = Map.of(
                "valid", true,
                "booking", Map.of(
                    "id", booking.getId(),
                    "fullName", booking.getFullName(),
                    "seatNumber", booking.getSeatNumber(),
                    "movie", Map.of(
                        "title", booking.getMovie().getTitle(),
                        "showTime", booking.getMovie().getShowTime(),
                        "releaseDate", booking.getMovie().getReleaseDate()
                    )
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of(
                "valid", false,
                "message", e.getMessage()
            ));
        }
    }
}
