const React = require('react');

const FormPlaceholder = React.createClass({
	getDefaultProps: function () {
		return {
			type: 'column'
		};
	},
	render: function () {
		var self = this;

		return (
			<div className="eForm_placeholder">
				{self.props.children}
			</div>
		)
	}
});

module.exports = FormPlaceholder;
