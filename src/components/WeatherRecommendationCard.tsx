import React from 'react';
import {
  Sparkles,
  Umbrella,
  Shirt,
  Activity,
  AlertTriangle,
  Sun,
  CheckCircle2,
} from 'lucide-react';
import { TempUnit, WeatherData } from '../types';
import { generateRecommendations } from '../utils/weatherUtils';

interface WeatherRecommendationCardProps {
  weatherData: WeatherData;
  unit: TempUnit;
}

export const WeatherRecommendationCard: React.FC<WeatherRecommendationCardProps> = ({
  weatherData,
}) => {
  const current = weatherData.current_weather;
  const uvMax = weatherData.daily?.uv_index_max?.[0] ?? 0;
  const pop = weatherData.hourly?.precipitation_probability?.[0] ?? 0;

  const recs = generateRecommendations(
    current.weathercode,
    current.temperature,
    current.windspeed,
    uvMax,
    pop
  );

  return (
    <div className="glass p-6 flex flex-col justify-between space-y-5 h-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              Intelligence Insights
            </h3>
            <p className="text-xs text-white/40">
              Smart meteorological guidance
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Optimal
        </span>
      </div>

      {/* Main Highlights List */}
      <div className="space-y-3.5">
        {/* Umbrella / Rain Advice */}
        <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <Umbrella className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
              Rain & Umbrella
            </h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {recs.umbrella}
            </p>
          </div>
        </div>

        {/* Outfit Advice */}
        <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <Shirt className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
              Recommended Attire
            </h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {recs.clothing}
            </p>
          </div>
        </div>

        {/* Outdoor Activity Tip */}
        <div className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
              Activity Advisory
            </h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {recs.activity}
            </p>
          </div>
        </div>

        {/* Extra Wind / UV Warnings if relevant */}
        {recs.uvAdvice && (
          <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-md">
            <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                UV Sun Safety
              </h4>
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                {recs.uvAdvice}
              </p>
            </div>
          </div>
        )}

        {recs.windAdvice && (
          <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono">
                Wind Advisory
              </h4>
              <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                {recs.windAdvice}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
