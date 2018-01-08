const	React			= require('react'),
		DropdownStyle	= require('../../../../../styles/ui/b_dropdown.scss');

const Dropdown = React.createClass({
	propTypes: {
		optionsArray:		React.PropTypes.array.isRequired,
		currentOptionId:	React.PropTypes.string.isRequired,
		handleChange:		React.PropTypes.func.isRequired,
		extraCssStyle:		React.PropTypes.string
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
		const days = this.props.optionsArray.map(option => {
				return (
					<option
						key		= { option.id }
						value	= { option.value }
					>
						{ `${option.text}` }
					</option>
				);
			}
		);

		return (
			<select
				className	= { this.getSelectCssStyle() }
				value		= { this.props.currentOptionId }
				onChange	= { this.handleChange }
			>
				{days}
			</select>
		);
	}
});

module.exports = Dropdown;