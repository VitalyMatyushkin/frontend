var UserPhoto;

UserPhoto = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function() {
		var self = this,
			mapNode = self.refs.map.getDOMNode(),
			mapeCenter = new google.maps.LatLng(51.512406, -0.129966),
			mapOptions,
			mapView,
			schoolMarker;

		mapOptions = {
			center: mapeCenter,
			zoom: 14,
			disableDefaultUI: true
		};

		mapView = new google.maps.Map(mapNode, mapOptions);

		schoolMarker = new google.maps.Marker({
			position: mapeCenter,
			map: mapView
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserPhoto" ref="map">

			</div>
		)
	}
});


module.exports = UserPhoto;
