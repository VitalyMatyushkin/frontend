const React = require('react');

const FormColumn = React.createClass({
	getDefaultProps: function () {
		return {
			type: 'column'
		};
	},
	render: function () {
		var self = this;

		return (
			<div className="eForm_fieldColumn">
				{self.props.children}
			</div>
		)
	}
});

module.exports = FormColumn;
