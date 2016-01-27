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

		//return (
		//	<div className="bPageMessage">
		//		<h2>Registration successful</h2>
		//		<div className="ePageMessage_text">Now you can <a href="/#login" className="bButton" onClick={self.props.onSingin}>Sign in →</a> </div>
		//	</div>
		//)
	}
});


module.exports = RegiseterUserDone;
