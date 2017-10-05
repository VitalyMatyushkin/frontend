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
		options: React.PropTypes.array.isRequired,
		defaultValue: React.PropTypes.string,
		onSelect: React.PropTypes.func,
        id: React.PropTypes.string
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		if (typeof this.props.defaultValue !== 'undefined') {
			binding.set('value', this.props.defaultValue);
		}
	},
	renderOptions:function(){
		return this.props.options.map( (item, i) => {

			if(typeof item === 'string')
				/** string option */
				return <option key={item+'-'+i} value={item}>{item}</option>;

			/** {value, text} object */
			if (typeof item === 'object') {
				let valueSelect = (item.value === null || typeof item.value === 'undefined') ? NULL_STRING : item.value;
				return <option key={valueSelect+'-'+i} value={valueSelect}>{item.text}</option>;
			}			
		});

	},
	onChange:function(e){
		const value = e.currentTarget.value,
				binding = this.getDefaultBinding();

		if (value === NULL_STRING) {
			binding.set('value', null);
		} else {
			this.setValue(value);
			typeof this.props.onSelect !== 'undefined' && this.props.onSelect(value);
		}

		e.stopPropagation();
	},
	render:function(){
		const 	binding	= this.getDefaultBinding(),
				value	= binding.get('value');

		let valueSelect = (value === null || typeof value === 'undefined') ? NULL_STRING : value;

		return (
			<select id={this.props.id} value={valueSelect} onChange={this.onChange}>
				{this.renderOptions()}
			</select>
		);
	}
});

module.exports = TypeDropDown;