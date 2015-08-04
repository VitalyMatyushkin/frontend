/**
 * Created by bridark on 04/08/15.
 */
var TypeMixin = require('module/ui/form/types/type_mixin'),
    TypeTextArea;

TypeTextArea =  React.createClass({
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
    _forceNewValue: function(value) {
        var self = this,
            oldValue;

        if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.getDOMNode().value === '') {
            self.refs.fieldInput.getDOMNode().value = value;
            self.fullValidate(value);
        }
    },
    handeBlur: function(event) {
        var self = this;

        self.setValue(self.refs.fieldInput.getDOMNode().value);
    },
    handleChange: function(event) {
        var self = this;

        self.changeValue(self.refs.fieldInput.getDOMNode().value);
    },
    render: function () {
        var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue');
        if(typeof self.props.defaultValueString === 'undefined'){
            self._forceNewValue(defaultValue);
        }else{
            self._forceNewValue(self.props.defaultValueString);
        }
        return (
            <div className="eForm_fieldInput">
                <textarea ref="fieldInput" type={self.props.textType || 'textarea'} onBlur={self.handeBlur} onChange={self.handleChange}></textarea>
            </div>
        )
    }
});


module.exports = TypeTextArea;