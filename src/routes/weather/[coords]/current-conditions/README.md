# Icon logic

This is how the appropriate image is shown
```javascript
/* spell-checker: disable */

const getWeatherRegionalIconFromIconLink = (link, _isNightTime) => {
	// extract day or night if not provided
	const isNightTime = _isNightTime ?? link.indexOf('/night/') >= 0;
	// internal function to add path to returned icon
	const addPath = (icon) => `images/r/${icon}`;

	// grab everything after the last slash ending at any of these: ?&,
	const afterLastSlash = link.toLowerCase().match(/[^/]+$/)[0];
	let conditionName = afterLastSlash.match(/(.*?)[&,.?]/)[1];
	// using probability as a crude heavy/light indication where possible
	const value = +(link.match(/,(\d{2,3})/) ?? [0, 100])[1];

	// if a 'DualImage' is captured, adjust to just the j parameter
	if (conditionName === 'dualimage') {
		const match = link.match(/&j=(.*)&/);
		[, conditionName] = match;
	}

	// find the icon
	switch (conditionName + (isNightTime ? '-n' : '')) {
		case 'skc':
		case 'hot':
		case 'haze':
			return addPath('Sunny.gif');

		case 'skc-n':
		case 'nskc':
		case 'nskc-n':
		case 'cold-n':
			return addPath('Clear-1992.gif');

		case 'bkn':
			return addPath('Mostly-Cloudy-1994-2.gif');

		case 'bkn-n':
		case 'few-n':
		case 'nfew-n':
		case 'nfew':
			return addPath('Partly-Clear-1994-2.gif');

		case 'sct':
		case 'few':
			return addPath('Partly-Cloudy.gif');

		case 'sct-n':
		case 'nsct':
		case 'nsct-n':
			return addPath('Mostly-Clear.gif');

		case 'ovc':
		case 'ovc-n':
			return addPath('Cloudy.gif');

		case 'fog':
		case 'fog-n':
			return addPath('Fog.gif');

		case 'rain_sleet':
			return addPath('Sleet.gif');

		case 'rain_showers':
		case 'rain_showers_high':
			return addPath('Scattered-Showers-1994-2.gif');

		case 'rain_showers-n':
		case 'rain_showers_high-n':
			return addPath('Scattered-Showers-Night-1994-2.gif');

		case 'rain':
		case 'rain-n':
			return addPath('Rain-1992.gif');

			// case 'snow':
			// 	return addPath('Light-Snow.gif');
			// 	break;

			// case 'cc_snowshowers.gif':
			// 	//case "heavy-snow.gif":
			// 	return addPath('AM-Snow-1994.gif');
			// 	break;

		case 'snow':
		case 'snow-n':
			if (value > 50) return addPath('Heavy-Snow-1994-2.gif');
			return addPath('Light-Snow.gif');

		case 'rain_snow':
		case 'rain_snow-n':
			return addPath('Rain-Snow-1992.gif');

		case 'snow_fzra':
		case 'snow_fzra-n':
			return addPath('Freezing-Rain-Snow-1992.gif');

		case 'fzra':
		case 'fzra-n':
		case 'rain_fzra':
		case 'rain_fzra-n':
			return addPath('Freezing-Rain-1992.gif');

		case 'snow_sleet':
		case 'snow_sleet-n':
			return addPath('Snow and Sleet.gif');

		case 'sleet':
		case 'sleet-n':
			return addPath('Sleet.gif');

		case 'tsra_sct':
		case 'tsra':
			return addPath('Scattered-Tstorms-1994-2.gif');

		case 'tsra_sct-n':
		case 'tsra-n':
			return addPath('Scattered-Tstorms-Night-1994-2.gif');

		case 'tsra_hi':
		case 'tsra_hi-n':
		case 'hurricane':
		case 'tropical_storm':
		case 'hurricane-n':
		case 'tropical_storm-n':
			return addPath('Thunderstorm.gif');

		case 'wind':
		case 'wind_few':
		case 'wind_sct':
		case 'wind_bkn':
		case 'wind_ovc':
		case 'wind-n':
		case 'wind_few-n':
		case 'wind_bkn-n':
		case 'wind_ovc-n':
			return addPath('Wind.gif');

		case 'wind_skc':
			return addPath('Sunny-Wind-1994.gif');

		case 'wind_skc-n':
		case 'wind_sct-n':
			return addPath('Clear-Wind-1994.gif');

		case 'blizzard':
		case 'blizzard-n':
			return addPath('Blowing Snow.gif');

		case 'cold':
			return addPath('cold.gif');

		default:
			console.log(`Unable to locate regional icon for ${conditionName} ${link} ${isNightTime}`);
			return false;
	}
};

const getWeatherIconFromIconLink = (link, _isNightTime) => {
	if (!link) return false;

	// internal function to add path to returned icon
	const addPath = (icon) => `images/${icon}`;
	// extract day or night if not provided
	const isNightTime = _isNightTime ?? link.indexOf('/night/') >= 0;

	// grab everything after the last slash ending at any of these: ?&,
	const afterLastSlash = link.toLowerCase().match(/[^/]+$/)[0];
	let conditionName = afterLastSlash.match(/(.*?)[&,.?]/)[1];
	// using probability as a crude heavy/light indication where possible
	const value = +(link.match(/,(\d{2,3})/) ?? [0, 100])[1];

	// if a 'DualImage' is captured, adjust to just the j parameter
	if (conditionName === 'dualimage') {
		const match = link.match(/&j=(.*)&/);
		[, conditionName] = match;
	}

	// find the icon
	switch (conditionName + (isNightTime ? '-n' : '')) {
		case 'skc':
		case 'hot':
		case 'haze':
		case 'cold':
			return addPath('CC_Clear1.gif');

		case 'skc-n':
		case 'nskc':
		case 'nskc-n':
		case 'cold-n':
			return addPath('CC_Clear0.gif');

		case 'sct':
		case 'few':
		case 'bkn':
			return addPath('CC_PartlyCloudy1.gif');

		case 'bkn-n':
		case 'few-n':
		case 'nfew-n':
		case 'nfew':
		case 'sct-n':
		case 'nsct':
		case 'nsct-n':
			return addPath('CC_PartlyCloudy0.gif');

		case 'ovc':
		case 'novc':
		case 'ovc-n':
			return addPath('CC_Cloudy.gif');

		case 'fog':
		case 'fog-n':
			return addPath('CC_Fog.gif');

		case 'rain_sleet':
		case 'rain_sleet-n':
		case 'sleet':
		case 'sleet-n':
			return addPath('Sleet.gif');

		case 'rain_showers':
		case 'rain_showers_high':
			return addPath('CC_Showers.gif');

		case 'rain_showers-n':
		case 'rain_showers_high-n':
			return addPath('CC_Showers.gif');

		case 'rain':
		case 'rain-n':
			return addPath('CC_Rain.gif');

			// case 'snow':
			// 	return addPath('Light-Snow.gif');
			// 	break;

			// case 'cc_snowshowers.gif':
			// 	//case "heavy-snow.gif":
			// 	return addPath('AM-Snow-1994.gif');
			// 	break;

		case 'snow':
		case 'snow-n':
			if (value > 50) return addPath('CC_Snow.gif');
			return addPath('CC_SnowShowers.gif');

		case 'rain_snow':
			return addPath('CC_RainSnow.gif');

		case 'snow_fzra':
		case 'snow_fzra-n':
		case 'fzra':
		case 'fzra-n':
		case 'rain_fzra':
		case 'rain_fzra-n':
			return addPath('CC_FreezingRain.gif');

		case 'snow_sleet':
			return addPath('Snow-Sleet.gif');

		case 'tsra_sct':
		case 'tsra':
			return addPath('EF_ScatTstorms.gif');

		case 'tsra_sct-n':
		case 'tsra-n':
			return addPath('CC_TStorm.gif');

		case 'tsra_hi':
		case 'tsra_hi-n':
		case 'hurricane':
		case 'tropical_storm':
		case 'hurricane-n':
		case 'tropical_storm-n':
			return addPath('CC_TStorm.gif');

		case 'wind_few':
		case 'wind_sct':
		case 'wind_bkn':
		case 'wind_ovc':
		case 'wind_skc':
		case 'wind_few-n':
		case 'wind_bkn-n':
		case 'wind_ovc-n':
		case 'wind_skc-n':
		case 'wind_sct-n':
			return addPath('CC_Windy.gif');

		case 'blizzard':
		case 'blizzard-n':
			return addPath('Blowing-Snow.gif');

		default:
			console.log(`Unable to locate icon for ${conditionName} ${link} ${isNightTime}`);
			return false;
	}
};

const getHourlyIcon = (skyCover, weather, iceAccumulation, probabilityOfPrecipitation, snowfallAmount, windSpeed, isNight = false) => {
	// internal function to add path to returned icon
	const addPath = (icon) => `images/r/${icon}`;

	// possible phenomenon
	let thunder = false;
	let snow = false;
	let ice = false;
	let fog = false;
	let wind = false;

	// test the phenomenon for various value if it is provided.
	weather.forEach((phenomenon) => {
		if (!phenomenon.weather) return;
		if (phenomenon.weather.toLowerCase().includes('thunder')) thunder = true;
		if (phenomenon.weather.toLowerCase().includes('snow')) snow = true;
		if (phenomenon.weather.toLowerCase().includes('ice')) ice = true;
		if (phenomenon.weather.toLowerCase().includes('fog')) fog = true;
		if (phenomenon.weather.toLowerCase().includes('wind')) wind = true;
	});

	// first item in list is highest priority, units are metric where applicable
	if (iceAccumulation > 0 || ice) return addPath('Freezing-Rain-1992.gif');
	if (snowfallAmount > 10) {
		if (windSpeed > 30 || wind) return addPath('Blowing Snow.gif');
		return addPath('Heavy-Snow-1994.gif');
	}
	if ((snowfallAmount > 0 || snow) && thunder) return addPath('ThunderSnow.gif');
	if (snowfallAmount > 0 || snow) return addPath('Light-Snow.gif');
	if (thunder) return (addPath('Thunderstorm.gif'));
	if (probabilityOfPrecipitation > 70) return addPath('Rain-1992.gif');
	if (probabilityOfPrecipitation > 50) return addPath('Shower.gif');
	if (probabilityOfPrecipitation > 30) {
		if (!isNight) return addPath('Scattered-Showers-1994.gif');
		return addPath('Scattered-Showers-Night.gif');
	}
	if (fog) return addPath('Fog.gif');
	if (skyCover > 70) return addPath('Cloudy.gif');
	if (skyCover > 50) {
		if (!isNight) return addPath('Mostly-Cloudy-1994.gif');
		return addPath('Partly-Clear-1994.gif');
	}
	if (skyCover > 30) {
		if (!isNight) return addPath('Partly-Cloudy.gif');
		return addPath('Mostly-Clear.gif');
	}
	if (isNight) return addPath('Clear-1992.gif');
	return addPath('Sunny.gif');
};

export {
	getWeatherIconFromIconLink,
	getWeatherRegionalIconFromIconLink,
	getHourlyIcon,
};
```