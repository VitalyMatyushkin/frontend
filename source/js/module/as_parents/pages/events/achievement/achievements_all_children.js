/**
 * Created by Anatoly on 17.03.2016.
 */

const   React 		= require('react'),
		EventHelper	= require('module/helpers/eventHelper'),
		Immutable   = require('immutable'),
        Morearty 	= require('morearty');

const AchievementsAllChildren = React.createClass({
    mixins: [Morearty.Mixin],
	componentDidMount:function(){
		const   self    = this,
			binding = self.getDefaultBinding(),
			children = binding.toJS('children');

		if(children.length){
			self.getData();
		}else{
			self.addBindingListener(binding, 'children', self.getData);
		}
	},
	getData: function(){
		const   self    = this,
			binding = self.getDefaultBinding(),
			children = binding.toJS('children'),
			ids = children && children.map(ch => ch.id);

		if(ids){
			window.Server.childrenEventsCount.get({filter:{
				where:{
					childIdList: ids,
					winnersChildIdList: ids,
					scoredChildIdList: ids,
					status: EventHelper.EVENT_STATUS.FINISHED
				}
			}}).then(data => {
				binding.set('allAchievements', Immutable.fromJS(data));
			});
		}
	},
    renderAllAchievements:function(){
        const   self    = this,
                binding = self.getDefaultBinding(),
				children = binding.toJS('children'),
				achievements = binding.toJS('allAchievements');

        let result = <div className="eAchievement_row">{'no data'}</div>;

        if(children && children.length && achievements) {
            result = children.map(function (child, i) {
				const childName = child.firstName + ' ' + child.lastName,
					gamesPlayed = achievements.childEventCount[i],
					gamesWon = achievements.childWinnerEventCount[i],
					gamesLost = gamesPlayed - gamesWon,
					gamesScored = achievements.childScoredEventCount[i];

                return (
                    <div key={i} className="eAchievement_row">
                        <div
                            className="eAchievement_common eAchievement_name">{childName}</div>
                        <div
                            className="eAchievement_common eAchievementGamesPlayed">{gamesPlayed}</div>
                        <div className="eAchievement_common eAchievementGamesWon">{gamesWon}</div>
                        <div className="eAchievement_common eAchievementGamesLost">{gamesLost}</div>
                        <div className="eAchievement_common eAchievementGoalsScored">{gamesScored}</div>
                    </div>
                )
            });
        }

        return result;
    },
    render: function () {
        const self = this;

        return (
            <div className="eAllAchievements_container">
                <div className="eAchievement_header">
                    <div className="eAchievement_common eAchievement_name">Child Name</div>
                    <div className="eAchievement_common eAchievementGamesPlayed">Games Played</div>
                    <div className="eAchievement_common eAchievementGamesWon">Games Won</div>
                    <div className="eAchievement_common eAchievementGamesLost">Games Lost</div>
                    <div className="eAchievement_common eAchievementGoalsScored">Games Scored</div>
                </div>
                {self.renderAllAchievements()}
            </div>
        )
    }
});

module.exports = AchievementsAllChildren;
