import { useState } from "react";

function InputForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    strategyType: "",
    tickerSymbol: "",
    capital: "",
    thresholdParam: "",
    startDate: "",
    endDate: "",
    lookbackPeriod: "", // for momentum & mean-reversion
    shortSmaPeriod: "", // for sma-crossover
    longSmaPeriod: "", // for sma-crossover
  });
  const [validationError, setValidationError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Basic required fields check
    if (
      !form.strategyType ||
      !form.tickerSymbol ||
      !form.capital ||
      !form.thresholdParam ||
      !form.startDate ||
      !form.endDate
    ) {
      setValidationError("All required fields must be filled.");
      return;
    }

    // Validate numbers for common params
    if (isNaN(Number(form.capital)) || isNaN(Number(form.thresholdParam))) {
      setValidationError("Capital and Threshold must be valid numbers.");
      return;
    }

    // Validate extra params depending on strategy
    if (
      (form.strategyType === "momentum" ||
        form.strategyType === "mean-reversion") &&
      (!form.lookbackPeriod || isNaN(Number(form.lookbackPeriod)))
    ) {
      setValidationError("Lookback Period must be a valid number.");
      return;
    }

    if (form.strategyType === "sma-crossover") {
      if (!form.shortSmaPeriod || isNaN(Number(form.shortSmaPeriod))) {
        setValidationError("Short SMA Period must be a valid number.");
        return;
      }
      if (!form.longSmaPeriod || isNaN(Number(form.longSmaPeriod))) {
        setValidationError("Long SMA Period must be a valid number.");
        return;
      }
    }

    // Prepare payload, parse numbers where needed
    const payload = {
      strategyType: form.strategyType,
      tickerSymbol: form.tickerSymbol,
      capital: Number(form.capital),
      thresholdParam: Number(form.thresholdParam),
      startDate: form.startDate,
      endDate: form.endDate,
      lookbackPeriod:
        form.strategyType === "momentum" ||
        form.strategyType === "mean-reversion"
          ? Number(form.lookbackPeriod)
          : undefined,
      shortSmaPeriod:
        form.strategyType === "sma-crossover"
          ? Number(form.shortSmaPeriod)
          : undefined,
      longSmaPeriod:
        form.strategyType === "sma-crossover"
          ? Number(form.longSmaPeriod)
          : undefined,
    };

    onSubmit(payload);

    // Reset form to empty after submit
    setForm({
      strategyType: "",
      tickerSymbol: "",
      capital: "",
      thresholdParam: "",
      startDate: "",
      endDate: "",
      lookbackPeriod: "",
      shortSmaPeriod: "",
      longSmaPeriod: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Test New Strategy</h2>
      {validationError && <p style={{ color: "red" }}>{validationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Strategy Type:
          <select
            name="strategyType"
            value={form.strategyType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select strategy type
            </option>
            <option value="momentum">Momentum</option>
            <option value="mean-reversion">Mean-Reversion</option>
            <option value="sma-crossover">SMA-Crossover</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Ticker Symbol:
          <input
            type="text"
            name="tickerSymbol"
            value={form.tickerSymbol}
            onChange={handleChange}
            placeholder="e.g. AAPL"
            required
          />
        </label>
      </div>

      <div>
        <label>
          Capital:
          <input
            type="number"
            name="capital"
            value={form.capital}
            onChange={handleChange}
            placeholder="e.g. 1000"
            required
            min="0"
            step="any"
          />
        </label>
      </div>

      <div>
        <label>
          Threshold Parameter:
          <input
            type="number"
            name="thresholdParam"
            value={form.thresholdParam}
            onChange={handleChange}
            placeholder="e.g. 0.05"
            required
            step="any"
          />
        </label>
      </div>

      <div>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      {/* Conditional inputs for Momentum & Mean-Reversion */}
      {(form.strategyType === "momentum" ||
        form.strategyType === "mean-reversion") && (
        <div>
          <label>
            Lookback Period (days):
            <input
              type="number"
              name="lookbackPeriod"
              value={form.lookbackPeriod}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              min="1"
            />
          </label>
        </div>
      )}

      {/* Conditional inputs for SMA-Crossover */}
      {form.strategyType === "sma-crossover" && (
        <>
          <div>
            <label>
              Short SMA Period:
              <input
                type="number"
                name="shortSmaPeriod"
                value={form.shortSmaPeriod}
                onChange={handleChange}
                placeholder="e.g. 5"
                required
                min="1"
              />
            </label>
          </div>
          <div>
            <label>
              Long SMA Period:
              <input
                type="number"
                name="longSmaPeriod"
                value={form.longSmaPeriod}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                min="1"
              />
            </label>
          </div>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Test Strategy"}
      </button>
    </form>
  );
}

export default InputForm;
