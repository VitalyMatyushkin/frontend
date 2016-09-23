/**
 * Created by Anatoly on 22.09.2016.
 */

const   React           = require('react'),
        Morearty        = require('morearty'),
		FixtureTitle 	= require('./fixture_title'),
		FixtureList 	= require('./fixture_list');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	onClickChallenge: function (eventId) {
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
    getFixtures: function () {
        const   self    		= this,
				activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
                binding 		= self.getDefaultBinding();

        let result = null;

        if(binding.toJS('sync')) {
			result = (
				<FixtureList events={binding.toJS('models')} activeSchoolId={activeSchoolId} onClick={self.onClickChallenge} />
			);
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
