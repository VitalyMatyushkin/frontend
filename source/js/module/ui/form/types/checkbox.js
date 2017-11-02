/**
 * Created by Anatoly on 13.06.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty'),
		TypeMixin	= require('module/ui/form/types/type_mixin'),
		Checkbox	= require('module/ui/checkbox/checkbox');

const TypeCheckbox =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
		propTypes: {
			id: React.PropTypes.string 		// just old good html id
		},
	onChange: function(event) {
		this.setValue(event.target.checked);

		event.stopPropagation();
	},
	render: function () {
		const value = Boolean(this.getDefaultBinding().get('value'));

		return (
			<Checkbox
				isChecked	= { value }
				onChange	= { this.onChange }
				id			= { this.props.id }
			/>
		)
	}
});


module.exports = TypeCheckbox;
