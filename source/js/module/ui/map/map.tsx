import * as React from 'react';

export interface MapProps{
	point: {
		lat?: number,
		lng?: number
	},
	customStylingClass: string
}

declare let google: any;

export class Map extends React.Component<MapProps> {
	componentDidMount(): void {
		const {point} = this.props;
		this.setUpMap(point);
	}
	componentWillReceiveProps(nextProps): void {
		if(
			this.props.point && nextProps.point &&
			(
				this.props.point.lat != nextProps.point.lat || this.props.point.lng != nextProps.point.lng
			)
		) {
			this.setUpMap(nextProps.point);
		}
	}
	setUpMap(point: MapProps): void {
		const 	mapNode = this.refs.map,
				mapCenter = new google.maps.LatLng(point.lat, point.lng),
				mapOptions = {
					center: mapCenter,
					zoom: 16,
					disableDefaultUI: true
				};
		this.mapView = new google.maps.Map(mapNode, mapOptions);

		this.mapBounds = new google.maps.LatLngBounds();
		this.mapBounds.extend(mapCenter);

		this.points = {};
		this.points['school'] = new google.maps.Marker({
			position: mapCenter,
			map: this.mapView
		});
	}

	render() {
		const classNames = 'bMapView '+ (typeof this.props.customStylingClass !== 'undefined' ? this.props.customStylingClass : '');

		return (
			<div className={classNames} ref="map">
			</div>
		)
	}
}