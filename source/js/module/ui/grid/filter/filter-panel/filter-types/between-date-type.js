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
		return {
			from: '',
			to: ''
		};
	},
	onChangeFrom:function(value){
		const 	model = this.props.filterField,
				state = this.state;

		this.setState({
			from: value,
			to: state.to
		});
		model.onChange([value, state.to]);
	},
	onChangeTo:function(value){
		const 	model = this.props.filterField,
				state = this.state;

		this.setState({
			from: state.from,
			to: value
		});
		model.onChange([state.from, value]);
	},
	render: function() {
		const 	model = this.props.filterField,
				badge = model.getBadge(),
				valueFrom = badge && badge.values && badge.values.length > 0 ? badge.values[0] : '',
				valueTo = badge && badge.values && badge.values.length === 2 ? badge.values[1] : '';
		console.log('FilterBetweenDateType.value = '+ valueTo);

		return (
			<div className="eBetweenDate">
				{//	<label>from</label><Date value={valueFrom} onBlur={this.onChangeFrom} />
					 }
				<label>to</label><Date value={valueTo} onBlur={this.onChangeTo} />
			</div>
		);
	}
});

module.exports = FilterBetweenDateType;
