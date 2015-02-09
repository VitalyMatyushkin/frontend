var Form;

Form = React.createClass({
	mixins: [Morearty.Mixin],
	statePath: 'fieldsState',
	propTypes: {
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func,
		name: React.PropTypes.string,
		service: React.PropTypes.string.isRequired
	},
	defaultButton: 'Continue →',
	loadingButton: 'Loading...',
	componentWillMount: function() {
		var self = this;

		self.getDefaultBinding().set('buttonText', self.defaultButton);
		self.busy = false;
	},
	tryToSubmit: function() {
		var self = this,
			fields = self.getDefaultBinding().get(self.statePath).toJS(),
			hereIsError = false,
			dateToPost = {};

		if (self.busy === true) {
			return false;
		}

		// Проверка всех полей данных на валидацию
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

		// Если ошибок нет, обращаемся с данными к сервису
		if (hereIsError === false) {

			self.busy = true;
			self.getDefaultBinding().set('buttonText', self.loadingButton);

			$.ajax({
				url: 'http://api.squadintouch.com:80/v1/' + self.props.service,
				type: 'POST',
				crossDomain: true,
				data: dateToPost,
				error: function(data) {
					if (self.props.onError) {
						self.props.onError(data);
					}
				},
				success: function(data) {
					self.busy = false;
					self.buttonText = self.defaultButton;

					if (self.props.onSuccess) {
						self.props.onSuccess(data);
					}
				}
			});
		}

	},
	render: function() {
		var self = this,
			Title;

		if (self.props.name !== undefined) {
			Title = <h2 dangerouslySetInnerHTML={{__html: self.props.name}} />;
		}

		// Передаем детям привязку с биндингку текущей формы
		self.props.children = React.Children.map(self.props.children, function (child) {

			return React.addons.cloneWithProps(child, {
				binding: self.getDefaultBinding().sub(self.statePath + '.' + child.props.field),
				service: self.props.service
			});
		});

		return (
			<div className="bForm">
				<div className="eForm_atCenter">

					{Title}

					{self.props.children}

					<div className="eForm_savePanel">
						<div className="bButton mRight" onClick={self.tryToSubmit}>{self.getDefaultBinding().get('buttonText')}</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Form;
