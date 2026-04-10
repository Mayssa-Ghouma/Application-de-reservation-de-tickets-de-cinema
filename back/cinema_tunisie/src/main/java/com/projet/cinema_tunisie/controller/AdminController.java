package com.projet.cinema_tunisie.controller;

import com.projet.cinema_tunisie.entity.Admin;
import com.projet.cinema_tunisie.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;

    // Authentification admin
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Admin admin = adminService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        if (admin != null) {
            return ResponseEntity.ok(admin);
        } else {
            return ResponseEntity.status(401).body("Identifiants invalides");
        }
    }

    // Créer un admin
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.createAdmin(admin);
    }

    // Récupérer tous les admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // Récupérer un admin par ID
    @GetMapping("/{id}")
    public Optional<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    // Mettre à jour un admin
    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        return adminService.updateAdmin(id, admin);
    }

    // Supprimer un admin
    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }

    // Vérifier si username existe
    @GetMapping("/check-username/{username}")
    public boolean checkUsernameExists(@PathVariable String username) {
        return adminService.usernameExists(username);
    }

    // Vérifier si email existe
    @GetMapping("/check-email/{email}")
    public boolean checkEmailExists(@PathVariable String email) {
        return adminService.emailExists(email);
    }

    // Classe interne pour la requête de login
    public static class LoginRequest {
        private String username;
        private String password;

        // Getters et setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}