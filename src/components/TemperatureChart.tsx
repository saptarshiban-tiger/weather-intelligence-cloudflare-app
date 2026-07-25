import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Thermometer, Calendar, Clock } from 'lucide-react';
import { TempUnit, WeatherData } from '../types';
import { convertTemp, formatDateString, formatHourString } from '../utils/weatherUtils';

interface TemperatureChartProps {
  weatherData: WeatherData;
  unit: TempUnit;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ weatherData, unit }) => {
  const [viewMode, setViewMode] = useState<'7day' | '24hour'>('7day');

  // Prepare 7-day data
  const dailyChartData = weatherData.daily.time.map((dateStr, index) => {
    const { weekday, dateFormatted } = formatDateString(dateStr);
    const max = convertTemp(weatherData.daily.temperature_2m_max[index], unit);
    const min = convertTemp(weatherData.daily.temperature_2m_min[index], unit);

    return {
      name: `${weekday}`,
      fullDate: dateFormatted,
      maxTemp: max,
      minTemp: min,
      precip: weatherData.daily.precipitation_sum?.[index] ?? 0,
    };
  });

  // Prepare 24-hour data
  const hourlyTimes = weatherData.hourly?.time?.slice(0, 24) || [];
  const hourlyChartData = hourlyTimes.map((timeStr, index) => {
    const hourFormatted = formatHourString(timeStr);
    const temp = convertTemp(weatherData.hourly?.temperature_2m?.[index] ?? 0, unit);
    const feel = convertTemp(weatherData.hourly?.apparent_temperature?.[index] ?? 0, unit);
    const pop = weatherData.hourly?.precipitation_probability?.[index] ?? 0;

    return {
      hour: hourFormatted,
      temp: temp,
      feel: feel,
      pop: pop,
    };
  });

  return (
    <div className="glass p-6 flex flex-col justify-between space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              Thermal Trajectory
            </h3>
            <p className="text-xs text-white/40">
              High-resolution temperature fluctuations in °{unit}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white/50 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('7day')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '7day'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            7-Day Horizon
          </button>
          <button
            type="button"
            onClick={() => setViewMode('24hour')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '24hour'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            24-Hour Cycle
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === '7day' ? (
            <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                unit={`°`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/90 backdrop-blur-xl text-white p-3.5 rounded-2xl shadow-2xl text-xs space-y-1 border border-white/10">
                        <p className="font-semibold text-white/70">{label} ({data.fullDate})</p>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-rose-400 font-bold">Max: {data.maxTemp}°{unit}</span>
                          <span className="text-blue-400 font-bold">Min: {data.minTemp}°{unit}</span>
                        </div>
                        {data.precip > 0 && (
                          <p className="text-cyan-400 font-mono">Precip: {data.precip} mm</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name={`Max Temp (°${unit})`}
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMax)"
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name={`Min Temp (°${unit})`}
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMin)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                unit={`°`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/90 backdrop-blur-xl text-white p-3.5 rounded-2xl shadow-2xl text-xs space-y-1 border border-white/10">
                        <p className="font-semibold text-white/70">{data.hour}</p>
                        <p className="text-blue-400 font-bold">Temp: {data.temp}°{unit}</p>
                        <p className="text-white/50">Feels Like: {data.feel}°{unit}</p>
                        <p className="text-cyan-400 font-mono">Rain Prob: {data.pop}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name={`Temperature (°${unit})`}
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHourly)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
