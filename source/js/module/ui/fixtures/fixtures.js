/**
 * Created by Anatoly on 10.10.2016.
 */

const   React           = require('react'),
		FixtureTitle 	= require('./fixture_title'),
		FixtureList 	= require('./fixture_list');

const RandomHelper = require('module/helpers/random_helper');

const EventFixtures = React.createClass({
	propTypes:{
		date: 			React.PropTypes.object.isRequired,
		activeSchoolId: React.PropTypes.string,
		onClick: 		React.PropTypes.func,
        childIdList: 	React.PropTypes.array,
        children: 		React.PropTypes.array,
        schoolId: 		React.PropTypes.array || React.PropTypes.string,
        schoolIdList: 	React.PropTypes.array,
        school: 		React.PropTypes.array,
        mode: 			React.PropTypes.string.isRequired,
		region:			React.PropTypes.string
	},
	render: function () {
        const   date  			= this.props.date,
				activeSchoolId  = this.props.activeSchoolId,
				onClick 		= this.props.onClick;

		return (
			<div className="bChallenges">
				<FixtureTitle />
				<FixtureList
					key				= {RandomHelper.getRandomString()}
					mode			= {this.props.mode}
					children		= {this.props.children}
					childIdList 	= {this.props. childIdList}
					date			= {date}
					activeSchoolId	= {activeSchoolId}
					onClick			= {onClick}
					school			= {this.props.school}
					schoolId		= {this.props.schoolId}
					schoolIdList	= {this.props.schoolIdList}
					region			= {this.props.region}
				/>
			</div>
        );
	}
});


module.exports = EventFixtures;
