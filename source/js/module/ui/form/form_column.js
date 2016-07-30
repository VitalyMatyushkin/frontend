const	React		= require('react'),
		classNames	= require('classnames');

const FormColumn = React.createClass({
	propTypes: {
		customStyle: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			type: 'column'
		};
	},
	render: function () {
		var self = this;

		return (
			<div className={classNames('eForm_fieldColumn', self.props.customStyle)}>
				{self.props.children}
			</div>
		)
	}
});

module.exports = FormColumn;
