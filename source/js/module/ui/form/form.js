var Form;

Form = React.createClass({
	mixins: [Morearty.Mixin],
	statePath: 'fieldsState',
	propTypes: {
		onSubmit: React.PropTypes.func,
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func,
		name: React.PropTypes.string
	},
	defaultButton: 'Continue →',
	loadingButton: 'Loading...',
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.addListener('data', function() {
			var dataSet = binding.get('data');

			if (dataSet && (dataSet = dataSet.toJS())) {
				for (var dataField in dataSet) {
					if (dataSet.hasOwnProperty(dataField)) {
						binding.merge(self.statePath + '.' + dataField, true, Immutable.Map({
							value: dataSet[dataField],
							defaultValue: dataSet[dataField]
						}));
					}
				}
			}
		});

		binding.set('buttonText', self.defaultButton);
		self.busy = false;
	},
	tryToSubmit: function() {
		var self = this,
			token = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo').get('userId'),
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
		dateToPost.ownerId = token;
		// Если ошибок нет, обращаемся с данными к сервису
		if (hereIsError === false) {

			self.busy = true;
			self.getDefaultBinding().set('buttonText', self.loadingButton);

			// TODO: Привести передачу сервисов к общему виду => вынести работу с сервисами за форму
			if (typeof self.props.onSubmit === 'function') {

				self.props.onSubmit(dateToPost);

				return false;
			}


			if (typeof self.props.service === 'function') {
				self.props.service(dateToPost).then(function(data) {
					self.busy = false;
					self.buttonText = self.defaultButton;

					if (self.props.onSuccess) {
						self.props.onSuccess(data);
					}
				}, function (data) {
					if (self.props.onError) {
						self.props.onError(data);
					}
				});
			} else {
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

		}

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			Title;

		if (self.props.name !== undefined) {
			Title = <h2 dangerouslySetInnerHTML={{__html: self.props.name}} />;
		}

		// Передаем детям привязку с биндингку текущей формы
		self.props.children = React.Children.map(self.props.children, function (child) {

			return React.addons.cloneWithProps(child, {
				binding: binding.sub(self.statePath + '.' + child.props.field),
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
