/**
 * Created by Anatoly on 30.07.2016.
 */

const React = require('react');

const FilterStringType = React.createClass({
	propTypes: {
		filterField: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {value: ''};
	},
	onChange:function(e){
		const 	model = this.props.filterField;

		this.setState({value: e.target.value});
		model.onChange.bind(model, e.target.value)();

		e.stopPropagation();
	},
	render: function() {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				value = badge && badge.values ? badge.values[0] : '',
				placeholder = 'Enter ' + model.field.text;

		return (
			<input type="text" className="eFilterTypeString" id={model.id} value={value} placeholder={placeholder}
				   onChange={this.onChange} />
		);
	}
});

module.exports = FilterStringType;
