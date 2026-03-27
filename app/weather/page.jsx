"use client";

import { useState } from "react";

const API_KEY = "844990ce278004200d2f07be639ca94c";

export default function Home() {
  const [query, setQuery]     = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

async function fetchWeather() {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: convert city name to lat/lon using Geocoding API
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query.trim()}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) throw new Error("City not found. Please try another name.");

      const { lat, lon } = geoData[0];

      // Step 2: fetch weather using lat/lon
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found. Please try another name.");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") fetchWeather();
  }

  function getWindDirection(deg) {
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    return dirs[Math.round(deg / 45) % 8];
  }

  return (
    <main className="page">
      <header className="header">
        <h1>Weather App</h1>
        <p>Search for current weather in any city</p>
      </header>

      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="e.g. London, Tokyo, New York"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          aria-label="Search city"
        />
        <button className="btn" onClick={fetchWeather} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </section>

      {error && <p className="error-msg" role="alert">{error}</p>}

      {weather && (
        <article className="card">
          <header className="card-header">
            <div>
              <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
              <p className="description">{weather.weather[0].description}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
          </header>

          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p className="feels-like">Feels like {Math.round(weather.main.feels_like)}°C</p>

          <dl className="details">
            <div className="detail-item">
              <dt>Humidity</dt>
              <dd>{weather.main.humidity}%</dd>
            </div>
            <div className="detail-item">
              <dt>Wind</dt>
              <dd>{weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}</dd>
            </div>
            <div className="detail-item">
              <dt>Visibility</dt>
              <dd>{(weather.visibility / 1000).toFixed(1)} km</dd>
            </div>
            <div className="detail-item">
              <dt>Pressure</dt>
              <dd>{weather.main.pressure} hPa</dd>
            </div>
            <div className="detail-item">
              <dt>High</dt>
              <dd>{Math.round(weather.main.temp_max)}°C</dd>
            </div>
            <div className="detail-item">
              <dt>Low</dt>
              <dd>{Math.round(weather.main.temp_min)}°C</dd>
            </div>
          </dl>
        </article>
      )}
    </main>
  );
}