var RegiseterUserDone;

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSingin: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<div className="bPageMessage">
				<h2>Registration successful</h2>
				<div className="ePageMessage_text">Now you can <div className="bButton" onClick={self.props.onSingin}>Sing in →</div> </div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
