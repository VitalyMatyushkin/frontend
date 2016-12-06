/**
 * Created by Anatoly on 31.07.2016.
 */
const 	React 		= require('react'),
		DateHelper 	= require('module/helpers/date_helper');

const FilterField = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object.isRequired
	},
	render: function() {
		const 	model = this.props.model,
				value = this.getValue(),
				classes = 'bBadge mType-' + model.type;

		return (
			<div className={classes} >
				<span className="eField">{model.field.text}</span>
				<span className="eValue">{value}</span>
				<span className="eDelete" onClick={model.onDelete.bind(model)}>&#10060;</span>
			</div>
		);
	},
	getValue: function(){
		const 	model = this.props.model;
		let res = null;

		switch (model.type){
			case 'between-date':
				res = this._getBetweenDateValue();
				break;
			case 'between-date-time':
				res = this._getBetweenDateTimeValue();
				break;				
			case 'multi-select':
				res = this._getKeyValuePairs();
				break;
			default:
				res = this._getDefaultValue();
				break;
		}
		return res;
	},
	_getDefaultValue:function(){
		return this.props.model.values[0];
	},
	_getBetweenDateValue:function(){
		const values = this.props.model.values;
		let result = '';

		result += values[0] ? 'from ' + DateHelper.toLocal(values[0]) + ' ' : '';
		result += values[1] ? 'to ' + DateHelper.toLocal(values[1]) : '';

		return result;
	},
	_getBetweenDateTimeValue:function(){
		const values = this.props.model.values;
		let result = '';

		result += values[0] ? 'from ' + DateHelper.toLocalDateTime(values[0]) + ' ' : '';
		result += values[1] ? 'to ' + DateHelper.toLocalDateTime(values[1]) : '';

		return result;
	},	
	_getKeyValuePairs:function(){
		const values = this.props.model.values;

		return values.map(item => item.value).join(', ');
	}
});

module.exports = FilterField;