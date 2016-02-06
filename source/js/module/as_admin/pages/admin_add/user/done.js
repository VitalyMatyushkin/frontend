var RegiseterUserDone, React;
React = require('react');

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSingin: React.PropTypes.func
	},
	render: function() {
		var self = this;
		document.location.hash = 'admin_schools/permissions';
		return null;
	}
});


module.exports = RegiseterUserDone;
