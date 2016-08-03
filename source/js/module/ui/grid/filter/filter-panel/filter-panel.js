/**
 * Created by Anatoly on 24.07.2016.
 */
const   FilterField = require('./filter-field'),
		BadgeArea 	= require('./badge-area'),
		React 		= require('react');

const FilterPanel = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object.isRequired
	},
	render: function() {
		const 	model 	= this.props.model,
				fields 	= model.filterFields;

		return (
			<div className="bFilterPanel">
				<div className="bFilterFields">
					{fields.map((field, index) => {
						return <FilterField key={index} model={field} />;
					})}
				</div>
				<BadgeArea model={model.badgeArea} />
			</div>
		);
	}
});

module.exports = FilterPanel;