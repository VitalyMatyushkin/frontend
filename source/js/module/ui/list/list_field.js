var ListField,
	React = require('react'),
	ReactDOM = require('reactDom');

ListField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired
	},

	render: function() {
		var self = this;

		return (
			null
		)
	}
});

module.exports = ListField;
