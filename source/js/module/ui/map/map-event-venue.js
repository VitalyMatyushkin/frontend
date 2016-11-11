/**
 * Created by Anatoly on 09.11.2016.
 */

const 	React 		= require('react'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		Map 		= require('./map');

const MapOfEventVenue = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		venue: React.PropTypes.object
	},
	componentWillMount:function () {
		this.loadData();
	},
	loadData:function () {
		const 	binding 	= this.getDefaultBinding(),
				postcodeId 	= this.props.venue && this.props.venue.postcodeId;

		if(postcodeId){
			window.Server.postCodeById.get(postcodeId).then(postcode => {
				binding.set('postcode', Immutable.fromJS(postcode))
			});
		}
	},
	render:function () {
		const 	binding = this.getDefaultBinding(),
				point 	= binding.toJS('postcode.point');

		return point ? <Map binding={binding.sub('map')} point={point} /> : null;
	}
});

module.exports = MapOfEventVenue;
