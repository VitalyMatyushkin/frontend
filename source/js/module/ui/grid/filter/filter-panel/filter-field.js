/**
 * Created by Anatoly on 30.07.2016.
 */
const 	TypeList 	= require('./filter-types/filter-type-list'),
		React 		= require('react');

const FilterField = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
	},
	render: function() {
		const 	model 			= this.props.model,
				FilterFieldType = TypeList[model.type];

		return (
			<div className="bFilterField">
				<div className="eField">{model.field.text}</div>
				<div className="eFilterContainer">
					<FilterFieldType filterField={model} />
				</div>
			</div>
		);
	}
});

module.exports = FilterField;