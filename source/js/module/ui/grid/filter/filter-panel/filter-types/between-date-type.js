/**
 * Created by Anatoly on 30.07.2016.
 */

const 	React 	= require('react'),
		Date 	= require('module/ui/form/types/date');

const FilterBetweenDateType = React.createClass({
	propTypes: {
		filterField: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {values:null};
	},
	onChangeFrom:function(value){
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '',
				values = [value, valueTo];

		this.setState({values:values});

		model.onChange(values);
	},
	onChangeTo:function(value){
		const 	model = this.props.filterField,
			badge = model.getBadge(),
			valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
			values = [valueFrom, value];

		this.setState({values:values});

		model.onChange(values);
	},
	render: function() {
		const 	model = this.props.filterField,
				id = model.id,
				badge = model.getBadge(),
				valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';

		return (
			<div className="eBetweenDate" id={id}>
				<label>from</label><Date value={valueFrom} onBlur={this.onChangeFrom} />
				<label>to</label><Date value={valueTo} onBlur={this.onChangeTo} />
			</div>
		);
	}
});

module.exports = FilterBetweenDateType;
