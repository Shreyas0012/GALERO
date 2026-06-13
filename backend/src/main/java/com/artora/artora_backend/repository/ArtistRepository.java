package com.artora.artora_backend.repository;

import com.artora.artora_backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByNationality(String nationality);
}