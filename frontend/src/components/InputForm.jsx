import { useState } from "react";

function InputForm({ onSubmit, loading, error, onLogout }) {
  const [form, setForm] = useState({
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
      (form.strategyType === "Momentum" ||
        form.strategyType === "Mean-Reversion") &&
      (!form.lookbackPeriod || isNaN(Number(form.lookbackPeriod)))
    ) {
      setValidationError("Lookback Period must be a valid number.");
      return;
    }

    if (form.strategyType === "SMA-Crossover") {
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
        form.strategyType === "Momentum" ||
        form.strategyType === "Mean-Reversion"
          ? Number(form.lookbackPeriod)
          : undefined,
      shortSmaPeriod:
        form.strategyType === "SMA-Crossover"
          ? Number(form.shortSmaPeriod)
          : undefined,
      longSmaPeriod:
        form.strategyType === "SMA-Crossover"
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
    <div className="input-form">
      <h2 className="form-title">Create New Strategy</h2>

      {validationError && <div className="error">{validationError}</div>}

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Strategy Type *</label>
            <select
              name="strategyType"
              value={form.strategyType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="" disabled>
                Select strategy type
              </option>
              <option value="Momentum">Momentum</option>
              <option value="Mean-Reversion">Mean-Reversion</option>
              <option value="SMA-Crossover">SMA-Crossover</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ticker Symbol *</label>
            <input
              type="text"
              name="tickerSymbol"
              value={form.tickerSymbol}
              onChange={handleChange}
              placeholder="e.g. AAPL"
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Initial Capital *</label>
            <input
              type="number"
              name="capital"
              value={form.capital}
              onChange={handleChange}
              placeholder="e.g. 10000"
              required
              min="0"
              step="any"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Threshold Parameter *</label>
            <input
              type="number"
              name="thresholdParam"
              value={form.thresholdParam}
              onChange={handleChange}
              placeholder="e.g. 0.05"
              required
              step="any"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Conditional inputs for Momentum & Mean-Reversion */}
        {(form.strategyType === "Momentum" ||
          form.strategyType === "Mean-Reversion") && (
          <div className="form-group">
            <label className="form-label">Lookback Period (days) *</label>
            <input
              type="number"
              name="lookbackPeriod"
              value={form.lookbackPeriod}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              min="1"
              className="form-input"
            />
          </div>
        )}

        {/* Conditional inputs for SMA-Crossover */}
        {form.strategyType === "SMA-Crossover" && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Short SMA Period *</label>
              <input
                type="number"
                name="shortSmaPeriod"
                value={form.shortSmaPeriod}
                onChange={handleChange}
                placeholder="e.g. 5"
                required
                min="1"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Long SMA Period *</label>
              <input
                type="number"
                name="longSmaPeriod"
                value={form.longSmaPeriod}
                onChange={handleChange}
                placeholder="e.g. 20"
                required
                min="1"
                className="form-input"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? "Creating Strategy..." : "Test Strategy"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InputForm;
