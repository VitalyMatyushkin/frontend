/**
 * Created by Anatoly on 31.07.2016.
 */
const 	React 		= require('react');

const FilterField = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
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
		let res = null;

		switch (this.type){
			default:
				res = this._getDefaultValue();
				break;
		}
		return res;
	},
	_getDefaultValue:function(){
		return this.props.model.values[0];
	}
});

module.exports = FilterField;