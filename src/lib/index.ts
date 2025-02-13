const baseUrl = `https://api.weather.gov`;

export const api = {
	getAdvisories: (lat: number, long: number) =>
		`${baseUrl}/alerts/active?point=${lat}%2C${long}&limit=5`,
	getWeatherByCoords: (lat: number, long: number) => `${baseUrl}/points/${lat},${long}`,
	getStationsByGridpoint: (gridpoint: string) => `${baseUrl}/gridpoints/${gridpoint}/stations`
};

export const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;
