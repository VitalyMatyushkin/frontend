const	React			= require('react'),
		classNames		= require('classnames'),
		CheckboxStyle	= require('../../../../styles/ui/checkbox/checkbox.scss');

const Checkbox =  React.createClass({
	propTypes: {
		isChecked:				React.PropTypes.bool.isRequired,
		onChange:				React.PropTypes.func.isRequired,
		id:						React.PropTypes.string,
		customCss:				React.PropTypes.string,
		isReturnEventTarget: 	React.PropTypes.bool.isRequired,
		isDisabled: 			React.PropTypes.bool.isRequired
	},
	getDefaultProps:function(){
		return {
			isReturnEventTarget: 	true,
			isDisabled: 			false
		}
	},
	onChange: function(event){
		if (this.props.isReturnEventTarget) {
			this.props.onChange(event)
		} else {
			this.props.onChange(event.target.checked)
		}
	},
	render: function () {
		return (
			<div className={ classNames('bCheckbox', this.props.customCss) }>
				<input
					className 	= "eCheckbox_switch"
					type 		= "checkbox"
					checked 	= { this.props.isChecked }
					onChange 	= { this.onChange }
					id 			= { this.props.id }
					disabled 	= { this.props.isDisabled }
				/>
				<label/>
			</div>
		)
	}
});


module.exports = Checkbox;
