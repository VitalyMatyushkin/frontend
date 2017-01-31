/**
 * Created by Woland on 30.01.2017.
 */

const 	React 		= require('react'),
		Map 		= require('./map2');

const MapOfEventVenue = React.createClass({
	propTypes: {
		venue: React.PropTypes.object
	},
	componentWillMount:function () {
		this.loadData();
	},
	getInitialState: function(){
		return {
			point	: {}
		}
	},
	loadData:function () {
		const 	postcodeId 	= this.props.venue.postcodeId;

		if(postcodeId){
			window.Server.postCodeById.get(postcodeId).then(postcode => {
				this.setState({
					point: postcode.point
				});
			});
		}
	},
	render:function () {
		const 	point = this.state.point;

		if(!point){
			this.loadData();
		}

		return point ? <Map point={point} /> : null;
	}
});

module.exports = MapOfEventVenue;
