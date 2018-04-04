import * as React from 'react';
import {
	DashboardWeatherWidgetWeatherItem,
	WeatherWidgetData
} from "module/ui/dashboard_components/dashboard_weather_widget/dashboard_weather_widget_weather_item";
import 'styles/ui/dashboard/dashboard_weather_widget/b_dashboard_weather_widget.scss'
import ReactResizeDetector from 'react-resize-detector';

export interface DashboardWeatherWidgetProps {
	weatherWidgetList: WeatherWidgetData[]
}

export interface DashboardWeatherWidgetState {
	isSync: boolean,
	width: number
}

const WEATHER_ITEM_WIDTH = 150;

export class DashboardWeatherWidget extends React.Component<DashboardWeatherWidgetProps, DashboardWeatherWidgetState> {
	widget = undefined;
	componentWillMount() {
		this.setState({
			isSync: false
		})
	}
	componentDidMount() {
		this.setState({
			isSync: true,
			width: this.widget.clientWidth
		})
	}
	renderWeatherItems() {
		if(this.state.isSync && this.props.weatherWidgetList.length > 0) {
			const items = [];
			for(let i = 0; i < this.props.weatherWidgetList.length; i++) {
				if((i + 1) * WEATHER_ITEM_WIDTH <= this.state.width) {
					items.push(
						<DashboardWeatherWidgetWeatherItem index={i} data={this.props.weatherWidgetList[i]}/>
					);
				} else {
					break;
				}
			}

			return items;
		} else if(this.state.isSync && this.props.weatherWidgetList.length === 0) {
			return (
				<div className='eDashboardWeatherWidget_empty'>
					There is no weather data.
				</div>
			);
		} else {
			return null;
		}
	}
	handleResize(width) {
		this.setState({width: width});
	}
	render() {
		return (
			<div
				className='bDashboardWeatherWidget'
				ref={(widget) => { this.widget = widget; }}
			>
				<div className='eDashboardWeatherWidget_header'>
					City: {this.props.weatherWidgetList[0].city}
				</div>
				<div className='eDashboardWeatherWidget_body'>
					{this.renderWeatherItems()}
				</div>
				<ReactResizeDetector handleWidth onResize={(width) => this.handleResize(width)} />
			</div>
		);
	}
}