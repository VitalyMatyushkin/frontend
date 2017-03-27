const	React					= require('react'),
		Button					= require('../button/button'),
		classNames				= require('classnames');

const	FormElementManagerStyle	= require('../../../../styles/ui/forms/b_form_element_manager.scss');

const FormElementManager = React.createClass({
	propTypes: {
		isVisible:	React.PropTypes.bool.isRequired,
		type:		React.PropTypes.string.isRequired,
		text:		React.PropTypes.string.isRequired,
		onClick:	React.PropTypes.func.isRequired
	},
	getDefaultProps: function () {
		return {
			type:		'simpleElement',
			isVisible:	true
		};
	},
	render: function () {
		const className = classNames({
			'bFormElementManager':	true,
			'mInvisible':			!this.props.isVisible
		});

		return (
			<div className={className}>
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