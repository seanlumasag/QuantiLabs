package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "strategy")
public class Strategy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String strategyType; // e.g. "momentum", "mean-reversion", "sma-deviation"
    private String tickerSymbol; // e.g. "AAPL", "TSLA"
    private Double capital; // e.g. 1000.0
    private Double thresholdParam; // e.g. 0.05 (5%)
    private LocalDate startDate;
    private LocalDate endDate;

    private double finalCapital;
    private double profitLoss;
    private double returnPercentage;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Strategy() {
    }

    public Strategy(String strategyType, String tickerSymbol, Double capital, Double thresholdParam, LocalDate startDate, LocalDate endDate) {
        this.strategyType = strategyType;
        this.tickerSymbol = tickerSymbol;
        this.capital = capital;
        this.thresholdParam = thresholdParam;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public Double getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(Double profitLoss) {
        this.profitLoss = profitLoss;
    }

    public Double getReturnPercentage() {
        return returnPercentage;
    }

    public void setReturnPercentage(Double returnPercentage) {
        this.returnPercentage = returnPercentage;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}