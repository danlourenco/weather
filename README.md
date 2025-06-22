# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.



## Weather App

A modern weather display application built with SvelteKit, featuring current conditions, local forecasts, and weather hazards. This app mimics the classic Weather Channel "Weatherscan" interface style, providing a nostalgic yet functional weather experience.

### Inspiration

This project is inspired by and pays tribute to [ws4kp](https://github.com/netbymatt/ws4kp), an amazing weather display system that recreates the classic Weather Channel  experience. All design elements, weather icon mappings, and the overall aesthetic are derived from that excellent project.

### Features

- **Current Conditions**: Real-time weather observations with temperature, humidity, wind, and visibility
- **Local Forecast**: Multi-day weather predictions with detailed daily and nightly forecasts  
- **Weather Hazards**: Active weather alerts and advisories for your location
- **Responsive Design**: Works on desktop and mobile devices
- **Weather Icons**: Comprehensive icon set with day/night variations
- **Error Handling**: Robust error handling with retry capabilities
- **Geolocation**: Automatic location detection or manual coordinate entry

### Architecture

The application follows modern best practices with:

- **Service Layer**: Centralized API calls and data transformation
- **Error Handling**: Typed error system with proper retry logic
- **Component Reusability**: Shared UI components for consistent experience
- **Type Safety**: Full TypeScript implementation
- **Responsive UI**: Mobile-first design with Tailwind CSS

### Data Source

Weather data is provided by the [National Weather Service API](https://www.weather.gov/documentation/services-web-api), ensuring accurate and up-to-date information for locations across the United States.