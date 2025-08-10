package com.example.backend.model;

import java.time.LocalDate;

public class DailyResult {
    private LocalDate date;
    private double capital;

    public DailyResult(LocalDate date, double capital) {
        this.date = date;
        this.capital = capital;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getCapital() {
        return capital;
    }

    public void setCapital(double capital) {
        this.capital = capital;
    }
}