package com.example.backend.service;

import com.example.backend.model.Strategy;
import com.example.backend.repository.StrategyRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

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
        runStrategy(strategy);
        return strategyRepository.save(strategy);
    }

    @Value("${alpaca.api.key}")
    private String apiKey;

    @Value("${alpaca.api.secret}")
    private String apiSecret;

    @Value("${alpaca.api.base-url}")
    private String baseUrl;

    public void runStrategy(Strategy strategy) {
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

            if (strategyType.equals("momentum")) {
                for (int i = 5; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);
                    double closePrice = bar.get("c").asDouble();
                    double refClosePrice = bars.get(i - 5).get("c").asDouble();
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
                }

            } else if (strategyType.equals("mean-reversion")) {
                for (int i = 5; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);
                    double closePrice = bar.get("c").asDouble();
                    double refClosePrice = bars.get(i - 5).get("c").asDouble();
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
                }
            } else if (strategyType.equals("sma-crossover")) {
                for (int i = 10; i < bars.size(); i++) {
                    JsonNode bar = bars.get(i);
                    double closePrice = bar.get("c").asDouble();
                    double sma5 = 0.0;
                    double sma10 = 0.0;
                    for (int j = i - 5; j < i; j++) {
                        sma5 += bars.get(j).get("c").asDouble();
                    }
                    sma5 /= 5;
                    for (int j = i - 10; j < i; j++) {
                        sma10 += bars.get(j).get("c").asDouble();
                    }
                    sma10 /= 10;
                    if (inMarket) {
                        capital = shares * closePrice;
                        if ((sma5 - sma10) / sma10 <= -thresholdParam) {
                            inMarket = false;
                            shares = 0.0;
                        }
                    } else if (!inMarket) {
                        if ((sma5 - sma10) / sma10 >= thresholdParam) {
                            inMarket = true;
                            shares = capital / closePrice;
                        }
                    }
                }
            }
            if (inMarket) {
                capital = shares * bars.get(bars.size() - 1).get("c").asDouble();
                shares = 0.0;
            }

            double finalCapital = capital;

            // Set results
            strategy.setFinalCapital(finalCapital);
            strategy.setProfitLoss(finalCapital - initialCapital);
            strategy.setReturnPercentage((finalCapital - initialCapital) / initialCapital * 100);

        } catch (Exception e) {
            throw new RuntimeException("Error running strategy", e);
        }
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
