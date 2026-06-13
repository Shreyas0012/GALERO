package com.artora.artora_backend.repository;

import com.artora.artora_backend.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollectionRepository extends JpaRepository<Collection, Long> {}