package com.projet.cinema_tunisie.controller;

import com.projet.cinema_tunisie.entity.Paiement;
import com.projet.cinema_tunisie.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
public class PaiementController {
    
    @Autowired
    private PaiementService paiementService;

    // Créer un paiement
    @PostMapping
    public ResponseEntity<?> createPaiement(@RequestBody Paiement paiement) {
        try {
            Paiement createdPaiement = paiementService.createPaiement(paiement);
            return ResponseEntity.ok(createdPaiement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Récupérer tous les paiements
    @GetMapping
    public List<Paiement> getAllPaiements() {
        return paiementService.getAllPaiements();
    }

    // Récupérer un paiement par ID
    @GetMapping("/{id}")
    public Optional<Paiement> getPaiementById(@PathVariable Long id) {
        return paiementService.getPaiementById(id);
    }

    // Mettre à jour un paiement
    @PutMapping("/{id}")
    public Paiement updatePaiement(@PathVariable Long id, @RequestBody Paiement paiement) {
        return paiementService.updatePaiement(id, paiement);
    }

    // Supprimer un paiement
    @DeleteMapping("/{id}")
    public void deletePaiement(@PathVariable Long id) {
        paiementService.deletePaiement(id);
    }

    // Récupérer les paiements par période
    @GetMapping("/period")
    public List<Paiement> getPaiementsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return paiementService.getPaiementsByPeriod(startDate, endDate);
    }

    // Récupérer les paiements supérieurs à un montant
    @GetMapping("/above-amount")
    public List<Paiement> getPaiementsAboveAmount(@RequestParam Double amount) {
        return paiementService.getPaiementsAboveAmount(amount);
    }

    // Obtenir le chiffre d'affaires total
    @GetMapping("/revenue/total")
    public Double getTotalRevenue() {
        return paiementService.getTotalRevenue();
    }

    // Obtenir le chiffre d'affaires sur une période
    @GetMapping("/revenue/period")
    public Double getRevenueByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return paiementService.getRevenueByPeriod(startDate, endDate);
    }

    // Compter les paiements sur une période
    @GetMapping("/count/period")
    public int countPaiementsByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return paiementService.countPaiementsByPeriod(startDate, endDate);
    }

    // Vérifier si un numéro de carte existe
    @GetMapping("/check-card/{cardNumber}")
    public boolean checkCardNumberExists(@PathVariable String cardNumber) {
        return paiementService.cardNumberExists(cardNumber);
    }
}