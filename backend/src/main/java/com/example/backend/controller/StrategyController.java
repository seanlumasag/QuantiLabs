package com.example.backend.controller;

import com.example.backend.model.Strategy;
import com.example.backend.service.StrategyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/strategy")
public class StrategyController {

    private final StrategyService strategyService;

    public StrategyController(StrategyService strategyService) {
        this.strategyService = strategyService;
    }

    @GetMapping
    public List<Strategy> getAllStrategies() {
        return strategyService.getAllStrategies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Strategy> getStrategyById(@PathVariable UUID id) {
        Optional<Strategy> strategy = strategyService.getStrategyById(id);
        return strategy.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Strategy createStrategy(@RequestBody Strategy strategy) {
        return strategyService.createStrategy(strategy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Strategy> updateStrategy(@PathVariable UUID id, @RequestBody Strategy updatedStrategy) {
        try {
            Strategy strategy = strategyService.updateStrategy(id, updatedStrategy);
            return ResponseEntity.ok(strategy);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStrategy(@PathVariable UUID id) {
        strategyService.deleteStrategy(id);
        return ResponseEntity.noContent().build();
    }
}
