package com.projet.cinema_tunisie.service;

import com.projet.cinema_tunisie.entity.Admin;
import com.projet.cinema_tunisie.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;

    // Créer un admin
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Authentifier un admin
    public Admin authenticate(String username, String password) {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin.get();
        }
        return null;
    }

    // Récupérer tous les admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Récupérer un admin par ID
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    // Mettre à jour un admin
    public Admin updateAdmin(Long id, Admin newAdmin) {
        Optional<Admin> existing = adminRepository.findById(id);
        if (existing.isPresent()) {
            Admin admin = existing.get();
            admin.setUsername(newAdmin.getUsername());
            admin.setPassword(newAdmin.getPassword());
            admin.setEmail(newAdmin.getEmail());
            return adminRepository.save(admin);
        } else {
            return null;
        }
    }

    // Supprimer un admin
    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    // Vérifier si un username existe
    public boolean usernameExists(String username) {
        return adminRepository.existsByUsername(username);
    }

    // Vérifier si un email existe
    public boolean emailExists(String email) {
        return adminRepository.existsByEmail(email);
    }
}