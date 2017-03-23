const	React		= require('react'),
		classNames	= require('classnames');

const FormBlock = React.createClass({
	propTypes: {
		type:		React.PropTypes.string.isRequired,
		isVisible:	React.PropTypes.string.isRequired
	},
	getDefaultProps: function () {
		return {
			type:		'placeholder',
			isVisible:	true
		};
	},
	render: function () {
		const className = classNames({
			'eForm_placeholder':	true,
			'mInvisible':			!this.props.isVisible
		});

		return (
			<div className={className}>
				{ this.props.children }
			</div>
		)
	}
});

module.exports = FormBlock;