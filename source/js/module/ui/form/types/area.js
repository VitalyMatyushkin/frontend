var TypeText = require('module/ui/form/types/text'),
	TypeMixin = require('module/ui/form/types/type_mixin'),
	Area;

Area = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	render: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			fieldStyleClass,
			baseView,
			confirmView;

		return (
			<TypeText {...self.props} />
		)
	}
});

module.exports = Area;
