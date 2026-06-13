package com.artora.artora_backend.controller;

import com.artora.artora_backend.entity.Artwork;
import com.artora.artora_backend.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArtworkController {

    private final ArtworkService service;

    @GetMapping
    public List<Artwork> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Artwork getOne(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/category/{category}")
    public List<Artwork> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    @PostMapping
    public Artwork create(@RequestBody Artwork artwork) {
        return service.create(artwork);
    }

    @PutMapping("/{id}")
    public Artwork update(@PathVariable Long id, @RequestBody Artwork artwork) {
        return service.update(id, artwork);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
