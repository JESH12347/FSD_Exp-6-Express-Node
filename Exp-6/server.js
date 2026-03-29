import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // for API key

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;
const ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall";

app.post("/api/rain-tomorrow", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City required" });

    // 1. Get coordinates from city
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
    );

    if (!geoRes.data.length)
      return res.status(404).json({ error: "City not found" });

    const { lat, lon } = geoRes.data[0];

    // 2. Call OneCall3 for forecast
    const weatherRes = await axios.get(
      `${ONECALL_URL}?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}`,
    );

    const daily = weatherRes.data.daily;
    const tomorrow = daily[1]; // index 1 = tomorrow

    // 3. Rain detection
    const willRain =
      (tomorrow.weather || []).some((w) =>
        w.main.toLowerCase().includes("rain"),
      ) ||
      (tomorrow.pop && tomorrow.pop > 0.3); // optional: probability threshold

    res.json({
      city,
      willRain,
      forecast: tomorrow.weather,
      chanceOfRain: tomorrow.pop,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server is definitely running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
  });
