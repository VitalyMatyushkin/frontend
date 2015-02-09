var RegiseterUserDone;

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onOk: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<div>
				<h2>Authorization failed</h2>
				<div className="ePageMessage_text">You can <div className="bButton" onClick={self.props.onOk}>try again →</div> or <a href="/#register" className="bButton" >sing up</a> </div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
