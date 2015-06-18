var Form;

Form = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: React.PropTypes.func,
		onSuccess: React.PropTypes.func,
		onError: React.PropTypes.func,
		name: React.PropTypes.string,
		defaultButton: React.PropTypes.string,
		loadingButton: React.PropTypes.string,
<<<<<<< HEAD
		serviceType: React.PropTypes.string
=======
		updateBinding: React.PropTypes.bool
>>>>>>> feature/69_1_feature
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		self.defaultButton = self.props.defaultButton || 'Continue →';
		self.loadingButton = self.props.loadingButton || 'Loading...';

		binding.addListener('', function(ChangesDescriptor) {
			var data = binding.toJS();

			data && ChangesDescriptor.isValueChanged() && self._setDefaultValues();
		});

		binding.meta().clear();
		self._setDefaultValues();
		binding.meta().set('buttonText', self.defaultButton);
		self.busy = false;
	},
	/**
	 * Метод переосит значение из заданного поля в поле со значением по умочанию
	 * Такой подход необходим, т.к. данные могут прийти асинхронно, а значит поле value у node-элемента
	 * привязать к модели напрямую нелья
	 * @private
	 */
	_setDefaultValues: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataSet = binding.toJS();

		if (dataSet) {
			for (var dataField in dataSet) {
				if (dataSet.hasOwnProperty(dataField)) {
					binding.meta().merge(dataField, false, Immutable.Map({
						value: dataSet[dataField],
						defaultValue: dataSet[dataField]
					}));
				}
			}
		}
	},
	tryToSubmit: function() {
		var self = this,
			token = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo').get('userId'),
			fields = self.getDefaultBinding().meta().toJS(),
			hereIsError = false,
			dateToPost = {},
			typeOfService = typeof self.props.service,
			userService;

		if (self.busy === true) {
			return false;
		}
		// Проверка всех полей данных на валидацию
		for (var field in fields) {
			dateToPost[field] = fields[field].value;

			if (fields[field].error) {
				self.getDefaultBinding().meta().update(field, function(immutableValue) {
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
			self.getDefaultBinding().meta().set('buttonText', self.loadingButton);

			// TODO: Привести передачу сервисов к общему виду => вынести работу с сервисами за форму
			if (typeof self.props.onSubmit === 'function') {
				self.props.onSubmit(dateToPost);

				return false;
			}


			self.postedData = dateToPost;

			// TODO: Зарефакторить эту кашицу
			if (['object', 'function'].indexOf(typeOfService) !== -1) {
				userService = typeOfService === 'object' ? self.props.service.post.bind(self.props.service) : self.props.service;

				userService(dateToPost).then(self._onServiceSucces.bind(self), self._onServiceError.bind(self));

			} else {
				$.ajax({
					url: window.apiBase + '/' + self.props.service,
					type: 'POST',
					crossDomain: true,
					data: dateToPost,
<<<<<<< HEAD
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
							//This checks what the option user selected to register as eg coach or manager etc.
							//Subsequently adds the user to that table in the db
							switch (self.props.serviceType){
								case "coaches":
									window.Server.userCoach.post({id:data.id},data).then(function(res){console.log(res);});
									break;
								case "managers":
									break;
								case "parent":
									break;
								default :
									break;
							}
						}
					}
=======
					error: self._onServiceError.bind(self),
					success: self._onServiceSucces.bind(self)
>>>>>>> feature/69_1_feature
				});
			}

		}
	},
	_onServiceSucces: function(data) {
		var self = this;

		self.busy = false;
		self.buttonText = self.defaultButton;

		if (self.props.updateBinding === true) {
			self.getDefaultBinding().set(self.postedData);
		}

		if (self.props.onSuccess) {
			self.props.onSuccess(data);
		}
	},
	_onServiceError: function(data) {
		var self = this;

		if (self.props.onError) {
			self.props.onError(data);
		}
	},
	_createBindedClones: function(ownerInstance) {
		var self = this,
			binding = self.getDefaultBinding();

		ownerInstance.props.children = React.Children.map(ownerInstance.props.children, function (child) {
			if (child.props.type === 'column'){
				self._createBindedClones(child);
			}

			return React.addons.cloneWithProps(child, {
				binding: binding.meta(child.props.field),
				service: self.props.service
			});
		});
	},
	_keyPress: function(event) {
		var self = this,
			keyCode = event.keyCode;

		if (keyCode === 13) {
			self.refs.submitButton.getDOMNode().focus();
			self.tryToSubmit();
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
		self._createBindedClones(self);

		return (
			<div className="bForm" onKeyDown={self._keyPress}>
				<div className="eForm_atCenter">

					{Title}

					{self.props.children}

					<div className="eForm_savePanel">
						<div className="bButton mRight" tabIndex="-1" ref="submitButton" onClick={self.tryToSubmit}>{binding.meta().get('buttonText')}</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Form;
