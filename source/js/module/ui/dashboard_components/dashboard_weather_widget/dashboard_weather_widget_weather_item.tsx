import * as React from 'react';

import 'styles/ui/dashboard/dashboard_weather_widget/b_dashboard_weather_widget.scss'
import {DateHelper} from "module/helpers/date_helper";

export interface WeatherWidgetData {
	weather: {
		main: string,
		description: string,
		icon: string
	}
	temp: number
	city: string
	date: string
}

export interface DashboardWeatherWidgetWeatherItemProps {
	index: number
	data: WeatherWidgetData
}

export class DashboardWeatherWidgetWeatherItem extends React.Component<DashboardWeatherWidgetWeatherItemProps, {}> {
	getWeatherModifier() {
		return `m${this.props.data.weather.icon}`;
	}
	getDate() {
		return DateHelper.getDateStringFromDateObject(new Date(this.props.data.date));
	}
	render() {
		const weatherWidgetData = this.props.data;
		return (
			<div className={`eDashboardWeatherWidget_weatherItem`}>
				<div className='eDashboardWeatherWidget_col'>
					<div className='eDashboardWeatherWidget_date'>{this.getDate()}</div>
					<h1 className='eDashboardWeatherWidget_temp'>{weatherWidgetData.temp+'\xB0'}</h1>
					<div className='eDashboardWeatherWidget_weatherDescription'>{weatherWidgetData.weather.description}</div>
				</div>
				<div className='eDashboardWeatherWidget_col mShort'>
					<div className={'eDashboardWeatherWidget_weatherIcon' + ' ' + this.getWeatherModifier()} />
				</div>
			</div>
		);
	}
}