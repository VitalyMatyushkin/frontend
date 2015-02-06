var RegiseterUserDone;

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSingin: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<div>
				<h2>User not found</h2>
				<div className="ePageMessage_text">You can <div className="bButton" onClick={self.props.onSingin}>try again →</div> or <a href="/#register" className="bButton" >sing up</a> </div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
