import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { TempUnit, WeatherData } from '../types';
import { convertTemp, getWeatherCondition, formatHourString } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastBarProps {
  weatherData: WeatherData;
  unit: TempUnit;
}

export const HourlyForecastBar: React.FC<HourlyForecastBarProps> = ({ weatherData, unit }) => {
  const times = weatherData.hourly?.time?.slice(0, 24) || [];

  if (times.length === 0) return null;

  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              Hourly Dynamics
            </h3>
            <p className="text-xs text-white/40">24-hour meteorological trajectory</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
        {times.map((timeStr, idx) => {
          const temp = convertTemp(weatherData.hourly?.temperature_2m?.[idx] ?? 0, unit);
          const code = weatherData.hourly?.weathercode?.[idx] ?? 0;
          const pop = weatherData.hourly?.precipitation_probability?.[idx] ?? 0;
          const condition = getWeatherCondition(code);
          const hourLabel = idx === 0 ? 'Now' : formatHourString(timeStr);

          return (
            <div
              key={timeStr}
              className={`flex-none w-20 p-3.5 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-blue-500/20 border-blue-400/40 shadow-lg backdrop-blur-md'
                  : 'bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-md hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-semibold text-white/70">
                {hourLabel}
              </p>
              <div className="my-2.5 flex justify-center">
                <WeatherIcon name={condition.iconName} className={`w-8 h-8 ${condition.color}`} />
              </div>
              <p className="text-base font-bold text-white">
                {temp}°
              </p>
              {pop > 10 ? (
                <div className="flex items-center justify-center gap-0.5 text-[10px] text-cyan-400 font-semibold mt-1 font-mono">
                  <Droplets className="w-3 h-3" />
                  <span>{pop}%</span>
                </div>
              ) : (
                <div className="h-4 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
