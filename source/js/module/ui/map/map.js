var MapView;

MapView = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {

	},
	componentDidMount: function() {
		var self = this,
			mapNode = self.refs.map.getDOMNode(),
			mapeCenter = new google.maps.LatLng(51.512406, -0.129966),
			mapOptions,
			mapView,
			marker;

		mapOptions = {
			center: mapeCenter,
			zoom: 14,
			disableDefaultUI: true
		};

		mapView = new google.maps.Map(mapNode, mapOptions);

		marker = new google.maps.Marker({
			position: mapeCenter,
			map: mapView
		});
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
