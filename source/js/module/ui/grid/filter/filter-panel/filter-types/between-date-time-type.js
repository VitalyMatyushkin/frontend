/**
 * Created by Anatoly on 05.12.2016.
 */

const 	React 	= require('react'),
		Date 	= require('module/ui/form/types/datetime');

const FilterBetweenDateTimeType = React.createClass({
	propTypes: {
		filterField: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {values:null};
	},
	getValueFrom: function() {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';

		return valueTo;
	},
	onChangeFrom:function(value){
		const 	model = this.props.filterField,
				valueTo = this.getValueFrom(),
				values = [value, valueTo];

		this.setState({values:values});

		model.onChange(values);
	},
	getValueTo: function(){
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '';

		return valueFrom;
	},
	onChangeTo:function(value){
		const model = this.props.filterField,
				valueFrom = this.getValueTo(),
				values = [valueFrom, value];

		this.setState({values:values});

		model.onChange(values);
	},
	render: function() {
		const valueFrom = this.getValueTo(),
				valueTo = this.getValueFrom();

		return (
			<div className="eBetweenDateTime">
				<label>from</label><Date value={valueFrom} onBlur={this.onChangeFrom} />
				<label>to</label><Date value={valueTo} onBlur={this.onChangeTo} />
			</div>
		);
	}
});

module.exports = FilterBetweenDateTimeType;
