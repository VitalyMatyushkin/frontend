/**
 * Created by Anatoly on 08.12.2016.
 */
const	React 			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty');

const	If				= require('module/ui/if/if'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		PencilButton	= require('../../../../ui/pencil_button');

const	ManagerConsts	= require('module/ui/managers/helpers/manager_consts');

const EditingTeamsButtons = React.createClass({
	mixins: [Morearty.Mixin],
	handleClickChangeTeamsButtons: function (index) {
		this.getDefaultBinding()
			.atomically()
			.set('mode',				'edit_squad')
			.set('teamManagerMode',		ManagerConsts.MODE.CHANGE_TEAM)
			.set('selectedRivalIndex',	Immutable.fromJS(index))
			.commit();
	},
	render:function () {
		const	binding		= this.getDefaultBinding();

		const	event		= binding.toJS('model');

		return (
			<div className="bEventMiddleSideContainer_buttons">
				<PencilButton handleClick={this.handleClickChangeTeamsButtons.bind(null, 0)}/>
				<If condition={!TeamHelper.isInternalEventForIndividualSport(event)}>
					<div className="eRightButtonColumn">
						<If condition={!EventHelper.isInterSchoolsEvent(event)}>
							<PencilButton handleClick={this.handleClickChangeTeamsButtons.bind(null, 1)}/>
						</If>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = EditingTeamsButtons;