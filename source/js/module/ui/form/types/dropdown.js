/**
 * Created by Anatoly on 03.10.2016.
 */

const   React       = require('react'),
		Morearty    = require('morearty'),
		TypeMixin   = require('module/ui/form/types/type_mixin');

const NULL_STRING = '_null_';

/**
 * The select list form component
 * @param {array} options - array of options (string or {value, text} object)
 * */
const TypeDropDown = React.createClass({
	mixins:[Morearty.Mixin, TypeMixin],
	propTypes: {
		options: React.PropTypes.array.isRequired
	},
	renderOptions:function(){
		return this.props.options.map( (item, i) => {
			if(typeof item === 'string')
				/** string option */
				return <option key={item+'-'+i} value={item}>{item}</option>;

			/** {value, text} object */
			return <option key={item.value+'-'+i} value={item.value}>{item.text}</option>;
		});

	},
	onChange:function(e){
		const value = e.currentTarget.value,
				binding = this.getDefaultBinding();

		if (value === NULL_STRING) {
			binding.set('value', null);
		} else {
			this.setValue(value);
		}

		e.stopPropagation();
	},
	render:function(){
		const 	binding	= this.getDefaultBinding(),
				value	= binding.get('value');
		let valueSelect = value === null ? NULL_STRING : value;

		return (
			<select value={valueSelect} onChange={this.onChange}>
				{this.renderOptions()}
			</select>
		);
	}
});

module.exports = TypeDropDown;