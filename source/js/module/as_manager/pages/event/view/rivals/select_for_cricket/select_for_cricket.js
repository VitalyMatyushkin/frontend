/**
 * Created by Woland on 19.04.2017.
 */
const 	React 	= require('react'),
		Select 	= require('module/ui/select/select');

const SelectForCricketStyle = require('styles/ui/select_for_cricket/select_for_cricket.scss');

const SelectForCricket = React.createClass({
	propTypes: {
		isDraw: 			React.PropTypes.bool.isRequired,
		onChangeResult: 	React.PropTypes.func.isRequired,
		leftRivalName: 		React.PropTypes.string.isRequired,
		rightRivalName: 	React.PropTypes.string.isRequired
	},
	getInitialState: function(){
		return {
			results: 			[],
			value: 				''
		};
	},
	componentWillReceiveProps: function(nextProps){
		let stateArray = this.state.results;
		if (nextProps.isDraw === true) {
			stateArray.push('Tie');
			this.setState({results: stateArray});
		} else {
			stateArray = stateArray.filter(elem => elem !== 'Tie');
			this.setState({results: stateArray});
		}
	},
	componentDidMount: function(){
		const stateArray = this.state.results;
		stateArray.push('');
		stateArray.push('Draw');
		stateArray.push('No result');
		stateArray.push('Match conceded');
		stateArray.push(`${this.props.leftRivalName} won`);
		stateArray.push(`${this.props.rightRivalName} won`);
		
		if (this.props.isDraw === true) {
			stateArray.push('Tie');
			this.setState({results: stateArray});
		}
		this.setState({results: stateArray});
	},
	
	handleChange: function(event){
		this.setState({value: event.target.value});
	},
	
	renderOptions: function(){
		return this.state.results.map( (option, index) => {
			return (
				<option
					key 	= { index }
					value 	= { option }
				>
					{ option }
				</option>
			);
		});
	},
	
	render: function(){
		return (
		<div className="eRivals_row">
			<div className="eSelectForCricketContainer">
				<div>Game result:</div>
				<select
					className	="eSelectForCricket"
					onChange 	= { this.handleChange }
					value 		= { this.state.value }
				>
					{ this.renderOptions() }
				</select>
			</div>
		</div>
		);
	}
});

module.exports = SelectForCricket;