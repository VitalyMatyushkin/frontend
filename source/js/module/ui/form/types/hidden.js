/**
 * Created by bridark on 08/06/15.
 */
const   TypeMixin 	= require('module/ui/form/types/type_mixin'),
        React 		= require('react'),
        ReactDOM 	= require('react-dom'),
        Morearty 	= require('morearty');

const TypeHidden =  React.createClass({
    propTypes: {
        textType: React.PropTypes.string
    },
    mixins: [Morearty.Mixin, TypeMixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding();

        // На случай, если форма заполняется асинхронно
        binding.addListener('defaultValue', function() {
            self._forceNewValue(binding.get('defaultValue'));
        });
    },
    componentDidMount:function(){
        var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue');
        self._forceNewValue(defaultValue);
    },
    componentDidUpdate:function(){
        var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue');
        self._forceNewValue(defaultValue);
    },
    _forceNewValue: function(value) {
        var self = this,
            oldValue;

        if (value !== undefined && ReactDOM.findDOMNode(self.refs.fieldInput) && ReactDOM.findDOMNode(self.refs.fieldInput).value === '') {
            ReactDOM.findDOMNode(self.refs.fieldInput).value = value;
            self.fullValidate(value);
        }
    },
    handeBlur: function(event) {
        var self = this;

        self.setValue(ReactDOM.findDOMNode(self.refs.fieldInput).value);
    },
    handleChange: function(event) {
        var self = this;

        self.changeValue(ReactDOM.findDOMNode(self.refs.fieldInput).value);
    },
    render: function () {
        var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue');

        return (
            <div className="eForm_fieldInput mHidden">
                <input id="blazonInput" ref="fieldInput" type={self.props.textType || 'text'} onBlur={self.handeBlur} onChange={self.handleChange} />
            </div>
        )
    }
});


module.exports = TypeHidden;