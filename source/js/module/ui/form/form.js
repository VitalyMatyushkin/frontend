/**
 * HTML Form.
 *
 * Can propagate self binding to all children ant their children.
 * Propagating binding is default behavior. To turn this option off provide `propagateBinding = false` property.
 *
 * In case of binding propagation all nested components will be copied and filled with binding of this form.
 * In this case injecting binding in all children is not necessary.
 *
 * NOTE: I'm not sure if binding propagation is good idea, but it was implemented in that way.
 *
 */
const   React       = require('react'),
        Immutable 	= require('immutable'),
        classNames  = require('classnames'),
		If			= require('module/ui/if/if'),
		Morearty	= require('morearty'),
        $           = require('jquery');

// TODO: do something with all this

const Form = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: 			React.PropTypes.func,
		onSuccess: 			React.PropTypes.func,
		onError: 			React.PropTypes.func,
		onCancel: 			React.PropTypes.func,
		name: 				React.PropTypes.string,
		defaultButton: 		React.PropTypes.string, // It should be name as defaultButtonText, stupid
		loadingButton: 		React.PropTypes.string,
		updateBinding: 		React.PropTypes.bool,
		// False by default, if true, then browser doesn't save data for this field.
		// For example, browser doesn't autocomplete old password and new password fields in restore password form.
		autoupdateOff: 		React.PropTypes.bool,
		formStyleClass: 	React.PropTypes.string,
		formButtonsClass: 	React.PropTypes.string,
		formTitleClass: 	React.PropTypes.string,
		submitOnEnter: 		React.PropTypes.bool, 	//submitting the form by pressing the Enter key
		hideCancelButton: 	React.PropTypes.bool,
		submitButtonId:		React.PropTypes.string,	// html id of submit button
		cancelButtonId:		React.PropTypes.string 	// html id of cancel button
	},
	getDefaultProps: function () {
		return {
			autoupdateOff: false,
			submitOnEnter: true
		};
	},
	componentWillMount: function () {
		const 	self = this,
				binding = self.getDefaultBinding();

		self.defaultButton = self.props.defaultButton || 'Continue';
		self.loadingButton = self.props.loadingButton || 'Loading...';

		self.listener = binding.addListener('', ChangesDescriptor => {
			const data = binding.toJS();

			data && ChangesDescriptor.isValueChanged() && self._setDefaultValues();
		});

		binding.meta().clear();
		self._setDefaultValues();
		binding.meta().set('buttonText', self.defaultButton);
		self.busy = false;
	},

	/**
	 * Get only components FormFields (without FormColumn, h3, div, etc)
	 * */
	getFormFields: function () {
		const self = this;

		function processChildren(parent) {
			React.Children.forEach(parent.props.children, function (child) {
				if (child.props.type === 'column') { // but we need to go deeper..
					processChildren(child); // processing all current child children
				}
				if (child.props.field) {
					self._fieldList.push(child);
				}
			});
		}

		if (!self._fieldList) {
			self._fieldList = [];

			processChildren(self);
		}

		return self._fieldList;
	},
	/**
	 * TODO:
	 * Emhhh. I'm not sure what it really does even after reading russian description. So let russian comment will stay
	 * here for a while.
	 *
	 * Метод переносит значение из заданного поля в поле со значением по умочанию
	 * Такой подход необходим, т.к. данные могут прийти асинхронно, а значит поле value у node-элемента
	 * привязать к модели напрямую нелья
	 * @private
	 */
	_setDefaultValues: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			fields = self.getFormFields();

		fields.forEach(child => {
			const field = child.props.field;

			binding.meta().merge(field, false, Immutable.Map({
				value: binding.get(field),
				defaultValue: binding.get(field),
				active: true 	//form field is active by default. (if (FormField.props.condition === false) then active = false)
			}));
		});
	},
	onCancel:function(){
		if(this.props.onCancel)
			this.props.onCancel();
		else
			window.history.back();
	},
	tryToSubmit: function () {
		const self = this,
			binding = self.getDefaultBinding(),
			token = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId'),
			fields = self.getFormFields(),
			metaToPost = binding.meta().sub('____metaToPost____'),
			typeOfService = typeof self.props.service;

		let hereIsError = false,
			dataToPost = {};

		if (self.busy === true) {
			return false;
		}

		// checking data fields validness
		fields.forEach(child => {
			const field = child.props.field;

			if(binding.meta().get(`${field}.active`)){
				metaToPost.set(field, binding.meta().get(`${field}.value`));

				if (binding.meta().get(`${field}.error`)) {
					hereIsError = true;
					binding.meta().set(`${field}.showError`, true);
				}
			}
		});

		dataToPost = metaToPost.toJS();
		metaToPost.clear();
		binding.removeListener(self.listener);

		//TODO: not taken into account the presence of columns
		React.Children.forEach(this.props.children, function (child) {
			if (child.props.onPrePost !== undefined) {
				dataToPost[child.props.field] = child.props.onPrePost(dataToPost[child.props.field]);
			}
		}.bind(self));

		//TODO: Заменить dataToPost на Merge данных из statePath
		//TODO: WTF??
		dataToPost.ownerId = token;

		// if there is no errors, calling service
		if (hereIsError === false) {

			// TODO: Привести передачу сервисов к общему виду => вынести работу с сервисами за форму
			if (typeof self.props.onSubmit === 'function') {
				return self.props.onSubmit(dataToPost);
			}

			if (typeof self.props.onPreSubmit === 'function') {
				dataToPost = self.props.onPreSubmit(dataToPost);
			}

			self.busy = true;

			self.postedData = dataToPost;

			// TODO: Зарефакторить эту кашицу
			if (['object', 'function'].indexOf(typeOfService) !== -1) {
				const userService = typeOfService === 'object' ? self.props.service.post.bind(self.props.service) : self.props.service;
				userService(dataToPost).then(self._onServiceSucces, self._onServiceError); // React told we don't need .bind()
			} else {
				var type = typeof dataToPost.id === 'string' ? 'PUT' : 'POST';
				var url = type === 'PUT' ? (window.apiBase + '/' + self.props.service + '/' + dataToPost.id) : (window.apiBase + '/' + self.props.service);
				$.ajax({
					url: url,
					type: type,
					crossDomain: true,
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(dataToPost),
					error: self._onServiceError,
					success: self._onServiceSucces
				});
			}

		}
	},
	_onServiceSucces: function (data) {
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
		self.busy = false;
		self.buttonText = self.defaultButton;
		if (self.props.onError) {
			self.props.onError(data);
		}
	},

	_createBindedClones: function (parent) {
		const self = this,
			binding = self.getDefaultBinding();

		/** recursively traversing all children and their children and their children....
		 * as setting binding to them
		 */
		function processChildren(parent) {
			return React.Children.map(parent.props.children, function (child) {
				if (child.props.type === 'column' || child.props.type === 'placeholder') { // but we need to go deeper..
					var nestedChildren = processChildren(child); // processing all current child children
					return React.cloneElement(
						child,
						{
							binding: binding.meta(child.props.field),
							service: self.props.service
						},
						nestedChildren                            // and setting them back to clone.
					);
				} else if(child.props.type === 'title' || child.props.type === 'manager') {
					return React.cloneElement(child);
				} else {
					return React.cloneElement(child, {
						binding: binding.meta(child.props.field),
						service: self.props.service
					});
				}
			});
		}

		return processChildren(parent);
	},

	_keyPress: function (event) {
		const keyCode = event.keyCode;

		if (keyCode === 13 && this.props.submitOnEnter) {
			this.tryToSubmit();
		}
	},
	getTitle: function(){
		return this.props.name ? <h2 className={this.props.formTitleClass} dangerouslySetInnerHTML={{__html: this.props.name}}/> : null;
	},
	getAutoupdateOffElement: function(){
		return this.props.autoupdateOff ? (
			<div style={{display: 'none'}}>
				<input
					id="PreventChromeAutocomplete"
					type="text"
					name="PreventChromeAutocomplete"
					autocomplete="address-level4"
				/>
			</div>
		) : null;
	},
	render: function () {
		const binding = this.getDefaultBinding();

		return (
			<div className={classNames('bForm', this.props.formStyleClass)} onKeyDown={this._keyPress}>
				<div className="eForm_atCenter">

					{this.getAutoupdateOffElement()}

					{this.getTitle()}

					{this._createBindedClones(this)}

					<div className={classNames('eForm_savePanel', this.props.formButtonsClass)}>
						<If condition={!this.props.hideCancelButton}>
							<button className="bButton mRight mCancel mMarginRight" tabIndex="-1" onClick={this.onCancel} id={this.props.cancelButtonId}>
								Cancel
							</button>
						</If>
						<button className="bButton mRight" tabIndex="-1" onClick={this.tryToSubmit} id={this.props.submitButtonId}>
							{binding.meta().get('buttonText')}
						</button>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Form;
