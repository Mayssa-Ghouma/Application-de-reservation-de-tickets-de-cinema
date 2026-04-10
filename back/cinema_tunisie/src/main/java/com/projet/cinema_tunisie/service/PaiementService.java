package com.projet.cinema_tunisie.service;

import com.projet.cinema_tunisie.entity.Paiement;
import com.projet.cinema_tunisie.repository.PaiementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaiementService {
    
    @Autowired
    private PaiementRepository paiementRepository;

    // Créer un paiement
    public Paiement createPaiement(Paiement paiement) {
        // Valider les données de carte (simulation)
        if (!isValidCard(paiement.getCardNumber(), paiement.getExpirationDate(), paiement.getCvv())) {
            throw new RuntimeException("Données de carte invalides");
        }
        
        // Définir la date de paiement
        paiement.setPaymentDate(LocalDateTime.now());
        
        // Simuler le traitement de paiement
        boolean paymentProcessed = processPayment(paiement);
        if (!paymentProcessed) {
            throw new RuntimeException("Échec du traitement du paiement");
        }
        
        return paiementRepository.save(paiement);
    }

    // Récupérer tous les paiements
    public List<Paiement> getAllPaiements() {
        return paiementRepository.findAll();
    }

    // Récupérer un paiement par ID
    public Optional<Paiement> getPaiementById(Long id) {
        return paiementRepository.findById(id);
    }

    // Mettre à jour un paiement
    public Paiement updatePaiement(Long id, Paiement newPaiement) {
        Optional<Paiement> existing = paiementRepository.findById(id);
        if (existing.isPresent()) {
            Paiement paiement = existing.get();
            paiement.setCardNumber(newPaiement.getCardNumber());
            paiement.setExpirationDate(newPaiement.getExpirationDate());
            paiement.setCvv(newPaiement.getCvv());
            paiement.setAmount(newPaiement.getAmount());
            return paiementRepository.save(paiement);
        } else {
            return null;
        }
    }

    // Supprimer un paiement
    public void deletePaiement(Long id) {
        paiementRepository.deleteById(id);
    }

    // Récupérer les paiements par période
    public List<Paiement> getPaiementsByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return paiementRepository.findByPaymentDateBetween(startDate, endDate);
    }

    // Récupérer les paiements supérieurs à un montant
    public List<Paiement> getPaiementsAboveAmount(Double amount) {
        return paiementRepository.findByAmountGreaterThan(amount);
    }

    // Compter les paiements sur une période
    public int countPaiementsByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return paiementRepository.countByPaymentDateBetween(startDate, endDate);
    }

    // Calculer le chiffre d'affaires total
    public Double getTotalRevenue() {
        return paiementRepository.findAll().stream()
            .mapToDouble(Paiement::getAmount)
            .sum();
    }

    // Calculer le chiffre d'affaires sur une période
    public Double getRevenueByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return paiementRepository.findByPaymentDateBetween(startDate, endDate).stream()
            .mapToDouble(Paiement::getAmount)
            .sum();
    }

    // Valider les données de carte (simulation)
    private boolean isValidCard(String cardNumber, String expirationDate, String cvv) {
        // Simulation de validation
        return cardNumber != null && cardNumber.length() >= 16 &&
               expirationDate != null && expirationDate.matches("\\d{2}/\\d{2}") &&
               cvv != null && (cvv.length() == 3 || cvv.length() == 4);
    }

    // Traiter le paiement (simulation)
    private boolean processPayment(Paiement paiement) {
        // Simulation de traitement de paiement
        // En production, intégrer avec Stripe, PayPal, etc.
        try {
            Thread.sleep(100); // Simulation de délai de traitement
            return true;
        } catch (InterruptedException e) {
            return false;
        }
    }

    // Vérifier si un numéro de carte existe déjà
    public boolean cardNumberExists(String cardNumber) {
        return !paiementRepository.findByCardNumber(cardNumber).isEmpty();
    }
}