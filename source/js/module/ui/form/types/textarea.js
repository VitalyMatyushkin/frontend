/**
 * Created by bridark on 04/08/15.
 */
const   TypeMixin   = require('module/ui/form/types/type_mixin'),
        React       = require('react');

const TypeTextArea =  React.createClass({
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

        if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.value === '') {
            self.refs.fieldInput.value = value;
            self.fullValidate(value);
        }
    },
    handeBlur: function(event) {
        var self = this;

        self.setValue(self.refs.fieldInput.value);
    },
    handleChange: function(event) {
        var self = this;

        self.changeValue(self.refs.fieldInput.value);
    },
    render: function () {
        var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue');

        return (
			<textarea ref="fieldInput" type={self.props.textType || 'textarea'} placeholder={self.props.placeholder} onBlur={self.handeBlur} onChange={self.handleChange}></textarea>
        )
    }
});


module.exports = TypeTextArea;