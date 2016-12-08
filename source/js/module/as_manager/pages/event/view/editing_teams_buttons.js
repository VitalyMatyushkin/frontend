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
	handleClickChangeTeamsButtons: function () {
		const binding	= this.getDefaultBinding();

		binding.set('mode', 'edit_squad');
	},
	render:function () {
		const	binding		= this.getDefaultBinding();

		const	event		= binding.toJS('model'),
				condition 	= !EventHelper.isInterSchoolsEvent(event) && !TeamHelper.isInternalEventForIndividualSport(event);

		return (
			<If condition={TeamHelper.isShowEditEventButton(this)}>
				<div className="bEventMiddleSideContainer_buttons">
					<div className="bButton mCircle"
						 onClick={this.handleClickChangeTeamsButtons}
					>
						<i className="fa fa-pencil" aria-hidden="true"/>
					</div>
					<If condition={condition}>
						<div className="eRightButtonColumn">
							<div className="bButton mCircle"
								 onClick={this.handleClickChangeTeamsButtons}
							>
								<i className="fa fa-pencil" aria-hidden="true"/>
							</div>
						</div>
					</If>
				</div>
			</If>
		);
	}
});

module.exports = EditingTeamsButtons;