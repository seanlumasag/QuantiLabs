package com.example.backend.repository;

import com.example.backend.model.Strategy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

/**
 * Repository interface for managing Strategy entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
@Repository
public interface StrategyRepository extends JpaRepository<Strategy, UUID> {
    List<Strategy> findByUserId(UUID userId);
}
