const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		TeamHelper	= require('module/ui/managers/helpers/team_helper'),
		EventHelper	= require('module/helpers/eventHelper');

const SetTeamsLater = React.createClass({
	mixins: [Morearty.Mixin],
	playersListener: undefined,
	propTypes: {
		event:						React.PropTypes.object.isRequired,
		handleIsSelectTeamLater:	React.PropTypes.func
	},
	isShowSetTeamsLater: function(event) {
		const isFinishedEvent = typeof event.status !== 'undefined' ? !EventHelper.isNotFinishedEvent(event) : false;

		return (
			!(EventHelper.isInterSchoolsEvent(event) && event.sportModel.multiparty) &&
			!(TeamHelper.isInternalEventForTeamSport(event) && event.sportModel.multiparty) &&
			!(EventHelper.isInternalEvent(event) && isFinishedEvent)
		);
	},
	isSetTeamLater: function() {
		return this.getDefaultBinding().toJS('isSetTeamLater');
	},
	changeIsSetTeamLater: function() {
		const binding = this.getDefaultBinding();

		typeof this.props.handleIsSelectTeamLater !== 'undefined' && this.props.handleIsSelectTeamLater();

		binding
			.atomically()
			.set('teamName.name',						Immutable.fromJS(undefined))
			.set('teamName.prevName',					Immutable.fromJS(undefined))
			.set('___teamManagerBinding.teamStudents',	Immutable.fromJS([]))
			.set('isSetTeamLater',						Immutable.fromJS(!binding.toJS('isSetTeamLater')))
			.commit();
		/*
		 .set('___teamManagerBinding.blackList',		Immutable.fromJS([]))
		 If clear black list here, the list of students for teams can be duplicated
		 */
	},
	render: function() {
		if(this.isShowSetTeamsLater(this.props.event)) {
			return (
				<div className="eManager_group">
					<div className="eManager_label">{'Select Team Later'}</div>
					<div className="eManager_radiogroup">
						<input	onChange	= { this.changeIsSetTeamLater }
								checked		= { this.isSetTeamLater() }
								type		= "checkbox"
						/>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SetTeamsLater;