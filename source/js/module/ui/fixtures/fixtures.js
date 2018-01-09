/**
 * Created by Anatoly on 10.10.2016.
 */

const   React           = require('react'),
		FixtureTitle 	= require('./fixture_title'),
		FixtureList 	= require('./fixture_list');

const EventFixtures = React.createClass({
	propTypes:{
		date: 			React.PropTypes.object.isRequired,
		activeSchoolId: React.PropTypes.string,
		onClick: 		React.PropTypes.func,
		sync: 			React.PropTypes.bool
	},
	render: function () {
        const   date  			= this.props.date,
				activeSchoolId  = this.props.activeSchoolId,
				onClick 		= this.props.onClick;

		return (
			<div className="bChallenges">
				<FixtureTitle />
				<FixtureList key={date} children={this.props.children} childIdList ={this.props. childIdList} date={date} activeSchoolId={activeSchoolId} onClick={onClick} />
			</div>
        );
	}
});


module.exports = EventFixtures;
