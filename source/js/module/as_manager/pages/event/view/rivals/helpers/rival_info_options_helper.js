const	propz						= require('propz'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		EventHelper					= require('module/helpers/eventHelper'),
		SchoolRivalInfoConsts		= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/consts/school_rival_info_consts'),
		SchoolRivalInfoButtonData	= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/models/school_rival_info_button_data');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const RivalInfoOptionsHelper = {
	getOptionsObjectForRivalInfoByRival: function(rival, activeSchoolId, schoolType, event, rivals, isShowControlButtons, handlers) {
		let options = {};

		if(
			schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL ?
				isShowControlButtons :
				true
		) {
			options = {
				// it's buttons for additional functional
				buttonsList: [
					new SchoolRivalInfoButtonData(
						SchoolRivalInfoConsts.BUTTON_TYPES.OPPONENT_SCHOOL_MANAGER_BUTTON,
						this.isShowChangeSchoolButtonByRival(rival, activeSchoolId, event),
						handlers.handleClickOpponentSchoolManagerButton
					),
					new SchoolRivalInfoButtonData(
						SchoolRivalInfoConsts.BUTTON_TYPES.REMOVE_TEAM_BUTTON,
						this.isShowRemoveTeamButtonByRival(rival, activeSchoolId, schoolType, event, rivals),
						handlers.handleClickRemoveTeamButton
					)
				]
			};
		}

		return options;
	},
	isInviteAccepted: function(rival) {
		const inviteStatus = propz.get(rival, ['invite', 'status']);

		return typeof inviteStatus !== 'undefined' ? inviteStatus === "ACCEPTED" : true;
	},
	isShowChangeSchoolButtonByRival: function(rival, activeSchoolId, event) {
		const isInviteAccepted = this.isInviteAccepted(rival);
		const isValidEventStatus = (
			event.status !== EventHelper.EVENT_STATUS.FINISHED &&
			event.status !== EventHelper.EVENT_STATUS.ACCEPTED
		);

		return (
			activeSchoolId === event.inviterSchoolId &&	// Active school is inviter school
			activeSchoolId !== rival.school.id &&		// Current rival is not active school
			!isInviteAccepted &&
			isValidEventStatus
		);
	},
	isShowRemoveTeamButtonByRival: function(currentRival, activeSchoolId, schoolType, event, rivals) {
		let isShowRemoveTeamButton = false;

		const activeSchoolRivals = rivals.filter(rival => rival.school.id === activeSchoolId);
		// main rule
		if(
			event.status !== EventHelper.EVENT_STATUS.FINISHED &&
			TeamHelper.isMultiparty(event) // only for inter-school multiparty event
		) {
			if(
				TeamHelper.isInterSchoolsEventForTeamSport(event) ||
				TeamHelper.isInterSchoolsEventForIndividualSport(event)
			) {
				// fork for case when active school is inviter school or not
				if(activeSchoolId === event.inviterSchoolId) {
					// fork for case when curent rival is active school school or not
					if(activeSchoolId === currentRival.school.id) {
						// user can remove active school team if active school teams more then 1
						// because user cant remove last school
						isShowRemoveTeamButton = activeSchoolRivals.length > 1;
					} else {
						// user can remove other team if other teams more than 1
						// because active school can't play with himself

						let LIMIT;
						switch (schoolType) {
							case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
								LIMIT = 1;
							}
							case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
								LIMIT = 2;
							}
						}

						isShowRemoveTeamButton = rivals.length - activeSchoolRivals.length > LIMIT;
					}
				} else {
					isShowRemoveTeamButton = (
						activeSchoolId === currentRival.school.id &&
						activeSchoolRivals.length > 1
					);
				}
			} else if(TeamHelper.isInternalEventForTeamSport(event)) {
				isShowRemoveTeamButton = rivals.length > 1;
			}
		}

		return isShowRemoveTeamButton;
	}
};

module.exports = RivalInfoOptionsHelper;