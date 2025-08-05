import { useState } from "react";

function InputForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    strategyType: "",
    tickerSymbol: "",
    capital: "",
    thresholdParam: "",
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
    if (
      !form.strategyType ||
      !form.tickerSymbol ||
      !form.capital ||
      !form.thresholdParam
    ) {
      setValidationError("All fields are required.");
      return;
    }
    if (isNaN(Number(form.capital)) || isNaN(Number(form.thresholdParam))) {
      setValidationError("Capital and Threshold must be numbers.");
      return;
    }
    onSubmit({
      ...form,
      capital: Number(form.capital),
      thresholdParam: Number(form.thresholdParam),
    });
    setForm({
      strategyType: "",
      tickerSymbol: "",
      capital: "",
      thresholdParam: "",
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
            <option value="sma-deviation">SMA-Deviation</option>
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
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Test Strategy"}
      </button>
    </form>
  );
}

export default InputForm;
