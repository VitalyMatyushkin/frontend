const	React			= require('react'),
		CheckboxStyle	= require('../../../../styles/ui/checkbox/checkbox.scss');

const Checkbox =  React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		onChange:	React.PropTypes.func.isRequired,
        id:			React.PropTypes.string
    },
	render: function () {
		return (
			<div className="bCheckbox">
				<input
					className	= "eCheckbox_switch"
					type		= "checkbox"
					checked		= { this.props.isChecked }
					onChange	= { this.props.onChange }
					id  		= { this.props.id }
				/>
				<label/>
			</div>
		)
	}
});


module.exports = Checkbox;
