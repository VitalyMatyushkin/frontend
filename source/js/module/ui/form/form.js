var Form;

Form = React.createClass({
	mixins: [Morearty.Mixin],
	statePath: 'fieldsState',
	tryToSubmit: function() {
		var self = this,
			fields = self.getDefaultBinding().get(self.statePath).toJS(),
			hereIsError = false,
			dateToPost = {};

		for (var field in fields) {

			dateToPost[field] = fields[field].value;

			if (fields[field].error) {
				self.getDefaultBinding().update(self.statePath + '.' + field, function(immutableValue) {
					hereIsError = true;
					return immutableValue.set('showError', true);
				});
			}
		}

		//TODO: Заменить dateToPost на Merge данных из statePath

		if (hereIsError === false) {
			$.ajax({
				url: 'http://api.squadintouch.com:80/v1/' + self.props.service,
				type: 'POST',
				crossDomain: true,
				data: dateToPost,
				error: function(data) {
					debugger
				},
				success: function(data) {
					var self = this;

					debugger
				}
			});
		}

	},
	render: function() {
		var self = this,
			Title;

		if (self.props.name !== undefined) {
			Title = <h2>{self.props.name}</h2>;
		}

		// Передаем детям привязку с биндингку текущей формы
		self.props.children = React.Children.map(self.props.children, function (child) {
			return React.addons.cloneWithProps(child, {
				binding: self.getDefaultBinding().sub(self.statePath),
				service: self.props.service
			});
		});

		return (
			<div className="bForm">
				<div className="eForm_atCenter">

					{Title}

					{self.props.children}

					<div className="eForm_savePanel">
						<div className="bButton mRight" onClick={self.tryToSubmit}>Continue →</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Form;
