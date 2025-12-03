import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, Droplets, Eye, Gauge } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('Mumbai');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeatherIcon = (condition, size = 64) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('rain') || lower.includes('shower')) return <CloudRain size={size} className="text-blue-400" />;
    if (lower.includes('snow')) return <CloudSnow size={size} className="text-blue-200" />;
    if (lower.includes('cloud')) return <Cloud size={size} className="text-gray-400" />;
    if (lower.includes('drizzle')) return <CloudDrizzle size={size} className="text-blue-300" />;
    if (lower.includes('clear') || lower.includes('sunny')) return <Sun size={size} className="text-yellow-400" />;
    return <Cloud size={size} className="text-gray-400" />;
  };

  const fetchWeather = async (q) => {
    if (!q) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=ca7aeccd84a74f2db34182823252711&q=${q}&aqi=no`);
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Unable to fetch weather. Try "Mumbai", "Delhi", or "Bangalore"');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Search Card */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-6">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">☁️ Weather App</h1>
          <div className="flex gap-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="flex-1 px-6 py-4 rounded-2xl bg-white/30 backdrop-blur text-white placeholder-white/70 border-2 border-white/30 focus:border-white/60 focus:outline-none text-lg transition-all"
            />
            <button
              onClick={() => fetchWeather(city)}
              disabled={loading}
              className="px-8 py-4 bg-white/90 hover:bg-white text-purple-600 font-semibold rounded-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-200 mt-4 text-center bg-red-500/30 py-2 px-4 rounded-xl">{error}</p>}
        </div>

        {/* Weather Display */}
        {weather && (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">{weather.location.name}, {weather.location.country}</h2>
              <p className="text-white/80 text-lg">{new Date(weather.location.localtime).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              {getWeatherIcon(weather.current.condition.text, 120)}
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-bold text-white mb-2">{Math.round(weather.current.temp_c)}°C</div>
              <div className="text-2xl text-white/90 mb-1">{weather.current.condition.text}</div>
              <div className="text-lg text-white/70">Feels like {Math.round(weather.current.feelslike_c)}°C</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <Wind className="mx-auto mb-2 text-white" size={32} />
                <div className="text-white/70 text-sm mb-1">Wind</div>
                <div className="text-white font-bold text-lg">{weather.current.wind_kph} km/h</div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <Droplets className="mx-auto mb-2 text-white" size={32} />
                <div className="text-white/70 text-sm mb-1">Humidity</div>
                <div className="text-white font-bold text-lg">{weather.current.humidity}%</div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <Eye className="mx-auto mb-2 text-white" size={32} />
                <div className="text-white/70 text-sm mb-1">Visibility</div>
                <div className="text-white font-bold text-lg">{weather.current.vis_km} km</div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <Gauge className="mx-auto mb-2 text-white" size={32} />
                <div className="text-white/70 text-sm mb-1">Pressure</div>
                <div className="text-white font-bold text-lg">{weather.current.pressure_mb} mb</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
