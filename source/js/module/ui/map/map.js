const 	React 		= require('react'),
		ReactDOM 	= require('react-dom'),
		Morearty    = require('morearty'),
		classNames 	= require('classnames');

const MapView = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		point: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lng: React.PropTypes.number
		}),
		customStylingClass:React.PropTypes.string
	},
	componentDidMount: function() {
		var self = this;
		self.setUpMap(self.props.point);
	},
	componentWillReceiveProps:function(nextProps){
		var self = this;
		if(this.props.point && nextProps.point &&
			(this.props.point.lat != nextProps.point.lat
			|| this.props.point.lng != nextProps.point.lng))
		self.setUpMap(nextProps.point);
	},
	setUpMap:function(point){
		var self = this,
			mapNode = self.refs.map,
			mapeCenter = new google.maps.LatLng(point.lat, point.lng),
			binding = self.getDefaultBinding(),
			mapOptions;

		mapOptions = {
			center: mapeCenter,
			zoom: 16,
			disableDefaultUI: true
		};

		self.mapView = new google.maps.Map(mapNode, mapOptions);
		self.mapBounds = new google.maps.LatLngBounds();
		self.mapBounds.extend(mapeCenter);

		self.points = {};
		self.points['school'] = new google.maps.Marker({
			position: mapeCenter,
			map: self.mapView
		});

		binding && binding.addListener('list', self.addPointsToMap);
		binding && self.addPointsToMap();
	},
	addPointsToMap: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			pointsData = binding.toJS('list');

		pointsData && pointsData.forEach(function(data) {
			var postcode = data.postcode,
				mapDot;

			if (!self.points[postcode.id]) {

				mapDot = new google.maps.LatLng(postcode.point.lat, postcode.point.lng);
				self.mapBounds.extend(mapDot);

				self.points[postcode.id] = new google.maps.Marker({
					position: mapDot,
					map: self.mapView,
					icon: '/images/beachflag.png'
				});

				google.maps.event.addListener(self.points[postcode.id], 'click', function() {
					document.location.hash = 'fixtures?opponentId=' + data.id;
				});

			}
		});


		//self.mapView.fitBounds(self.mapBounds);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			classNames = 'bMapView '+ (self.props.customStylingClass !== undefined?self.props.customStylingClass:'');
		return (
			<div className={classNames} ref="map">
			</div>
		)
	}
});


module.exports = MapView;
