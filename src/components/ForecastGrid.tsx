import React, { useState } from 'react';
import { Calendar, Droplets, Sun, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { TempUnit, WeatherData } from '../types';
import { convertTemp, getWeatherCondition, formatDateString } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface ForecastGridProps {
  weatherData: WeatherData;
  unit: TempUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ weatherData, unit }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const daily = weatherData.daily;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate min and max overall for relative temperature bar filling
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = Math.max(allMax - allMin, 1);

  return (
    <div className="glass p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              7-Day Meteorological Outlook
            </h3>
            <p className="text-xs text-white/40">
              Multi-day temperature bounds and condition codes
            </p>
          </div>
        </div>
        <span className="text-xs text-white/40 font-mono hidden sm:inline">
          Select date card for complete matrix
        </span>
      </div>

      {/* 7-Day Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.time.map((dateStr, idx) => {
          const { weekday, dateFormatted, isToday } = formatDateString(dateStr);
          const max = convertTemp(daily.temperature_2m_max[idx], unit);
          const min = convertTemp(daily.temperature_2m_min[idx], unit);
          const code = daily.weathercode[idx];
          const condition = getWeatherCondition(code);
          const precip = daily.precipitation_sum?.[idx] ?? 0;
          const uv = daily.uv_index_max?.[idx] ?? 0;

          const isSelected = selectedDayIdx === idx;

          // Temperature range bar calculation
          const minPct = Math.max(0, Math.min(100, ((daily.temperature_2m_min[idx] - allMin) / tempRange) * 100));
          const maxPct = Math.max(0, Math.min(100, ((daily.temperature_2m_max[idx] - allMin) / tempRange) * 100));
          const barWidth = Math.max(10, maxPct - minPct);

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDayIdx(isSelected ? null : idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-md ${
                isToday
                  ? 'bg-blue-500/20 border-blue-400/40 shadow-lg'
                  : isSelected
                  ? 'bg-white/15 border-white/30 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-bold ${isToday ? 'text-blue-400' : 'text-white/90'}`}>
                    {weekday}
                  </span>
                  <span className="text-white/40 font-mono text-[10px]">
                    {dateFormatted}
                  </span>
                </div>

                <div className="my-3 flex flex-col items-center justify-center">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <WeatherIcon name={condition.iconName} className={`w-8 h-8 ${condition.color}`} />
                  </div>
                  <p className="text-xs font-medium text-white/80 mt-2 text-center line-clamp-1">
                    {condition.label}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                {/* Max / Min Values */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{max}°</span>
                  <span className="text-white/40 font-medium">{min}°</span>
                </div>

                {/* Relative Temp Visual Bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-400 to-rose-400 rounded-full"
                    style={{ left: `${minPct}%`, width: `${barWidth}%` }}
                  />
                </div>

                {/* Precip / UV Mini indicators */}
                <div className="flex items-center justify-between text-[11px] text-white/40 pt-0.5">
                  {precip > 0 ? (
                    <span className="flex items-center gap-0.5 text-cyan-400 font-mono">
                      <Droplets className="w-3 h-3" />
                      {precip}mm
                    </span>
                  ) : (
                    <span className="text-white/30 text-[10px]">Dry</span>
                  )}

                  <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                    <Sun className="w-3 h-3" />
                    UV {Math.round(uv)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Expanded Details */}
      {selectedDayIdx !== null && (
        <div className="p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <span>Detailed Metrics for {formatDateString(daily.time[selectedDayIdx]).weekday}, {formatDateString(daily.time[selectedDayIdx]).dateFormatted}</span>
            </h4>
            <button
              onClick={() => setSelectedDayIdx(null)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono cursor-pointer"
            >
              [Dismiss]
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/40 block mb-0.5">Thermal Bounds</span>
              <span className="font-bold text-white text-sm">
                {convertTemp(daily.temperature_2m_min[selectedDayIdx], unit)}° to {convertTemp(daily.temperature_2m_max[selectedDayIdx], unit)}°{unit}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/40 block mb-0.5">WMO Weather Classification</span>
              <span className="font-bold text-white text-sm">
                Code {daily.weathercode[selectedDayIdx]} ({getWeatherCondition(daily.weathercode[selectedDayIdx]).label})
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/40 block mb-0.5">Peak Wind Speed</span>
              <span className="font-bold text-white text-sm flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                {Math.round(daily.windspeed_10m_max?.[selectedDayIdx] ?? 0)} km/h
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/40 block mb-0.5">Maximum UV Index</span>
              <span className="font-bold text-white text-sm flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {(daily.uv_index_max?.[selectedDayIdx] ?? 0).toFixed(1)} Index
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
