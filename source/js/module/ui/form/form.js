var Form;

Form = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = this.getDefaultBinding(),
			Title;

		if (self.props.name !== undefined) {
			Title = <h2>{self.props.name}</h2>;
		}

		return (
			<div className="bForm">
				<div className="eForm_atCenter">

					{Title}

					{self.props.children}


					<div className="eForm_savePanel">
						<div className="bButton mRight">Register →</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Form;
