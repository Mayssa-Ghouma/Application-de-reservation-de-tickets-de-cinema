package com.projet.cinema_tunisie.repository;

import com.projet.cinema_tunisie.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    
    List<Paiement> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Paiement> findByAmountGreaterThan(Double amount);
    List<Paiement> findByCardNumber(String cardNumber);
    int countByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}