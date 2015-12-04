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
			React.createElement("div", null,
				React.createElement("h2", null, "Authorization failed"),
				React.createElement("div", {className: "ePageMessage_text"},
					"You can ",
					React.createElement("a", {href: "/", className: "bButton"}, "try again →"),
					" or ",
					React.createElement("a", {href: "/#register", className: "bButton"}, "sign up"), " ")
			)
		)
	}
});


module.exports = RegiseterUserDone;
