package com.artora.artora_backend.repository;

import com.artora.artora_backend.entity.Artwork;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    @Override
    @EntityGraph(attributePaths = {"artist"})
    List<Artwork> findAll();

    @EntityGraph(attributePaths = {"artist"})
    List<Artwork> findByCategory(String category);

    @EntityGraph(attributePaths = {"artist"})
    List<Artwork> findByIsAvailable(Boolean isAvailable);

    @EntityGraph(attributePaths = {"artist"})
    List<Artwork> findByArtist_Id(Long artistId);
}