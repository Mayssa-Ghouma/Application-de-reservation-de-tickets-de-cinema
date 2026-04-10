package com.projet.cinema_tunisie.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String genre;
    private String posterUrl;
    private LocalDate releaseDate;
    private LocalTime showTime;
    private Double price;
    private Integer totalSeats;
    
    @Column(nullable = false)
    private Integer availableSeats; // ✅ Doit être NOT NULL

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // ⭐⭐⭐ AJOUT CRITIQUE : Évite la boucle infinie ⭐⭐⭐
    private List<Booking> bookings;
    
    // ✅ CONSTRUCTEURS
    public Movie() {
        this.availableSeats = 0; // ✅ Initialisation par défaut
    }
    
    // ✅ GETTER avec sécurité absolue
    public Integer getAvailableSeats() {
        // ✅ GARANTIR que availableSeats n'est jamais null
        if (this.availableSeats == null) {
            this.availableSeats = this.totalSeats != null ? this.totalSeats : 0;
        }
        return this.availableSeats;
    }
    
    // ✅ SETTER avec sécurité
    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats != null ? availableSeats : 0;
    }
    
    // ✅ SETTER pour totalSeats qui initialise availableSeats
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
        if (this.availableSeats == null || this.availableSeats == 0) {
            this.availableSeats = totalSeats;
        }
    }

    // ... LES AUTRES GETTERS/SETTERS EXISTANTS ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getTotalSeats() { return totalSeats; }
    // public void setTotalSeats(Integer totalSeats) { ... } // DÉJÀ DÉFINI AU-DESSUS
    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}