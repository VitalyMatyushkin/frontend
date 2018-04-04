import axios from "axios";

// It's api key from my free account from openweathermap.org
const API_KEY = 'f81d4220a347cd76c6c87179f3da89bd';

export const WeatherWidgetActions = {
	getWeatherWidgetData(lng: number, lat: number) {
		// TODO shall use our axios wrapper, but by default wrapper sends request to squadInTouch domain
		// Alex create AjaxConfig interface for this but for some reason doesn't use it in wrapper
		// Until we can't configure ajax wrapper we use pure axios
		return axios.get('http://api.openweathermap.org/data/2.5/forecast', {
			params: {
				lat: lat,
				lon: lng,
				APPID: API_KEY,
				units: 'metric'
			},
		}).then((response:any) => {
			const weatherDataList = response.data.list;

			// response.data.list is 5 day forecast includes weather data every 3 hours
			// we need weather data only for 15-00
			// so, index 3 it's a weather data for first day
			// index 11 it's a weather data for second day
			const cutWeatherDataList = [weatherDataList[3]];
			for(let i = 11; i < weatherDataList.length; i += 8) {
				cutWeatherDataList.push(weatherDataList[i]);
			}

			const clientWeatherDataList = cutWeatherDataList.map(data => {
				return ({
					weather: {
						main: data.weather[0].main,
						description: data.weather[0].description,
						icon: data.weather[0].icon
					},
					temp: Math.floor(data.main.temp),
					city: response.data.city.name,
					date: data.dt_txt
				});
			});


			return clientWeatherDataList;
		}).catch(() => {
			return [];
		});

	}
};