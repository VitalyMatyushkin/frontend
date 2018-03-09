import * as React from 'react';

export interface Point{
	lat?: number
	lng?: number
	type: string
	coordinates: [number, number]
}

export interface MapProps{
	point: Point
	customStylingClass?: string
	getNewPoint: (point: any) => void
}

export class Map extends React.Component<MapProps, {}> {
	mapView: 		any;
	mapBounds: 		any;
	points: 		any;

	componentDidMount(): void {
		const {point} = this.props;
		this.setUpMap(point);
		this.points['school'].addListener('dragend', (e) => {
			const point = {
				type: 'Point',
				coordinates: [
					Number(e.latLng.lng()),
					Number(e.latLng.lat())
				]
			};
			this.props.getNewPoint(point);
		});
	}

	setUpMap(pointGoogle: Point): void {
		const 	mapNode = this.refs['map'],
				mapCenter = new (window as any).google.maps.LatLng(pointGoogle.coordinates[1], pointGoogle.coordinates[0]),
				mapOptions = {
					center: 			mapCenter,
					zoom: 				16,
					disableDefaultUI: 	true,
					zoomControl: 		true
				};
		this.mapView = new (window as any).google.maps.Map(mapNode, mapOptions);

		this.mapBounds = new (window as any).google.maps.LatLngBounds();
		this.mapBounds.extend(mapCenter);

		this.points = {};
		this.points['school'] = new (window as any).google.maps.Marker({
			position: mapCenter,
			map: this.mapView,
			draggable: true
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