const	React							= require('react'),
		Immutable						= require('immutable'),
		Morearty						= require('morearty'),
		ScoreTable						= require('./score_table/score_table'),
		SportSelector					= require('./sport_selector'),
		SchoolUnionSeasonScoresStyles	= require('../../../../../../styles/ui/b_school_union_season_scores.scss');

const Scores = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		binding.set('isSync', false);

		window.Server.sports.get().then(sports => {
			binding.atomically()
				.set('sports', Immutable.fromJS(sports))
				.set('isSync', true)
				.commit();
		});
	},
	renderBody: function() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return (
				<div className="eSchoolUnionSeasonScores_body">
					<SportSelector binding={binding}/>
					<ScoreTable/>
				</div>
			);
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<div className="bSchoolUnionSeasonScores">
				<div className="eSchoolFixtureTab eNews_tab">
					<h1>Season Scores</h1><hr/>
					<span></span>
				</div>
				{this.renderBody()}
			</div>
		);
	}
});

module.exports = Scores;