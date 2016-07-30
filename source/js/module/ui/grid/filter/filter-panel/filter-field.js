/**
 * Created by Anatoly on 30.07.2016.
 */
const 	TypeList 	= require('./filter-types/filter-type-list'),
		React 		= require('react');

const FilterField = React.createClass({
	propTypes: {
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
			<div className="bFilterField">
				<div className="eField">
					<span className="eText"></span>
					<span className="eArrow"></span>
				</div>
				<div className="eFilterContainer">

				</div>
			</div>
		);
	}
});

module.exports = FilterField;