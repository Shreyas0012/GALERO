package com.artora.artora_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "collections")
@Data @NoArgsConstructor @AllArgsConstructor
public class Collection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String coverImage;

    @ManyToMany
    @JoinTable(
            name = "collection_artworks",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "artwork_id")
    )
    private List<Artwork> artworks;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}