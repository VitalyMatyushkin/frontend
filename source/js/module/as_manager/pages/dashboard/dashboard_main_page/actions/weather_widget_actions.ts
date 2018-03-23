import axios from "axios";

// It's api key from my free account from openweathermap.org
const API_KEY = 'f81d4220a347cd76c6c87179f3da89bd';

export const WeatherWidgetActions = {
	getWeatherWidgetData(lng: number, lat: number) {
		// TODO shall use our axios wrapper, but by default wrapper sends request to squadInTouch domain
		// Alex create AjaxConfig interface for this but for some reason doesn't use it in wrapper
		// Until we can't configure ajax wrapper we use pure axios
		return axios.get('http://api.openweathermap.org/data/2.5/weather', {
			params: {
				lat: lat,
				lon: lng,
				APPID: API_KEY,
				units: 'metric'
			},
		}).then((response:any) => {
			return {
				weather: {
					main: response.data.weather[0].main,
					description: response.data.weather[0].description,
					icon: response.data.weather[0].icon
				},
				temp: Math.floor(response.data.main.temp),
				city: response.data.name,
				isSync: true
			};
		});

	}
};