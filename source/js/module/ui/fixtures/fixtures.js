/**
 * Created by Anatoly on 10.10.2016.
 */

const   React           = require('react'),
		Loader 			= require('module/ui/loader'),
		FixtureTitle 	= require('./fixture_title'),
		FixtureList 	= require('./fixture_list');

const EventFixtures = React.createClass({
	propTypes:{
		events: 		React.PropTypes.array.isRequired,
		activeSchoolId: React.PropTypes.string,
		onClick: 		React.PropTypes.func,
		sync: 			React.PropTypes.bool
	},
    getFixtures: function () {
        const   events  		= this.props.events,
				activeSchoolId  = this.props.activeSchoolId,
				sync  			= this.props.sync,
				onClick 		= this.props.onClick;

        let result;

        if(sync) {
			result = (
				<FixtureList events={events} activeSchoolId={activeSchoolId} onClick={onClick} />
			);
        } else {
			result = <div><br /><br /><Loader /></div>;
		}

        return result;
    },
	render: function () {
        const   challenges = this.getFixtures();

		return (
			<div className="bChallenges">
				<FixtureTitle />
				{challenges}
			</div>
        );
	}
});


module.exports = EventFixtures;
