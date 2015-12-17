var MapView;

MapView = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		point: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lng: React.PropTypes.number
		})
	},
	componentDidMount: function() {
		var self = this,
			mapNode = self.refs.map,
			mapeCenter = new google.maps.LatLng(self.props.point.lat, self.props.point.lng),
			binding = self.getDefaultBinding(),
			mapOptions;

		mapOptions = {
			center: mapeCenter,
			zoom: 14,
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

		binding && binding.addListener('list', self.addPointsToMap/*.bind(self)*/);
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


		self.mapView.fitBounds(self.mapBounds);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bMapView" ref="map">

			</div>
		)
	}
});


module.exports = MapView;
