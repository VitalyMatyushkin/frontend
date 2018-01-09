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
		id: React.PropTypes.string, 		// just old good html id
		valueReader: React.PropTypes.func,
		valueWriter: React.PropTypes.func
	},
	onChange: function(event) {
		this.setValue(this.writeValue(event.target.checked));

		event.stopPropagation();
	},
	// external value to boolean conversion
	readValue: function(value) {
		if(this.props.valueReader) {
			return this.props.valueReader(value);
		} else {
			return Boolean(value);
		}
	},
	// boolean to external value conversion
	writeValue: function(value) {
		if(this.props.valueWriter) {
			return this.props.valueWriter(value);
		} else {
			return value;
		}
	},
	render: function () {
		const value = this.readValue(this.getDefaultBinding().get('value'));

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
