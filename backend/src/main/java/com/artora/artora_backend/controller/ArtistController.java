package com.artora.artora_backend.controller;

import com.artora.artora_backend.entity.Artist;
import com.artora.artora_backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArtistController {

    private final ArtistService service;

    @GetMapping
    public List<Artist> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Artist getOne(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Artist create(@RequestBody Artist artist) {
        return service.create(artist);
    }

    @PutMapping("/{id}")
    public Artist update(@PathVariable Long id, @RequestBody Artist artist) {
        return service.update(id, artist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
