package com.artora.artora_backend.service;

import com.artora.artora_backend.entity.Artist;
import com.artora.artora_backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository repo;

    public List<Artist> getAll() { return repo.findAll(); }

    public Artist getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found: " + id));
    }

    public Artist create(Artist artist) { return repo.save(artist); }

    public Artist update(Long id, Artist updated) {
        Artist existing = getById(id);
        existing.setName(updated.getName());
        existing.setBio(updated.getBio());
        existing.setNationality(updated.getNationality());
        existing.setBirthYear(updated.getBirthYear());
        existing.setProfileImage(updated.getProfileImage());
        return repo.save(existing);
    }

    public void delete(Long id) { repo.deleteById(id); }
}