package com.example.backend.service;

import com.example.backend.model.Strategy;
import com.example.backend.repository.StrategyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StrategyService {

    private final StrategyRepository strategyRepository;

    public StrategyService(StrategyRepository strategyRepository) {
        this.strategyRepository = strategyRepository;
    }

    public List<Strategy> getAllStrategies() {
        return strategyRepository.findAll();
    }

    public Optional<Strategy> getStrategyById(UUID id) {
        return strategyRepository.findById(id);
    }

    public Strategy createStrategy(Strategy strategy) {
        return strategyRepository.save(strategy);
    }

    public void deleteStrategy(UUID id) {
        strategyRepository.deleteById(id);
    }

    public Strategy updateStrategy(UUID id, Strategy updatedStrategy) {
        return strategyRepository.findById(id)
                .map(strategy -> {
                    strategy.setStrategyType(updatedStrategy.getStrategyType());
                    strategy.setTickerSymbol(updatedStrategy.getTickerSymbol());
                    strategy.setCapital(updatedStrategy.getCapital());
                    strategy.setThresholdParam(updatedStrategy.getThresholdParam());
                    strategy.setStartDate(updatedStrategy.getStartDate()); 
                    strategy.setEndDate(updatedStrategy.getEndDate());
                    return strategyRepository.save(strategy);
                })
                .orElseThrow(() -> new RuntimeException("Strategy not found with id: " + id));
    }
}
