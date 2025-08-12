package com.example.backend.repository;

import com.example.backend.model.Strategy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface StrategyRepository extends JpaRepository<Strategy, UUID> {
    List<Strategy> findByUserId(UUID id);
    List<Strategy> deleteByUserId(UUID userId);

}
