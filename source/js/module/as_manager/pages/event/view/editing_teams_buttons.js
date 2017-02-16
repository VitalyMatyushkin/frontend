/**
 * Created by Anatoly on 08.12.2016.
 */
const	React 			= require('react'),
		Morearty		= require('morearty');

const	If				= require('module/ui/if/if'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		PencilButton	= require('../../../../ui/pencil_button');

const EditingTeamsButtons = React.createClass({
	mixins: [Morearty.Mixin],
	handleClickChangeTeamsButtons: function (index) {
		this.getDefaultBinding()
			.atomically()
			.set('mode',				'edit_squad')
			.set('selectedRivalIndex',	index)
			.commit();
	},
	render:function () {
		const	binding		= this.getDefaultBinding();

		const	event		= binding.toJS('model');

		return (
			<If condition={TeamHelper.isShowEditEventButton(this)}>
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
			</If>
		);
	}
});

module.exports = EditingTeamsButtons;