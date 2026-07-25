import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  Wind,
  CloudFog,
} from 'lucide-react';

interface WeatherIconProps {
  name: 'Sun' | 'Cloud' | 'CloudSun' | 'CloudRain' | 'CloudDrizzle' | 'CloudSnow' | 'CloudLightning' | 'Wind' | 'Fog';
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'CloudRain':
      return <CloudRain className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} />;
    case 'CloudSnow':
      return <CloudSnow className={className} />;
    case 'CloudLightning':
      return <CloudLightning className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Fog':
      return <CloudFog className={className} />;
    default:
      return <Cloud className={className} />;
  }
};
