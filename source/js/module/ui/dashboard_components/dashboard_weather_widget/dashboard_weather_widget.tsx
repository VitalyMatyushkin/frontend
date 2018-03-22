import * as React from 'react';
import axios from 'axios';

import 'styles/ui/dashboard/dashboard_weather_widget/b_dashboard_weather_widget.scss'

export interface DashboardWeatherWidgetState {
	isSync: boolean
	weather: {
		main: string,
		description: string,
		icon: string
	}
	temp: number
	city: string
}

export interface DashboardWeatherWidgetProps {
	coordinates: {
		lat: number,
		lng: number
	}

}

// It's api key from my free account from openweathermap.org
const API_KEY = 'f81d4220a347cd76c6c87179f3da89bd';

export class DashboardWeatherWidget extends React.Component<DashboardWeatherWidgetProps, DashboardWeatherWidgetState> {
	componentWillMount() {
		this.setState({isSync: false});

		this.setWeatherInfo(this.props.coordinates.lng, this.props.coordinates.lat);
	}
	componentWillReceiveProps(props: DashboardWeatherWidgetProps) {
		this.setWeatherInfo(props.coordinates.lng, props.coordinates.lat);
	}
	setWeatherInfo(lng: number, lat: number) {
		this.setState({isSync: false});
		axios.get('http://api.openweathermap.org/data/2.5/weather', {
			params: {
				lat: lat,
				lon: lng,
				APPID: API_KEY,
				units: 'metric'
			},
		}).then((response:any) => {
			this.setState({
				weather: {
					main: response.data.weather[0].main,
					description: response.data.weather[0].description,
					icon: response.data.weather[0].icon
				},
				temp: Math.floor(response.data.main.temp),
				city: response.data.name,
				isSync: true
			});
		});
	}
	getWeatherModifier() {
		return `m${this.state.weather.icon}`;
	}
	render() {
		if(this.state.isSync) {
			return (
				<div className='bDashboardWeatherWidget'>
					<div className='eDashboardWeatherWidget_col'>
						<h1 className='eDashboardWeatherWidget_temp'>{this.state.temp+'\xB0'}</h1>
						<div className='eDashboardWeatherWidget_city'>{this.state.city}</div>
						<div className='eDashboardWeatherWidget_weatherDescription'>{this.state.weather.description}</div>
					</div>
					<div className='eDashboardWeatherWidget_col'>
						<div className={'eDashboardWeatherWidget_weatherIcon' + ' ' + this.getWeatherModifier()} />
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}