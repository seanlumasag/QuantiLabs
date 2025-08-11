package com.example.backend.service;

import com.example.backend.model.Strategy;
import com.example.backend.model.DailyResult;
import com.example.backend.repository.StrategyRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class StrategyService {

    private final StrategyRepository strategyRepository;

    public StrategyService(StrategyRepository strategyRepository) {
        this.strategyRepository = strategyRepository;
    }

    public List<Strategy> getStrategiesByUserId(UUID userId) {
        return strategyRepository.findByUserId(userId);
    }

    public Optional<Strategy> getStrategyById(UUID id) {
        return strategyRepository.findById(id);
    }

    public Strategy createStrategy(Strategy strategy) {
        return strategyRepository.save(strategy);
    }

    @Value("${alpaca.api.key}")
    private String apiKey;

    @Value("${alpaca.api.secret}")
    private String apiSecret;

    @Value("${alpaca.api.base-url}")
    private String baseUrl;

    public List<DailyResult> runStrategy(Strategy strategy) {
        List<DailyResult> dailyResults = new ArrayList<>();
        try {
            // Format dates for Alpaca API (ISO-8601 with Zulu time)
            String start = strategy.getStartDate().toString() + "T00:00:00Z";
            String end = strategy.getEndDate().toString() + "T23:59:59Z";

            // Build request URL
            String url = String.format("%s/stocks/%s/bars?timeframe=1Day&start=%s&end=%s",
                    baseUrl, strategy.getTickerSymbol(), start, end);

            // Call Alpaca API
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("APCA-API-KEY-ID", apiKey)
                    .header("APCA-API-SECRET-KEY", apiSecret)
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Alpaca API error: " + response.body());
            }

            // Parse JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            JsonNode bars = root.get("bars");

            if (bars == null || bars.isEmpty()) {
                throw new RuntimeException("No market data found for given dates.");
            }

            double initialCapital = strategy.getCapital();
            double thresholdParam = strategy.getThresholdParam();
            String strategyType = strategy.getStrategyType();

            double capital = strategy.getCapital();
            boolean inMarket = false;
            double shares = 0.0;
            double entryPrice = 0.0;

            if (strategyType.equals("Momentum")) {
                int lookbackPeriod = strategy.getLookbackPeriod();
                for (int i = lookbackPeriod; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);

                    double closePrice = bar.get("c").asDouble();
                    double refClosePrice = bars.get(i - lookbackPeriod).get("c").asDouble();
                    if (inMarket) {
                        capital = shares * closePrice;
                        if ((closePrice - entryPrice) / entryPrice <= -thresholdParam) {
                            inMarket = false;
                            shares = 0.0;
                            entryPrice = 0.0;
                        }
                    } else if (!inMarket) {
                        if ((closePrice - refClosePrice) / refClosePrice >= thresholdParam) {
                            inMarket = true;
                            shares = capital / closePrice;
                            entryPrice = closePrice;
                        }
                    }

                    double portfolioValue = inMarket ? shares * closePrice : capital;
                    String timestampStr = bar.get("t").asText(); // e.g. "2025-06-02T04:00:00Z"
                    ZonedDateTime zdt = ZonedDateTime.parse(timestampStr, DateTimeFormatter.ISO_ZONED_DATE_TIME);
                    LocalDate date = zdt.toLocalDate();
                    DailyResult add = new DailyResult(date, portfolioValue);
                    dailyResults.add(add);
                }

            } else if (strategyType.equals("Mean-Reversion")) {
                int lookbackPeriod = strategy.getLookbackPeriod();
                for (int i = lookbackPeriod; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);
                    double closePrice = bar.get("c").asDouble();
                    double refClosePrice = bars.get(i - lookbackPeriod).get("c").asDouble();
                    if (inMarket) {
                        capital = shares * closePrice;
                        if ((closePrice - entryPrice) / entryPrice >= thresholdParam) {
                            inMarket = false;
                            shares = 0.0;
                            entryPrice = 0.0;
                        }
                    } else if (!inMarket) {
                        if ((closePrice - refClosePrice) / refClosePrice <= -thresholdParam) {
                            inMarket = true;
                            shares = capital / closePrice;
                            entryPrice = closePrice;
                        }
                    }
                    double portfolioValue = inMarket ? shares * closePrice : capital;
                    String timestampStr = bar.get("t").asText(); // e.g. "2025-06-02T04:00:00Z"
                    ZonedDateTime zdt = ZonedDateTime.parse(timestampStr, DateTimeFormatter.ISO_ZONED_DATE_TIME);
                    LocalDate date = zdt.toLocalDate();
                    DailyResult add = new DailyResult(date, portfolioValue);
                    dailyResults.add(add);
                }
            } else if (strategyType.equals("SMA-Crossover")) {
                int shortSmaPeriod = strategy.getShortSmaPeriod();
                int longSmaPeriod = strategy.getLongSmaPeriod();
                for (int i = longSmaPeriod; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);
                    double closePrice = bar.get("c").asDouble();
                    double shortSma = 0.0;
                    double longSma = 0.0;
                    for (int j = i - shortSmaPeriod; j < i; j++) {
                        shortSma += bars.get(j).get("c").asDouble();
                    }
                    shortSma /= shortSmaPeriod;
                    for (int j = i - longSmaPeriod; j < i; j++) {
                        longSma += bars.get(j).get("c").asDouble();
                    }
                    longSma /= longSmaPeriod;
                    if (inMarket) {
                        capital = shares * closePrice;
                        if ((shortSma - longSma) / longSma <= -thresholdParam) {
                            inMarket = false;
                            shares = 0.0;
                        }
                    } else if (!inMarket) {
                        if ((shortSma - longSma) / longSma >= thresholdParam) {
                            inMarket = true;
                            shares = capital / closePrice;
                        }
                    }
                    double portfolioValue = inMarket ? shares * closePrice : capital;
                    String timestampStr = bar.get("t").asText(); // e.g. "2025-06-02T04:00:00Z"
                    ZonedDateTime zdt = ZonedDateTime.parse(timestampStr, DateTimeFormatter.ISO_ZONED_DATE_TIME);
                    LocalDate date = zdt.toLocalDate();
                    DailyResult add = new DailyResult(date, portfolioValue);
                    dailyResults.add(add);
                }
            }
            if (inMarket) {
                capital = shares * bars.get(bars.size() - 1).get("c").asDouble();
                shares = 0.0;
            }

            double finalCapital = capital;

 
            strategy.setFinalCapital(finalCapital);
            strategy.setProfitLoss(finalCapital - initialCapital);
            strategy.setReturnPercentage((finalCapital - initialCapital) / initialCapital * 100);

        } catch (Exception e) {
            throw new RuntimeException("Error running strategy", e);
        }
        strategyRepository.save(strategy);
        return dailyResults;
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
                    runStrategy(updatedStrategy);
                    return strategyRepository.save(updatedStrategy);
                })
                .orElseThrow(() -> new RuntimeException("Strategy not found with id: " + id));
    }
}
