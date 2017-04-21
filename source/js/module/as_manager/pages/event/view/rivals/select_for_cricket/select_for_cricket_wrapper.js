/**
 * Created by Woland on 19.04.2017.
 */
const 	React 				= require('react'),
		SelectForCricket 	= require('./select_for_cricket');

const 	EventHelper 		= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper');

const RESULTS_FOR_CRICKET_TBD = ['TBD'];
const RESULTS_FOR_CRICKET = ['Draw', 'No result', 'Tie'];
const CRICKET_WICKETS = 10;

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
			let stateArray = [];

			stateArray = stateArray.concat(
				RESULTS_FOR_CRICKET_TBD,
				this.addTeamResultsInGameResultsMenu(nextProps.event),
				RESULTS_FOR_CRICKET,
				this.addMatchAwardedInGameResultMenu(nextProps.event)
			);

			this.setState({results: stateArray});
		}
	},
	
	addMatchAwardedInGameResultMenu: function(event){
		let matchAwardedArray = [];
		const 	leftTeamId 			= this.getTeamsIdOrderByResults(event).leftTeamId,
				rightTeamId 		= this.getTeamsIdOrderByResults(event).rightTeamId;
		console.log('hmmm');
		matchAwardedArray.push(`Match awarded to ${this.getRivalName(leftTeamId)}`);
		matchAwardedArray.push(`Match awarded to ${this.getRivalName(rightTeamId)}`);
		
		return matchAwardedArray;
	},
	
	addTeamResultsInGameResultsMenu: function(event){
		let teamResultsArray = [];
		const 	points 				= this.getPointsForCricket(event),
				leftTeamId 			= this.getTeamsIdOrderByResults(event).leftTeamId,
				rightTeamId 		= this.getTeamsIdOrderByResults(event).rightTeamId,
				pointsForLeftTeam 	= TeamHelper.convertPointsCricket(points[0]),
				pointsForRightTeam 	= TeamHelper.convertPointsCricket(points[1]),
				runsForLeftTeam 	= pointsForLeftTeam.runs,
				wicketsForLeftTeam 	= pointsForLeftTeam.wickets,
				runsForRightTeam 	= pointsForRightTeam.runs,
				wicketsForRightTeam = pointsForRightTeam.wickets;
		

			if (runsForLeftTeam - runsForRightTeam > 0) {
				teamResultsArray.push(`${this.getRivalName(leftTeamId)} won by ${runsForLeftTeam - runsForRightTeam} runs`);
				teamResultsArray.push(`${this.getRivalName(leftTeamId)} won by an innings and ${runsForLeftTeam - runsForRightTeam} runs`);
				if (wicketsForLeftTeam - wicketsForRightTeam >= 0) {
					teamResultsArray.push(`${this.getRivalName(leftTeamId)} won by ${CRICKET_WICKETS - wicketsForLeftTeam} wickets`);
				}
			}

			if (runsForLeftTeam - runsForRightTeam < 0) {
				teamResultsArray.push(`${this.getRivalName(rightTeamId)} won by ${runsForRightTeam - runsForLeftTeam} runs`);
				teamResultsArray.push(`${this.getRivalName(rightTeamId)} won by an innings and ${runsForRightTeam - runsForLeftTeam} runs`);
				if (wicketsForLeftTeam - wicketsForRightTeam <= 0) {
					teamResultsArray.push(`${this.getRivalName(rightTeamId)} won by ${CRICKET_WICKETS - wicketsForRightTeam} wickets`);
				}
			}
		
		return teamResultsArray;
	},
	
	componentDidMount: function(){
		let stateArray = [];
		
		stateArray = stateArray.concat(
			RESULTS_FOR_CRICKET_TBD,
			this.addTeamResultsInGameResultsMenu(this.props.event),
			RESULTS_FOR_CRICKET,
			this.addMatchAwardedInGameResultMenu(this.props.event)
		);
		
		this.setState({results: stateArray});
	},
	
	getTeamsIdOrderByResults: function(event){
		return {
			leftTeamId: event.results.teamScore["0"].teamId,
			rightTeamId: event.results.teamScore["1"].teamId
		}
	},
	
	getPointsForCricket: function(event) {
		let points = [];
		
		points.push(Math.round(event.results.teamScore["0"].score * 10) / 10);
		points.push(Math.round(event.results.teamScore["1"].score * 10) / 10);

		return points;
	},
	
	getRivalName: function(teamId){
		const 	eventType = this.props.event.eventType,
				order = this.props.event.teamsData.findIndex(team => team.id === teamId);
		
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