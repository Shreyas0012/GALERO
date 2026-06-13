package com.artora.artora_backend.service;

import com.artora.artora_backend.entity.Artwork;
import com.artora.artora_backend.repository.ArtworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtworkService {

    private final ArtworkRepository repo;

    public List<Artwork> getAll() { return repo.findAll(); }

    public Artwork getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found: " + id));
    }

    public List<Artwork> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    public Artwork create(Artwork artwork) { return repo.save(artwork); }

    public Artwork update(Long id, Artwork updated) {
        Artwork existing = getById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getMedium() != null) existing.setMedium(updated.getMedium());
        if (updated.getYear() != null) existing.setYear(updated.getYear());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
        if (updated.getIsAvailable() != null) existing.setIsAvailable(updated.getIsAvailable());
        if (updated.getArtist() != null) existing.setArtist(updated.getArtist());
        return repo.save(existing);
    }

    public void delete(Long id) { repo.deleteById(id); }
}