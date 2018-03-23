import * as React from 'react';

import 'styles/ui/dashboard/dashboard_weather_widget/b_dashboard_weather_widget.scss'

export interface WeatherWidgetData {
	weather: {
		main: string,
		description: string,
		icon: string
	}
	temp: number
	city: string
}

export interface DashboardWeatherWidgetProps {
	data: WeatherWidgetData
}

export class DashboardWeatherWidget extends React.Component<DashboardWeatherWidgetProps, {}> {
	getWeatherModifier() {
		return `m${this.props.data.weather.icon}`;
	}
	render() {
		const weatherWidgetData = this.props.data;
		return (
			<div className='bDashboardWeatherWidget'>
				<div className='eDashboardWeatherWidget_col'>
					<h1 className='eDashboardWeatherWidget_temp'>{weatherWidgetData.temp+'\xB0'}</h1>
					<div className='eDashboardWeatherWidget_city'>{weatherWidgetData.city}</div>
					<div className='eDashboardWeatherWidget_weatherDescription'>{weatherWidgetData.weather.description}</div>
				</div>
				<div className='eDashboardWeatherWidget_col'>
					<div className={'eDashboardWeatherWidget_weatherIcon' + ' ' + this.getWeatherModifier()} />
				</div>
			</div>
		);
	}
}