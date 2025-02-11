const baseUrl = `https://api.weather.gov`;

const myCoords = {
	lat: 42.1158,
	long: -71.3345
};
export const api = {
	getAdvisories: (lat: number = myCoords.lat, long: number = myCoords.long) =>
		`${baseUrl}/alerts/active?point=${lat}%2C${long}&limit=5`,
	getWeatherByCoords: (lat: number, long: number) => `${baseUrl}/points/${lat},${long}`,
	getStationsByGridpoint: (gridpoint: string) => `${baseUrl}/gridpoints/${gridpoint}/stations`
};

// Fetch weather by lat,long
// https://api.weather.gov/points/42.1158,-71.3345
// Then get stations
// https://api.weather.gov/gridpoints/BOX/64,77/stations

/*

    fetch("https://api.weather.gov/gridpoints/CTP/107,36/forecast", 
    fetch("https://api.weather.gov/stations/KCXY/observations/latest"

    // LOCAL FORECAST
    https://api.weather.gov/gridpoints/BOX/64,77/forecast?units=us
    */
