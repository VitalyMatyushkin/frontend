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
        ReactDOM    = require('reactDom'),
        Immutable 	= require('immutable'),
        classNames  = require('classnames'),
        $           = require('jquery');

const Form = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        onSubmit: React.PropTypes.func,
        onSuccess: React.PropTypes.func,
        onError: React.PropTypes.func,
        name: React.PropTypes.string,
        defaultButton: React.PropTypes.string,
        loadingButton: React.PropTypes.string,
        updateBinding: React.PropTypes.bool,
        formStyleClass: React.PropTypes.string
    },
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding();

        self.defaultButton = self.props.defaultButton || 'Continue';
        self.loadingButton = self.props.loadingButton || 'Loading...';

        binding.addListener('', function (ChangesDescriptor) {
            var data = binding.toJS();

            data && ChangesDescriptor.isValueChanged() && self._setDefaultValues();
        });

        binding.meta().clear();
        self._setDefaultValues();
        binding.meta().set('buttonText', self.defaultButton);
        self.busy = false;
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
    tryToSubmit: function () {
        const   self            = this,
                token           = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo').get('userId'),
                fields          = self.getDefaultBinding().meta().toJS(),
                typeOfService   = typeof self.props.service;

        let     hereIsError     = false,
                dataToPost      = {};

        if (self.busy === true) {
            return false;
        }

        // checking data fields validness
        for (var field in fields) {
            dataToPost[field] = fields[field].value;

            if (fields[field].error) {
                self.getDefaultBinding().meta().update(field, function (immutableValue) {
                    hereIsError = true;
                    return immutableValue.set('showError', true);
                });
            }
        }

        React.Children.forEach(this.props.children, function (child) {
            if(child.props.onPrePost !== undefined) {
                dataToPost[child.props.field] = child.props.onPrePost(dataToPost[child.props.field]);
            }
        }.bind(self));

        //TODO: Заменить dataToPost на Merge данных из statePath
        //TODO: WTF??
        dataToPost.ownerId = token;

        // if there is no errors, calling service
        if (hereIsError === false) {

            self.busy = true;
            self.getDefaultBinding().meta().set('buttonText', self.loadingButton);

            // TODO: Привести передачу сервисов к общему виду => вынести работу с сервисами за форму
            if (typeof self.props.onSubmit === 'function') {
                self.props.onSubmit(dataToPost);

                return false;
            }

            if (typeof self.props.onPreSubmit === 'function') {
                dataToPost = self.props.onPreSubmit(dataToPost);
            }

            self.postedData = dataToPost;

            // TODO: Зарефакторить эту кашицу
            if (['object', 'function'].indexOf(typeOfService) !== -1) {
                const userService = typeOfService === 'object' ? self.props.service.post.bind(self.props.service) : self.props.service;
                userService(dataToPost).then(self._onServiceSucces/*.bind(self)*/, self._onServiceError/*.bind(self)*/); // React told we don't need .bind()
            } else {
                var type = typeof dataToPost.id === 'string' ? 'PUT' : 'POST';
                var url = type === 'PUT' ? (window.apiBase + '/' + self.props.service + '/' + dataToPost.id) :(window.apiBase + '/' + self.props.service);
                $.ajax({
                    url: url,
                    type: type,
                    crossDomain: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: type === 'PUT' ? JSON.stringify(dataToPost) : JSON.stringify(dataToPost),
                    error: self._onServiceError.bind(self),
                    success: self._onServiceSucces.bind(self)
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
    _onServiceError: function (data) {
        var self = this;
        self.busy = false;
        self.buttonText = self.defaultButton;
        if (self.props.onError) {
            self.props.onError(data);
        }
    },

    _createBindedClones: function(parent) {
        const    self    = this,
                binding = self.getDefaultBinding();

            /** recursively traversing all children and their children and their children....
             * as setting binding to them
             */
            function processChildren(parent) {
                return React.Children.map(parent.props.children, function(child){
                    if(child.props.type === 'column') { // but we need to go deeper..
                        var nestedChildren = processChildren(child); // processing all current child children
                        return React.cloneElement(
                            child,
                            {
                                binding: binding.meta(child.props.field),
                                service: self.props.service
                            },
                            nestedChildren                            // and setting them back to clone.
                        );
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
        const   self    = this,
                keyCode = event.keyCode;

        if (keyCode === 13) {
            ReactDOM.findDOMNode(self.refs.submitButton).focus();
            self.tryToSubmit();
        }
    },
    render: function () {
        const   self    = this,
                binding = self.getDefaultBinding();
        let Title;

        if (self.props.name !== undefined) {
            Title = <h2 dangerouslySetInnerHTML={{__html: self.props.name}}/>;
        }

        // Making children with current binding in case if user not disabled this option.
        var bindedChildren;
        if(self.props.propagateBinding === false) {
            bindedChildren = self.props.children;
        } else {
            bindedChildren = self._createBindedClones(self);
        }


        return (
            <div className={classNames('bForm', self.props.formStyleClass)} onKeyDown={self._keyPress}>
                <div className="eForm_atCenter">

                    {Title}

                    {bindedChildren}

                    <div className="eForm_savePanel">
                        <div className="bButton mRight" tabIndex="-1" ref="submitButton"
                             onClick={self.tryToSubmit}>{binding.meta().get('buttonText')}</div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Form;
