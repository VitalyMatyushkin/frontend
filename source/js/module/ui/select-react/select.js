/**
 * Created by Woland on 30.10.2017.
 */
const	React			= require('react'),
		SelectStyle		= require('styles/ui/b_dropdown.scss');

const Select = React.createClass({
	propTypes: {
		optionsArray:		React.PropTypes.array.isRequired,
		currentOption:		React.PropTypes.string.isRequired,
		handleChange:		React.PropTypes.func.isRequired,
		extraCssStyle:		React.PropTypes.string,
		isDisabled: 		React.PropTypes.bool.isRequired
	},
	getDefaultProps: function(){
		return {
			isDisabled: false
		};
	},
	getSelectCssStyle: function() {
		if(typeof this.props.extraCssStyle === 'undefined') {
			return 'bDropdown';
		} else {
			return `bDropdown ${this.props.extraCssStyle}`;
		}
	},
	
	handleChange: function(eventDescriptor) {
		this.props.handleChange(eventDescriptor.target.value);
	},
	
	render: function() {
		const options = this.props.optionsArray.map((option, index) => {
				return (
					<option	key		= {`option_${index}`}
							value	= {option}
					>
						{option}
					</option>
				);
			}
		);
		
		return (
			<select	className	= { this.getSelectCssStyle() }
					value		= { this.props.currentOption }
					onChange	= { this.handleChange }
					disabled 	= { this.props.isDisabled }
			>
				{options}
			</select>
		);
	}
});

module.exports = Select;