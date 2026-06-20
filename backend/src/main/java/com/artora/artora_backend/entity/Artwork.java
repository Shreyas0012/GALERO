package com.artora.artora_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "artworks")
@Data @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;
    private String category;
    private String medium;
    private Integer year;
    private String imageUrl;
    private Boolean isAvailable = true;
    private String orientation = "portrait";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Artist artist;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}