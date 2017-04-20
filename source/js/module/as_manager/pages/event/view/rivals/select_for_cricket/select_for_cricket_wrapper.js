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
	
	getInitialState: function(){
		return {
			results: []
		};
	},

	componentWillReceiveProps: function(nextProps){
		if (nextProps.event !== this.props.event) {
			let stateArray = this.state.results;
			
			if (this.isTie(nextProps.event)) {
				stateArray.push('Tie');
			} else {
				stateArray = stateArray.filter(elem => elem !== 'Tie');
			}
			
			this.setState({results: stateArray});
		}
	},
	
	componentDidMount: function(){
		let stateArray = ['', 'Draw', 'No result', 'Match conceded', 'Match awarded'];

		stateArray.push(`${this.getRivalName(0)} won`);
		stateArray.push(`${this.getRivalName(1)} won`);
		
		if (this.isTie(this.props.event)) {
			stateArray.push('Tie');
		}
		
		this.setState({results: stateArray});
	},
	
	getPointsForCricket: function(event) {
		let points = [];
		
		points.push(Math.round(event.results.teamScore["0"].score * 10) / 10);
		points.push(Math.round(event.results.teamScore["1"].score * 10) / 10);

		return points;
	},
	
	isTie: function(event){
		const points = this.getPointsForCricket(event);
		
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
				results 		= { this.state.results }
				onChangeResult 	= { this.props.onChangeResult }
			/>
		);
	}
});

module.exports = SelectForCricketWrapper;