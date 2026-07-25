import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Search,
  Globe,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { GeoCity, TempUnit, WeatherData } from './types';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherRecommendationCard } from './components/WeatherRecommendationCard';
import { TemperatureChart } from './components/TemperatureChart';
import { ForecastGrid } from './components/ForecastGrid';
import { HourlyForecastBar } from './components/HourlyForecastBar';

const DEFAULT_CITY: GeoCity = {
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  country: 'United States',
  admin1: 'New York',
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoCity>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Core API Fetch Function following exact Open-Meteo requirements
  const fetchWeatherForLocation = useCallback(async (location: GeoCity) => {
    setLoading(true);
    setError(null);

    try {
      let lat = location.latitude;
      let lon = location.longitude;
      let resolvedCity = { ...location };

      // Step 1: If lat/lon are missing (e.g. raw text submission), use Geocoding API
      if (!lat && !lon && location.name) {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            location.name
          )}&count=1&language=en&format=json`
        );

        if (!geoRes.ok) {
          throw new Error('Geocoding service unavailable. Please check your network.');
        }

        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error(`City not found: "${location.name}". Please check the spelling or try another city.`);
        }

        const top = geoData.results[0];
        lat = top.latitude;
        lon = top.longitude;
        resolvedCity = {
          name: top.name,
          latitude: top.latitude,
          longitude: top.longitude,
          country: top.country,
          admin1: top.admin1,
          timezone: top.timezone,
        };
      }

      // Step 2: Forecast API
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,uv_index_max,windspeed_10m_max&hourly=temperature_2m,relative_humidity_2m,weathercode,apparent_temperature,precipitation_probability&timezone=auto`;

      const weatherRes = await fetch(forecastUrl);

      if (!weatherRes.ok) {
        throw new Error('Unable to retrieve weather forecast data. Please try again later.');
      }

      const data: WeatherData = await weatherRes.json();

      if (!data.current_weather) {
        throw new Error('Invalid weather data structure returned from the service.');
      }

      setWeatherData(data);
      setSelectedCity(resolvedCity);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'City not found. Please try another city.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial default city weather on mount
  useEffect(() => {
    fetchWeatherForLocation(DEFAULT_CITY);
  }, [fetchWeatherForLocation]);

  // Handle Current GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode city name using Open-Meteo reverse or name approximation
          let cityName = 'Current Location';
          let countryName = '';

          try {
            const revRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)}&count=1&language=en&format=json`
            );
            const revData = await revRes.json();
            if (revData.results && revData.results.length > 0) {
              cityName = revData.results[0].name;
              countryName = revData.results[0].country || '';
            }
          } catch {
            // fallback gracefully
          }

          const userCity: GeoCity = {
            name: cityName,
            latitude,
            longitude,
            country: countryName,
          };

          await fetchWeatherForLocation(userCity);
        } catch {
          setError('Failed to fetch weather for your location.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location permission denied. Please search for a city manually.');
        } else {
          setError('Unable to retrieve your location. Please search for a city name.');
        }
      }
    );
  };

  return (
    <div className="relative min-h-screen text-white font-sans antialiased selection:bg-blue-500/30 selection:text-white pb-12">
      {/* Mesh Background & Ambient Glows */}
      <div className="mesh-bg">
        <div className="accent-glow-blue" />
        <div className="accent-glow-purple" />
      </div>

      {/* Top Glass Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-2xl shadow-lg backdrop-blur-md">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 flex items-center gap-2">
                ATMOS <span className="font-light text-blue-400">Intelligence</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                  Precision Meteorological Node
                </span>
              </h1>
              <p className="text-xs text-white/40 font-medium hidden sm:block">
                Real-time environmental insights & dynamic recommendations
              </p>
            </div>
          </div>

          {/* Unit Toggle & Controls */}
          <div className="flex items-center gap-3">
            {/* °C / °F Unit Switcher */}
            <div className="flex items-center p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUnit('C')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  unit === 'C'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUnit('F')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  unit === 'F'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchWeatherForLocation(selectedCity)}
              disabled={loading}
              className="p-2.5 glass-card rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              title="Refresh Weather Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Bar Component */}
        <section className="glass p-6">
          <SearchBar
            onSelectCity={fetchWeatherForLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoading={loading}
            isLocating={isLocating}
          />
        </section>

        {/* Error Banner */}
        {error && (
          <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-200 flex items-start gap-3.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-rose-300">
                City Not Found
              </h3>
              <p className="text-sm text-rose-200/80 leading-relaxed">
                {error}
              </p>
              <p className="text-xs text-rose-400/80 pt-1">
                Tip: Try typing popular cities like "London", "Tokyo", or "San Francisco".
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="h-80 glass rounded-3xl" />
            <div className="lg:col-span-2 h-80 glass rounded-3xl" />
            <div className="lg:col-span-3 h-64 glass rounded-3xl" />
          </div>
        )}

        {/* Active Weather Dashboard Display */}
        {weatherData && (
          <div className="space-y-8">
            {/* Top Grid: Current Weather Card + Recommendations Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <CurrentWeatherCard
                  location={selectedCity}
                  weatherData={weatherData}
                  unit={unit}
                />
              </div>

              <div>
                <WeatherRecommendationCard weatherData={weatherData} unit={unit} />
              </div>
            </div>

            {/* Middle Section: Hourly Forecast Ticker */}
            <HourlyForecastBar weatherData={weatherData} unit={unit} />

            {/* Bottom Grid: Temperature Trends Chart + 7-Day Forecast */}
            <div className="space-y-8">
              <TemperatureChart weatherData={weatherData} unit={unit} />
              <ForecastGrid weatherData={weatherData} unit={unit} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/30 font-mono tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            Station: Open-Meteo Precision API Node
          </p>
          <p>Updated Real-Time | Client-Side Glass Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
