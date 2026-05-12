'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Snowflake, MapPin, Droplets, Wind, Thermometer } from 'lucide-react';

interface DayForecast {
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'snow';
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  humidity: number;
  wind: number;
  message: string;
  paintingStatus: 'great' | 'good' | 'indoor';
  forecast: DayForecast[];
}

const mockWeather: WeatherData = {
  temp: 22,
  feelsLike: 24,
  condition: 'sunny',
  humidity: 45,
  wind: 12,
  message: 'Great day for exterior painting!',
  paintingStatus: 'great',
  forecast: [
    { day: 'Tue', tempHigh: 24, tempLow: 14, condition: 'sunny' },
    { day: 'Wed', tempHigh: 21, tempLow: 12, condition: 'partly-cloudy' },
    { day: 'Thu', tempHigh: 18, tempLow: 10, condition: 'cloudy' },
  ],
};

const statusConfig = {
  great: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
    dot: 'bg-emerald-400',
    label: 'Perfect for painting',
  },
  good: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'text-amber-600',
    dot: 'bg-amber-400',
    label: 'Okay for painting',
  },
  indoor: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
    dot: 'bg-blue-400',
    label: 'Indoor projects only',
  },
};

function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const cn = className || 'w-6 h-6';
  switch (condition) {
    case 'sunny':
      return <Sun className={`${cn} text-amber-500`} />;
    case 'partly-cloudy':
    case 'cloudy':
      return <Cloud className={`${cn} text-gray-400`} />;
    case 'rainy':
      return <CloudRain className={`${cn} text-blue-400`} />;
    case 'snow':
      return <Snowflake className={`${cn} text-blue-300`} />;
    default:
      return <Sun className={`${cn} text-amber-500`} />;
  }
}

export function WeatherWidget() {
  const weather = mockWeather;
  const status = statusConfig[weather.paintingStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border ${status.border} ${status.bg} p-5 max-w-sm mx-auto lg:mx-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="font-medium">Toronto, ON</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
          <span className={`text-[10px] font-semibold ${status.accent}`}>{status.label}</span>
        </div>
      </div>

      {/* Main weather */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          <WeatherIcon condition={weather.condition} className="w-12 h-12" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-navy">{weather.temp}°C</span>
            <span className="text-sm text-gray-400">/ {weather.feelsLike}°C feels</span>
          </div>
          <p className="text-sm font-medium text-navy/80 mt-0.5">{weather.message}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-gray-400" />
          {weather.wind} km/h
        </span>
        <span className="flex items-center gap-1">
          <Thermometer className="w-3.5 h-3.5 text-red-400" />
          Low: 14°C
        </span>
      </div>

      {/* 3-day forecast */}
      <div className="border-t border-gray-200/60 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Next 3 Days</p>
        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-500">{day.day}</span>
              <WeatherIcon condition={day.condition} className="w-4 h-4" />
              <span className="text-xs text-navy font-semibold">{day.tempHigh}°</span>
              <span className="text-[10px] text-gray-400">{day.tempLow}°</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
