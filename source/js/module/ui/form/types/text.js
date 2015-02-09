var TypeText,
	TypeMixin = require('module/ui/form/types/input_mixin'),
	TextMixin = require('module/ui/form/types/text_mixin');

TypeText = React.createClass({
	mixins: [Morearty.Mixin, TextMixin, TypeMixin]
});

module.exports = TypeText;
