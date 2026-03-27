import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);

  const checkRain = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/rain-tomorrow", {
        city,
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || "Error" });
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌧️ Will It Rain Tomorrow?</h1>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city..."
      />
      <button onClick={checkRain}>Check</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p>
                In <b>{result.city}</b>, tomorrow it will{" "}
                {result.willRain ? "🌧️ rain" : "☀️ not rain"}!
              </p>
              <p>Chance of rain: {Math.round(result.chanceOfRain * 100)}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
