/**
 * Created by Woland on 19.04.2017.
 */
const 	React 	= require('react'),
		Select 	= require('module/ui/select/select');

const SelectForCricketStyle = require('styles/ui/select_for_cricket/select_for_cricket.scss');

/**
 * Tiny wrapper over <select> just to display options for closing cricket event.
 * Not calculates possible options itself. Just displays provided.
 */

const SelectForCricket = React.createClass({
	propTypes: {
		onChangeResult: 	React.PropTypes.func.isRequired,
		//array of <option> elements
		results: 			React.PropTypes.array.isRequired,
		activeResult: 		React.PropTypes.string.isRequired
	},
	
	handleChange: function(event){
		this.props.onChangeResult(event.target.value);
	},
	
	renderOptions: function(){
		return this.props.results.map( (option, index) => {
			if (typeof option.value !=='undefined' && typeof option.string !== 'undefined' && typeof option.teamId !== 'undefined') {
				return (
					<option
						key 	= { index }
						value 	= { `${option.value.toLowerCase()}/${option.teamId}` }
					>
						{ option.string }
					</option>
				);
			} else if (typeof option.value !=='undefined' && typeof option.string !== 'undefined' && typeof option.teamId === 'undefined') {
				return (
					<option
						key 	= { index }
						value 	= { `${option.value.toLowerCase()}` }
					>
						{ option.string }
					</option>
				);
			} else {
				return (
					<option
						key 	= { index }
						value 	= { option.toLowerCase() }
					>
						{ option }
					</option>
				);
			}
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
					value 		= { this.props.activeResult }
				>
					{ this.renderOptions() }
				</select>
			</div>
		</div>
		);
	}
});

module.exports = SelectForCricket;