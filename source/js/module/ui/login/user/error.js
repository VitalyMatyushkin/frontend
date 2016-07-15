const 	React 		= require('react'),
		Morearty    = require('morearty'),
		ReactDOM 	= require('react-dom');

const RegiseterUserDone = React.createClass({
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
			<div className="ePageMessage_text">
				You can
				<a className="bButton" href="/">
					try again →
				</a>
					or
				<a href="/#register" className="bButton" >
					sign up
				</a>
			</div>
		</div>
		)
	}
});


module.exports = RegiseterUserDone;
