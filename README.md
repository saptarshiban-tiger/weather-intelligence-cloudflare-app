# Weather Intelligence App

A real-time weather forecasting web application built using React, Tailwind CSS, and Google AI Studio App Build, integrated with Open-Meteo APIs and deployed on Cloudflare Pages.

## Features
- **City Search & Geocoding:** Search any city globally using the public Open-Meteo Geocoding API.
- **Current Weather & 7-Day Forecast:** Live weather metrics and forecast data fetched via the Open-Meteo Forecast API.
- **Interactive Visualizations:** Weather charts and dynamic planning recommendations.
- **Graceful Error Handling:** Handles invalid searches with user-friendly error messages.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **APIs:** Open-Meteo Geocoding & Forecast APIs
- **Hosting:** Cloudflare Pages

## Deployment Guide

### 1. App Generation (Google AI Studio)
- Generated the Weather Intelligence App inside Google AI Studio App Build.
- Validated searching cities (e.g., Kolkata, London) and error handling.

### 2. GitHub Source Control
- Exported source files directly from Google AI Studio into this GitHub repository.

### 3. Cloudflare Pages Deployment
1. Log in to Cloudflare and navigate to **Workers & Pages**.
2. Select **Create app** -> **Pages** -> **Connect to Git**.
3. Select this GitHub repository.
4. Set **Build Command** to `npm run build`.
5. Set **Build Output Directory** to `dist`.
6. Click **Save and Deploy**.
