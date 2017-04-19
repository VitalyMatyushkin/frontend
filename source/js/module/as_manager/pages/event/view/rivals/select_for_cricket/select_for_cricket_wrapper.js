/**
 * Created by Woland on 19.04.2017.
 */
const 	React 				= require('react'),
		SelectForCricket 	= require('./select_for_cricket');

const 	EventHelper 		= require('module/helpers/eventHelper');

const SelectForCricketWrapper = React.createClass({
	propTypes: {
		event: 				React.PropTypes.object,
		onChangeResult: 	React.PropTypes.func
	},
	
	getPointsForCricket: function() {
		let points = [];
		
		points.push(Math.round(this.props.event.results.teamScore["0"].score * 10) / 10);
		points.push(Math.round(this.props.event.results.teamScore["1"].score * 10) / 10);
		
		return points;
	},
	
	isDraw: function(){
		const points = this.getPointsForCricket();
		return points[0] === points[1];
	},
	getRivalName:function(order){
		const eventType = this.props.event.eventType;
		if (EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
			return `${this.props.event.schoolsData[order].name} ${this.props.event.teamsData[order].name}`
		} else {
			return `${this.props.event.teamsData[order].name}`
		}
	},
	
	render: function(){
		return (
			<SelectForCricket
				isDraw 			= { this.isDraw() }
				onChangeResult 	= { this.props.onChangeResult }
				leftRivalName 	= { this.getRivalName(0) }
				rightRivalName 	= { this.getRivalName(1) }
			/>
		);
	}
});

module.exports = SelectForCricketWrapper;