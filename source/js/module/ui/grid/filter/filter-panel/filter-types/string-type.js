/**
 * Created by Anatoly on 30.07.2016.
 */

const React = require('react');

const FilterStringType = React.createClass({
	propTypes: {
		filterField: React.PropTypes.object
	},
	onChange:function(e){
		const 	model = this.props.filterField;

		model.onChange.bind(model, e)();
	},
	render: function() {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				value = badge && badge.values ? badge.values[0] : '';
		return (
			<input type="text" className="eFilterTypeString" value={value} onChange={this.onChange} />
		);
	}
});

module.exports = FilterStringType;
