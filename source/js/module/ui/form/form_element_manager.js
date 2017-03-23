const	React					= require('react'),
		Button					= require('../button/button');

const	FormElementManagerStyle	= require('../../../../styles/ui/forms/b_form_element_manager.scss');

const FormElementManager = React.createClass({
	propTypes: {
		type:		React.PropTypes.string.isRequired,
		text:		React.PropTypes.string.isRequired,
		onClick:	React.PropTypes.func.isRequired
	},
	getDefaultProps: function () {
		return {
			type:		'manager',
			isVisible:	true
		};
	},
	render: function () {
		return (
			<div className="bFormElementManager">
				<Button
					onClick				= {this.props.onClick}
					text				= {this.props.text}
					extraStyleClasses	= "mAddFormItem"
				/>
			</div>
		);
	}
});

module.exports = FormElementManager;