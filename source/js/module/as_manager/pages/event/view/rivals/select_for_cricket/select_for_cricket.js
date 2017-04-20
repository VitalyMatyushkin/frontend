/**
 * Created by Woland on 19.04.2017.
 */
const 	React 	= require('react'),
		Select 	= require('module/ui/select/select');

const SelectForCricketStyle = require('styles/ui/select_for_cricket/select_for_cricket.scss');

const SelectForCricket = React.createClass({
	propTypes: {
		onChangeResult: 	React.PropTypes.func.isRequired,
		//array of <option> elements
		results: 			React.PropTypes.array.isRequired
	},
	getInitialState: function(){
		return {
			value: ''
		};
	},
	
	handleChange: function(event){
		this.setState({value: event.target.value});
		this.props.onChangeResult(event.target.value);
	},
	
	renderOptions: function(){
		return this.props.results.map( (option, index) => {
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