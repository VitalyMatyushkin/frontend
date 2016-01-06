var FormColumn,
	React = require('react');

FormColumn = React.createClass({
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
