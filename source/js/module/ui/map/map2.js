/**
 * Created by Woland on 30.01.2017.
 */
const	React = require('react');

const	VenueStyles = require('../../../../styles/pages/events/b_venue.scss');

const Map = React.createClass({
	propTypes:{
		point: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lng: React.PropTypes.number
		}),
		customStylingClass:React.PropTypes.string
	},
	componentDidMount: function() {
		this.setUpMap(this.props.point);
	},
	componentWillReceiveProps:function(nextProps){
		if(
			this.props.point && nextProps.point &&
			(
				this.props.point.lat != nextProps.point.lat || this.props.point.lng != nextProps.point.lng
			)
		) {
			this.setUpMap(nextProps.point);
		}
	},
	setUpMap: function(point) {
		const 	mapNode 	= this.refs.map,
				mapCenter 	= new google.maps.LatLng(point.lat, point.lng),
				mapOptions 	= {
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
	},

	render: function() {
		const classNames = 'bMapView '+ (typeof this.props.customStylingClass !== 'undefined' ? this.props.customStylingClass : '');

		return (
			<div className={classNames} ref="map">
			</div>
		)
	}
});

module.exports = Map;