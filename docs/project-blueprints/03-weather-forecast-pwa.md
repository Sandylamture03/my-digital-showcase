# Weather Forecast PWA Blueprint

## Overview
Progressive web app providing accurate weather forecasts with beautiful visualizations and offline support.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Weather API**: OpenWeatherMap API (free tier available)
- **Charts**: Recharts for temperature graphs
- **Backend**: Lovable Cloud (Edge Function for API proxy)
- **PWA**: Vite PWA plugin

---

## Features

### 1. Current Weather
- **Location**: City name with country
- **Temperature**: Current, feels like, min/max
- **Conditions**: Weather icon, description
- **Details**: Humidity, wind speed, pressure, visibility
- **UV Index**: With safety recommendations

### 2. Hourly Forecast
- Next 24-48 hours
- Temperature trend line chart
- Precipitation probability
- Wind speed

### 3. Daily Forecast
- 7-day forecast
- Daily high/low temperatures
- Weather conditions
- Precipitation chance

### 4. Location Features
- **Search**: Search cities worldwide
- **Geolocation**: Get current location weather
- **Favorites**: Save multiple locations
- **Auto-refresh**: Update weather periodically

### 5. PWA Features
- **Install Prompt**: Add to home screen
- **Offline Mode**: Show cached data when offline
- **Background Sync**: Update when back online

### 6. Themes & Preferences
- Dark/Light mode
- Temperature units (°C/°F)
- Wind speed units (km/h, mph, m/s)

---

## API Setup

### OpenWeatherMap API
1. Sign up at https://openweathermap.org/api
2. Get free API key (1000 calls/day free)
3. Use One Call API 3.0 for comprehensive data

### Edge Function (API Proxy)

```typescript
// supabase/functions/weather/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { lat, lon, city } = await req.json();
  const apiKey = Deno.env.get('OPENWEATHER_API_KEY');

  let url: string;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else if (city) {
    // First get coordinates
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.length === 0) {
      return new Response(JSON.stringify({ error: 'City not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    url = `https://api.openweathermap.org/data/3.0/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&appid=${apiKey}&units=metric`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

---

## Database Schema (for saved locations)

```sql
-- Saved locations (favorites)
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country TEXT,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their locations" ON saved_locations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## Pages & Routes

```
/                  - Main weather view (current + forecast)
/search            - City search
/locations         - Saved locations list
/settings          - Preferences (units, theme)
```

---

## UI Components

1. **CurrentWeather** - Large display of current conditions
2. **WeatherIcon** - Dynamic weather icon based on conditions
3. **HourlyForecast** - Horizontal scrollable hourly cards
4. **DailyForecast** - 7-day forecast list
5. **TemperatureChart** - Line chart for temperature trends
6. **WeatherDetails** - Grid of detailed metrics
7. **LocationSearch** - Autocomplete city search
8. **LocationCard** - Saved location with quick view
9. **UnitToggle** - °C/°F toggle switch

---

## Weather Icons Mapping

Use weather condition codes from API:

```typescript
const getWeatherIcon = (code: number, isDay: boolean) => {
  const icons = {
    // Clear
    800: isDay ? 'sun' : 'moon',
    // Clouds
    801: isDay ? 'cloud-sun' : 'cloud-moon',
    802: 'cloud',
    803: 'clouds',
    804: 'clouds',
    // Rain
    500: 'cloud-rain',
    501: 'cloud-rain',
    502: 'cloud-showers-heavy',
    // Thunderstorm
    200: 'cloud-bolt',
    // Snow
    600: 'snowflake',
    // Mist/Fog
    701: 'smog',
  };
  return icons[code] || 'cloud';
};
```

---

## PWA Configuration

Add to vite.config.ts:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Weather Forecast',
        short_name: 'Weather',
        description: 'Beautiful weather forecasts',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openweathermap\.org/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'weather-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 30 // 30 minutes
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## Key Implementation Notes

1. **Need OPENWEATHER_API_KEY** secret in Lovable Cloud
2. **Use Edge Function** to hide API key from client
3. **Cache API responses** to reduce API calls
4. **Geolocation permission** - handle denied gracefully
5. **Responsive design** - works great on mobile
6. **Beautiful gradients** - Change background based on weather/time

---

## Dynamic Background Example

```typescript
const getBackgroundGradient = (condition: string, isDay: boolean) => {
  if (!isDay) return 'from-slate-900 via-blue-900 to-slate-900';
  
  switch (condition) {
    case 'clear':
      return 'from-sky-400 via-blue-500 to-blue-600';
    case 'clouds':
      return 'from-slate-400 via-slate-500 to-slate-600';
    case 'rain':
      return 'from-slate-600 via-slate-700 to-slate-800';
    case 'thunderstorm':
      return 'from-slate-800 via-purple-900 to-slate-900';
    case 'snow':
      return 'from-slate-200 via-blue-100 to-slate-300';
    default:
      return 'from-blue-400 via-blue-500 to-blue-600';
  }
};
```

---

## Estimated Build Time
- **Basic Weather App**: 2-3 hours with Lovable
- **Full PWA with Offline**: 4-5 hours with Lovable
