import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { GeoCity } from '../types';

interface SearchBarProps {
  onSelectCity: (city: GeoCity) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  isLocating?: boolean;
}

const POPULAR_CITIES: GeoCity[] = [
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB' },
  { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', country_code: 'US' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLoading,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setSuggestions(data.results);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Failed to fetch city suggestions', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      // Trigger search with city name
      handleSelect({
        name: query.trim(),
        latitude: 0,
        longitude: 0,
      });
    }
  };

  const handleSelect = (city: GeoCity) => {
    onSelectCity(city);
    setQuery(city.name);
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-3" ref={wrapperRef}>
      <div className="relative flex items-center gap-2">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder="Search city (e.g. San Francisco, Tokyo, Berlin)..."
              className="w-full pl-11 pr-24 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all backdrop-blur-md text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setIsOpen(false);
                }}
                className="absolute right-16 p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-1.5 px-3.5 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-xs tracking-wider uppercase rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer border border-blue-400/30 shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/5 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Locating node targets...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={`${item.id || idx}-${item.name}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
                      <div>
                        <span className="font-medium text-white/90 text-sm">
                          {item.name}
                        </span>
                        {item.admin1 && (
                          <span className="text-white/50 text-xs ml-1">
                            , {item.admin1}
                          </span>
                        )}
                        {item.country && (
                          <span className="text-white/30 text-xs ml-1">
                            ({item.country})
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-white/30 group-hover:text-blue-400 font-mono">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-white/40">
                  No match found for "{query}"
                </div>
              )}
            </div>
          )}
        </form>

        {/* GPS Geolocation button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating || isLoading}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-md"
          title="Use current location"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          ) : (
            <Navigation className="w-5 h-5 text-blue-400" />
          )}
        </button>
      </div>

      {/* Quick Location Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-white/40">
        <span className="font-semibold uppercase tracking-wider text-[10px] mr-1 text-white/30">Presets:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => handleSelect(city)}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/80 text-xs transition-all cursor-pointer backdrop-blur-sm"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
