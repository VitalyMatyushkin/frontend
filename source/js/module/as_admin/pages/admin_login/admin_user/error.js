var RegiseterUserDone;

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onOk: React.PropTypes.func,
		onSingUp: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<div>
				<h2>Authorization failed</h2>
				<div className="ePageMessage_text">You can <div className="bButton" onClick={self.props.onOk}>try again →</div> or <div onClick={self.props.onSingUp} className="bButton" >sing up</div> </div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
