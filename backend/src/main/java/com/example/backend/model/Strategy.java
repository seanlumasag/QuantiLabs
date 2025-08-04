package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "strategy")
public class Strategy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String strategyType; // e.g. "momentum", "mean-reversion", "sma-deviation"
    private String tickerSymbol; // e.g. "AAPL", "TSLA"
    private Double capital; // e.g. 1000.0
    private Double thresholdParam; // e.g. 0.05 (5%)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Strategy() {
    }

    public Strategy(String strategyType, String tickerSymbol, Double capital, Double thresholdParam) {
        this.strategyType = strategyType;
        this.tickerSymbol = tickerSymbol;
        this.capital = capital;
        this.thresholdParam = thresholdParam;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public String getStrategyType() {
        return strategyType;
    }

    public void setStrategyType(String strategyType) {
        this.strategyType = strategyType;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public Double getCapital() {
        return capital;
    }

    public void setCapital(Double capital) {
        this.capital = capital;
    }

    public Double getThresholdParam() {
        return thresholdParam;
    }

    public void setThresholdParam(Double thresholdParam) {
        this.thresholdParam = thresholdParam;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}