package com.artora.artora_backend.repository;

import com.artora.artora_backend.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByCategory(String category);
    List<Artwork> findByIsAvailable(Boolean isAvailable);
    List<Artwork> findByArtist_Id(Long artistId);
}