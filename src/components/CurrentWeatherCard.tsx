import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Sun,
  Eye,
  Compass,
  ArrowUp,
  ArrowDown,
  Gauge,
  Clock,
} from 'lucide-react';
import { GeoCity, TempUnit, WeatherData } from '../types';
import { getWeatherCondition, convertTemp, formatTemp } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  location: GeoCity;
  weatherData: WeatherData;
  unit: TempUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  weatherData,
  unit,
}) => {
  const current = weatherData.current_weather;
  const condition = getWeatherCondition(current.weathercode);

  const todayMax = weatherData.daily?.temperature_2m_max?.[0] ?? current.temperature;
  const todayMin = weatherData.daily?.temperature_2m_min?.[0] ?? current.temperature;
  const uvMax = weatherData.daily?.uv_index_max?.[0] ?? 0;
  const precipSum = weatherData.daily?.precipitation_sum?.[0] ?? 0;

  // Extract hourly feel/humidity for current hour if available
  const currentHourIdx = 0; // standard hourly index approximation
  const humidity = weatherData.hourly?.relative_humidity_2m?.[currentHourIdx] ?? 65;
  const apparentTemp = weatherData.hourly?.apparent_temperature?.[currentHourIdx] ?? current.temperature;

  const localTimeFormatted = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative overflow-hidden glass p-6 md:p-8 flex flex-col justify-between transition-all">
      {/* Subtle overlay accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${condition.bgGradient} pointer-events-none opacity-40`} />

      <div className="relative z-10 space-y-6">
        {/* Header: Location & Time */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/70 font-medium">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xl md:text-2xl font-semibold text-white">
                {location.name}
              </span>
              {location.admin1 && (
                <span className="text-white/50 font-normal text-base">
                  , {location.admin1}
                </span>
              )}
              {location.country && (
                <span className="text-white/40 font-normal text-sm">
                  ({location.country})
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                Updated {localTimeFormatted}
              </span>
              <span>•</span>
              <span>
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </span>
            </div>
          </div>

          {/* Condition Badge */}
          <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {condition.label}
          </div>
        </div>

        {/* Hero Section: Temp & Weather Icon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 py-2">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl md:text-8xl font-light tracking-tighter text-white">
                {convertTemp(current.temperature, unit)}°
              </span>
              <span className="text-2xl md:text-3xl font-light text-white/40 uppercase">
                {unit}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-400 flex items-center gap-2">
              Feels like <span className="font-semibold text-white/90">{formatTemp(apparentTemp, unit)}</span>
            </p>
            <div className="flex items-center gap-5 text-sm pt-2">
              <span className="flex items-center gap-1 text-white/60">
                <ArrowUp className="w-4 h-4 text-rose-400" />
                High: <strong className="text-white/90">{formatTemp(todayMax, unit)}</strong>
              </span>
              <span className="flex items-center gap-1 text-white/60">
                <ArrowDown className="w-4 h-4 text-blue-400" />
                Low: <strong className="text-white/90">{formatTemp(todayMin, unit)}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <WeatherIcon name={condition.iconName} className={`w-20 h-20 md:w-24 md:h-24 ${condition.color}`} />
            </div>
            <p className="text-white/40 text-xs mt-2 font-mono">
              WMO Code: {current.weathercode}
            </p>
          </div>
        </div>

        {/* Key Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>Wind Speed</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {Math.round(current.windspeed)} <span className="text-xs font-normal text-white/40">km/h</span>
            </p>
            <div className="flex items-center gap-1 text-[11px] text-white/40 font-mono">
              <Compass className="w-3 h-3" />
              <span>{current.winddirection}° Dir</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {humidity}%
            </p>
            <p className="text-[11px] text-white/40">
              {humidity > 70 ? 'High Humidity' : humidity < 30 ? 'Dry Air' : 'Comfortable'}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {uvMax.toFixed(1)}
            </p>
            <p className="text-[11px] text-white/40">
              {uvMax >= 8 ? 'Very High' : uvMax >= 6 ? 'High' : uvMax >= 3 ? 'Moderate' : 'Low'}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Droplets className="w-4 h-4 text-indigo-400" />
              <span>Precipitation</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {precipSum} <span className="text-xs font-normal text-white/40">mm</span>
            </p>
            <p className="text-[11px] text-white/40">
              {precipSum > 0 ? 'Rain Expected' : 'No Rain Today'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
