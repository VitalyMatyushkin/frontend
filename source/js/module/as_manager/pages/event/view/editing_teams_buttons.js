/**
 * Created by Anatoly on 08.12.2016.
 */
const 	React 		= require('react'),
		Morearty	= require('morearty'),
		If			= require('module/ui/if/if'),
		EventHelper	= require('module/helpers/eventHelper'),
		TeamHelper	= require('module/ui/managers/helpers/team_helper');

const EditingTeamsButtons = React.createClass({
	mixins: [Morearty.Mixin],
	handleClickChangeTeamsButtons: function (index) {
		const binding	= this.getDefaultBinding();

		binding.set('mode', 'edit_squad');
		binding.set('selectedRivalIndex', index);
	},
	render:function () {
		const	binding		= this.getDefaultBinding();

		const	event		= binding.toJS('model'),
				condition 	= !EventHelper.isInterSchoolsEvent(event) && !TeamHelper.isInternalEventForIndividualSport(event);

		return (
			<If condition={TeamHelper.isShowEditEventButton(this)}>
				<div className="bEventMiddleSideContainer_buttons">
					<div className="bButton mCircle"
						 onClick={this.handleClickChangeTeamsButtons.bind(null, 0)}
					>
						<i className="fa fa-pencil" aria-hidden="true"/>
					</div>
					<If condition={!TeamHelper.isInternalEventForIndividualSport(event)}>
						<div className="eRightButtonColumn">
							<If condition={!EventHelper.isInterSchoolsEvent(event)}>
								<div className="bButton mCircle"
									 onClick={this.handleClickChangeTeamsButtons.bind(null, 1)}
								>
									<i className="fa fa-pencil" aria-hidden="true"/>
								</div>
							</If>
						</div>
					</If>
				</div>
			</If>
		);
	}
});

module.exports = EditingTeamsButtons;