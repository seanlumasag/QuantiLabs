package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "strategies")
public class Strategy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;

    private String strategyType; // e.g. "momentum", "mean-reversion", "sma-deviation"
    private String tickerSymbol; // e.g. "AAPL", "TSLA"
    private Double capital; // e.g. 1000.0
    private Double thresholdParam; // e.g. 0.05 (5%)
    private LocalDate startDate;
    private LocalDate endDate;

    private int lookbackPeriod; // For momentum & mean-reversion
    private int shortSmaPeriod; // For SMA crossover
    private int longSmaPeriod; // For SMA crossover

    private double finalCapital;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Strategy() {
    }

    public Strategy(String strategyType, String tickerSymbol, Double capital, Double thresholdParam,
            LocalDate startDate, LocalDate endDate,
            int lookbackPeriod, int shortSmaPeriod, int longSmaPeriod, UUID userId) {
        this.strategyType = strategyType;
        this.tickerSymbol = tickerSymbol;
        this.capital = capital;
        this.thresholdParam = thresholdParam;
        this.startDate = startDate;
        this.endDate = endDate;
        this.lookbackPeriod = lookbackPeriod;
        this.shortSmaPeriod = shortSmaPeriod;
        this.longSmaPeriod = longSmaPeriod;
        this.userId = userId;
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

    public Double getFinalCapital() {
        return finalCapital;
    }

    public void setFinalCapital(Double finalCapital) {
        this.finalCapital = finalCapital;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getLookbackPeriod() {
        return lookbackPeriod;
    }

    public void setLookbackPeriod(int lookbackPeriod) {
        this.lookbackPeriod = lookbackPeriod;
    }

    public int getShortSmaPeriod() {
        return shortSmaPeriod;
    }

    public void setShortSmaPeriod(int shortSmaPeriod) {
        this.shortSmaPeriod = shortSmaPeriod;
    }

    public int getLongSmaPeriod() {
        return longSmaPeriod;
    }

    public void setLongSmaPeriod(int longSmaPeriod) {
        this.longSmaPeriod = longSmaPeriod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

}