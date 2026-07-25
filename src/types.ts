export type TempUnit = 'C' | 'F';

export interface GeoCity {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day?: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  windspeed_10m_max?: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weathercode: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
}

export interface WeatherData {
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly?: HourlyForecast;
  current_units?: Record<string, string>;
  daily_units?: Record<string, string>;
}

export interface WeatherCondition {
  label: string;
  iconName: 'Sun' | 'Cloud' | 'CloudSun' | 'CloudRain' | 'CloudDrizzle' | 'CloudSnow' | 'CloudLightning' | 'Wind' | 'Fog';
  color: string;
  bgGradient: string;
  bgAccent: string;
  badgeBg: string;
  badgeText: string;
}
