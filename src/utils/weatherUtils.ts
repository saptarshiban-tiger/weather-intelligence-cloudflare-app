import { TempUnit, WeatherCondition } from '../types';

export const convertTemp = (celsius: number, unit: TempUnit): number => {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const formatTemp = (celsius: number, unit: TempUnit): string => {
  return `${convertTemp(celsius, unit)}°${unit}`;
};

export const getWeatherCondition = (code: number): WeatherCondition => {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        iconName: 'Sun',
        color: 'text-amber-500',
        bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
        bgAccent: 'border-amber-200 bg-amber-50/50',
        badgeBg: 'bg-amber-100 dark:bg-amber-950/40',
        badgeText: 'text-amber-800 dark:text-amber-300',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        iconName: 'CloudSun',
        color: 'text-amber-400',
        bgGradient: 'from-sky-500/10 via-amber-400/5 to-transparent',
        bgAccent: 'border-sky-200 bg-sky-50/50',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/40',
        badgeText: 'text-sky-800 dark:text-sky-300',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        color: 'text-sky-500',
        bgGradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
        bgAccent: 'border-sky-200 bg-sky-50/50',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/40',
        badgeText: 'text-sky-800 dark:text-sky-300',
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        color: 'text-slate-500',
        bgGradient: 'from-slate-500/10 via-slate-400/5 to-transparent',
        bgAccent: 'border-slate-200 bg-slate-50/50',
        badgeBg: 'bg-slate-100 dark:bg-slate-900',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy & Misty',
        iconName: 'Fog',
        color: 'text-slate-400',
        bgGradient: 'from-slate-400/10 via-slate-300/5 to-transparent',
        bgAccent: 'border-slate-200 bg-slate-50/50',
        badgeBg: 'bg-slate-100 dark:bg-slate-900',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        color: 'text-cyan-500',
        bgGradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
        bgAccent: 'border-cyan-200 bg-cyan-50/50',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-950/40',
        badgeText: 'text-cyan-800 dark:text-cyan-300',
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'CloudRain',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500/10 via-blue-600/5 to-transparent',
        bgAccent: 'border-blue-200 bg-blue-50/50',
        badgeBg: 'bg-blue-100 dark:bg-blue-950/40',
        badgeText: 'text-blue-800 dark:text-blue-300',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        color: 'text-blue-600',
        bgGradient: 'from-blue-600/10 via-indigo-500/5 to-transparent',
        bgAccent: 'border-blue-300 bg-blue-50/50',
        badgeBg: 'bg-blue-100 dark:bg-blue-950/40',
        badgeText: 'text-blue-800 dark:text-blue-300',
      };
    case 65:
    case 66:
    case 67:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRain',
        color: 'text-indigo-600',
        bgGradient: 'from-indigo-600/15 via-blue-600/5 to-transparent',
        bgAccent: 'border-indigo-200 bg-indigo-50/50',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-950/40',
        badgeText: 'text-indigo-800 dark:text-indigo-300',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Snowfall',
        iconName: 'CloudSnow',
        color: 'text-sky-400',
        bgGradient: 'from-sky-400/10 via-indigo-300/5 to-transparent',
        bgAccent: 'border-sky-200 bg-sky-50/50',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/40',
        badgeText: 'text-sky-800 dark:text-sky-300',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        iconName: 'CloudRain',
        color: 'text-blue-500',
        bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
        bgAccent: 'border-blue-200 bg-blue-50/50',
        badgeBg: 'bg-blue-100 dark:bg-blue-950/40',
        badgeText: 'text-blue-800 dark:text-blue-300',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        color: 'text-purple-600',
        bgGradient: 'from-purple-600/15 via-indigo-600/5 to-transparent',
        bgAccent: 'border-purple-200 bg-purple-50/50',
        badgeBg: 'bg-purple-100 dark:bg-purple-950/40',
        badgeText: 'text-purple-800 dark:text-purple-300',
      };
    default:
      return {
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        color: 'text-sky-500',
        bgGradient: 'from-sky-500/10 via-slate-400/5 to-transparent',
        bgAccent: 'border-slate-200 bg-slate-50/50',
        badgeBg: 'bg-slate-100 dark:bg-slate-900',
        badgeText: 'text-slate-700 dark:text-slate-300',
      };
  }
};

export interface Recommendations {
  clothing: string;
  activity: string;
  umbrella: string;
  uvAdvice?: string;
  windAdvice?: string;
}

export const generateRecommendations = (
  weathercode: number,
  tempCelsius: number,
  windSpeed: number = 0,
  uvIndex: number = 0,
  pop: number = 0
): Recommendations => {
  let clothing = 'Comfortable casual wear is great for today.';
  let activity = 'Good weather for outdoor walks and general activities.';
  let umbrella = 'No umbrella needed today. Clear sailing!';
  let uvAdvice = undefined;
  let windAdvice = undefined;

  // Rain / Drizzle / Thunderstorm check
  if (weathercode >= 51 && weathercode <= 67) {
    umbrella = 'High chance of rain! Pack an umbrella or rain jacket before heading out.';
    clothing = 'Waterproof shoes, raincoat, or water-resistant outerwear recommended.';
    activity = 'Consider indoor sports, museums, or cozy cafe visits.';
  } else if (weathercode >= 80 && weathercode <= 82) {
    umbrella = 'Passing rain showers expected. Keep a compact umbrella handy.';
    clothing = 'Quick-drying fabrics or a lightweight water-repellent jacket.';
    activity = 'Outdoor plans are fine, but stay close to covered areas.';
  } else if (weathercode >= 95) {
    umbrella = 'Severe thunderstorm risk! Avoid umbrella in open fields and stay indoors.';
    clothing = 'Heavy protective storm wear if you must travel.';
    activity = 'Avoid open outdoor areas, bodies of water, and tall trees.';
  } else if (pop > 40) {
    umbrella = 'Precipitation likelihood over 40%. An umbrella in your bag is recommended.';
  }

  // Temperature checks
  if (tempCelsius >= 32) {
    clothing = 'Hot weather! Wear breathable cotton or linen, short sleeves, and sunglasses.';
    activity = 'Limit intense outdoor exercise during peak afternoon heat. Stay hydrated!';
  } else if (tempCelsius >= 24 && tempCelsius < 32) {
    clothing = 'Warm and pleasant. T-shirt, shorts, or light dresses will be comfortable.';
    activity = 'Ideal conditions for parks, beach, or outdoor patio dining.';
  } else if (tempCelsius >= 15 && tempCelsius < 24) {
    clothing = 'Mild temperature. A light sweater, hoodie, or long-sleeve shirt is ideal.';
    activity = 'Great conditions for cycling, jogging, or sightseeing.';
  } else if (tempCelsius >= 5 && tempCelsius < 15) {
    clothing = 'Chilly breeze. Wear layers, a warm jacket or coat, and long trousers.';
    activity = 'Brisk outdoor walks are refreshing, but wear warm layers.';
  } else if (tempCelsius < 5) {
    clothing = 'Freezing cold! Wear a heavy winter coat, thermal layers, scarf, and gloves.';
    activity = 'Minimize extended outdoor exposure and enjoy warm indoor spaces.';
  }

  // Wind speed check (km/h)
  if (windSpeed >= 35) {
    windAdvice = 'Gusty winds detected. Secure loose outdoor objects and hold onto your hats!';
  }

  // UV index check
  if (uvIndex >= 6) {
    uvAdvice = 'High UV Index! Apply SPF 30+ sunscreen, wear a wide-brim hat, and seek shade midday.';
  }

  return { clothing, activity, umbrella, uvAdvice, windAdvice };
};

export const formatDateString = (dateStr: string): { weekday: string; dateFormatted: string; isToday: boolean } => {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();

  const weekday = isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return { weekday, dateFormatted, isToday };
};

export const formatHourString = (timeStr: string): string => {
  const d = new Date(timeStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};
