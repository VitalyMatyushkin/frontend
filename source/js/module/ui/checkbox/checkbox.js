const	React			= require('react'),
		classNames		= require('classnames'),
		CheckboxStyle	= require('../../../../styles/ui/checkbox/checkbox.scss');

const Checkbox =  React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		onChange:	React.PropTypes.func.isRequired,
        id:			React.PropTypes.string,
        customCss:	React.PropTypes.string
    },
	render: function () {
		return (
			<div className={ classNames('bCheckbox', this.props.customCss) }>
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
