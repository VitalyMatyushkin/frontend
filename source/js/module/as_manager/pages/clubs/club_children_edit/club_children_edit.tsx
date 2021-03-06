import * as  React from 'react'
import * as  Morearty from 'morearty'
import * as  classNames from 'classnames'
import * as  Immutable from 'immutable'
import * as  Promise from 'bluebird'

import {TeamManager} from 'module/ui/managers/team_manager/team_manager'
import {Button} from 'module/ui/button/button'
import {ClubsChildrenEditHeader} from 'module/as_manager/pages/clubs/club_children_edit/club_children_edit_header'
import * as Error from 'module/ui/managers/models/error'
import * as Loader from 'module/ui/loader'

import * as TeamHelper from 'module/ui/managers/helpers/team_helper'
import * as RandomHelper from 'module/helpers/random_helper'
import {PlayerChoosersTabsModelFactory} from 'module/helpers/player_choosers_tabs_models_factory'
import {TeamManagerActions} from 'module/helpers/actions/team_manager_actions'
import {ManagerTypes} from 'module/ui/managers/helpers/manager_types'
import {ClubsChildrenBookingActionArea} from 'module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_action_area/clubs_children_booking_action_area'
import {ClubsActions} from 'module/as_manager/pages/clubs/clubs_actions'
import {ServiceList} from "module/core/service_list/service_list";
import {Sport} from "module/models/sport/sport";
import {ClubChildrenEditNotificationListPopupWrapper} from "module/as_manager/pages/clubs/club_children_edit/club_children_edit_notification_list_popup/club_children_edit_notification_list_popup_wrapper";
import {Item} from "module/ui/checkbox_list/models/item";
import {ClubsHelper} from "module/as_manager/pages/clubs/clubs_helper";

const	LoaderStyle					= require('styles/ui/loader.scss');
const	ClubcChildrenWrapperStyle	= require('styles/pages/b_club_children_manager_wrapper.scss');

export const ClubChildrenEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	listeners: [],
	playerChoosersTabsModel: undefined,
	teamManagerActions: undefined,
	
	componentWillMount() {
		const binding = this.getDefaultBinding();

		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();
		this.setNewManagerComponentKey();

		const clubId = this.props.clubId;

		let club, school, originParticipants, preparedParticipants;

		binding.set('isSync', false);
		if (typeof clubId !== 'undefined') {
			(window.Server as ServiceList).school.get(this.props.activeSchoolId).then(_school => {
				school = _school;

				return (window.Server as ServiceList).schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
			}).then(forms => {
				school.forms = forms;

				return (window.Server as ServiceList).schoolClub.get(
					{
						schoolId:	this.props.activeSchoolId,
						clubId:		clubId
					}

				);
			})
			.then(_club => {
				club = _club;

				binding.set('club', Immutable.fromJS(club));
				binding.set('error', Immutable.fromJS(
					new Error(
						undefined,
						'',
						false
					)
				));

				return (window.Server as ServiceList).schoolClubParticipants.get(
					{
						schoolId:	this.props.activeSchoolId,
						clubId:		clubId
					},{
						filter: { limit: 100 }
					}
				);
			})
			.then(_participants => {
				originParticipants = _participants;

				return ClubsActions.getAcceptableUsers(this.props.activeSchoolId, clubId);
			})
			.then(acceptableUsers => {
				preparedParticipants = this.getPreparedParticipantsByAcceptableUsers(originParticipants, acceptableUsers);

				binding.set('prevParticipants', Immutable.fromJS(preparedParticipants));
				
				const filter = { filter: { where: { isAllSports: true } } };

				return (window.Server as ServiceList).schoolSport.get(
					{
						schoolId:	this.props.activeSchoolId,
						sportId:	club.sportId
					},
					filter
				)
			})
			.then(sport => {
				binding.set(
					'teamManager',
					Immutable.fromJS(
						this.getTeamManagerDefaultState(school, club, sport, preparedParticipants)
					)
				);
				binding.set('isShowNotificationListPopup', false);
				binding.set('isSync', true);
				this.validate();
				this.addListeners();
			});
		}
	},
	getPreparedParticipantsByAcceptableUsers(originParticipants, acceptableUsers) {
		return originParticipants.map(participant => {
			const preparedParticipant = Object.assign({}, participant);

			const foundUser = acceptableUsers.find(user => participant.userId === user.id &&
				participant.permissionId === user.permissionId)
			
			if(typeof foundUser !== 'undefined') {
				preparedParticipant.messageStatus = foundUser.messageStatus;
				preparedParticipant.parents = foundUser.parents;
			}

			return preparedParticipant;
		});
	},
	removeListenersAndClearBinding() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
		this.getDefaultBinding().clear();
	},
	isParticipantListChange() {
		const 	prevParticipants 	= this.getDefaultBinding().toJS('prevParticipants'),
				currentParticipants = this.getDefaultBinding().toJS('teamManager.teamStudents'),
				isLengthEqual 		= prevParticipants.length === currentParticipants.length;

		const isAllParticipantsEqual = prevParticipants.every(prevParticipant => {
			return currentParticipants.some(currentParticipants => {
				return prevParticipant.id === currentParticipants.id && prevParticipant.permissionId === currentParticipants.permissionId
			})
		});
		return !isLengthEqual || !isAllParticipantsEqual;
	},
	addListeners() {
		this.listeners.push(
			this.getDefaultBinding().sub('teamManager.teamStudents').addListener(() => {
				this.validate();
			})
		);
	},
	initPlayerChoosersTabsModel() {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.ChildrenBooking
		);
	},
	initTeamManagerActions() {
		this.teamManagerActions = new TeamManagerActions(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.props.clubId
			}
		);
	},
	validate() {
		const binding = this.getDefaultBinding();
		const error = binding.toJS('error');
		const isValid = this.isSaveButtonEnable();

		switch (true) {
			case (isValid):
				error.isError = false;
				error.text = '';
				break;
			default:
				error.isError = true;
				error.text = `Number of players should be less or equal ${this.getMaxParticipants()}`;
				break;
		}

		binding.set('error', Immutable.fromJS(error));
	},
	setNewManagerComponentKey: function() {
		this.getDefaultBinding().set('managerComponentKey', RandomHelper.getRandomString());
	},
	getTeamManagerDefaultState(school: object, club: any, sport: Sport, participants: object) {
		const genders = TeamHelper.getFilterGender(club.gender);

		return {
			teamStudents:	participants,
			blackList:		[],
			positions:		sport.field.positions,
			filter:			TeamHelper.getTeamManagerSearchFilter(
				school,
				club.ages,
				genders,
				undefined
			)
		};
	},
	isSaveButtonEnable() {
		const clubStudentsCount = this.getDefaultBinding().toJS('teamManager.teamStudents').length;
		const maxParticipants = this.getMaxParticipants();

		return (
			typeof maxParticipants !== 'undefined' ?
				clubStudentsCount <= maxParticipants :
				true
		);
	},
	getMaxParticipants() {
		return this.getDefaultBinding().toJS('club.maxParticipants');
	},
	getSaveButtonStyleClass: function() {
		return classNames({
			'mDisable': !this.isSaveButtonEnable()
		});
	},
	saveChildren() {
		const prevParticipants = this.getDefaultBinding().toJS('prevParticipants');
		const currentParticipants = this.getDefaultBinding().toJS('teamManager.teamStudents');

		currentParticipants.forEach(p => {
			if(typeof p.userId === 'undefined') {
				p.userId = p.id;
				delete p.id;
			}
		});

		const participantsToRemove = [];
		prevParticipants.forEach(prevParticipant => {
			const participant = currentParticipants.find(curParticipant =>
				curParticipant.userId === prevParticipant.userId &&
				curParticipant.permissionId === prevParticipant.permissionId
			);

			if(typeof participant === 'undefined') {
				participantsToRemove.push(prevParticipant);
			}
		});

		const participantsToAdd = [];
		currentParticipants.forEach(curParticipant => {
			const participant = prevParticipants.find(prevParticipant =>
				curParticipant.userId === prevParticipant.userId &&
				curParticipant.permissionId === prevParticipant.permissionId
			);

			if(typeof participant === 'undefined') {
				participantsToAdd.push(curParticipant);
			}
		});

		let promises = [];
		promises = promises.concat(participantsToRemove.map(p =>
			ClubsActions.removeParticipant(
				this.props.activeSchoolId,
				this.props.clubId,
				p.id
			)
		));
		promises = promises.concat(participantsToAdd.map(p =>
			ClubsActions.addParticipant(
				this.props.activeSchoolId,
				this.props.clubId,
				{
					userId: p.userId,
					permissionId: p.permissionId
				}
			)
		));

		return Promise.all(promises);
	},
	getAndSetNewClubData() {
		return (window.Server as ServiceList).schoolClubParticipants.get(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.props.clubId
			},{
				filter: { limit: 100 }
			}
		).then(participants => {
			this.getDefaultBinding().set('prevParticipants', Immutable.fromJS(participants));
			this.getDefaultBinding().set('teamManager.teamStudents', Immutable.fromJS(participants));

			return true;
		});
	},
	doAfterSaveActions() {
		this.getDefaultBinding().set('isSync', true);
		window.simpleAlert('The pupils have been added successfully.');
	},
	handleClickSubmitBookingForms() {
		this.getDefaultBinding().set('isSync', false);
		this.getDefaultBinding().set('isShowNotificationListPopup', true);

	},
	handleClickSubmitBookingFormsOnPopup(listItems: Item[]) {
		const preparedUsers = [];
		listItems.forEach(item => {
			item.extraItems.forEach(extraItem => {
				preparedUsers.push({
					userId: extraItem.additionalData.userId,
					permissionId: extraItem.additionalData.permissionId,
					childId: item.additionalData.userId
				});
			});
		});

		return (window.Server as ServiceList).schoolClubSendMessages.post(
			{ schoolId: this.props.activeSchoolId, clubId: this.props.clubId },
			{ participants: preparedUsers }
		).then(() => {
			window.simpleAlert('Messages has been send successfully.');

			this.setNewManagerComponentKey();
			this.getDefaultBinding().set('isSync', true);
			this.getDefaultBinding().set('isShowNotificationListPopup', false);
		});

	},
	handleClickCancelButtonOnPopup() {
		this.getDefaultBinding().set('isSync', true);
		this.getDefaultBinding().set('isShowNotificationListPopup', false);
	},
	handleClickSubmitButton() {
		if(this.isSaveButtonEnable()) {
			this.getDefaultBinding().set('isSync', false);

			this.saveChildren()
				.then(() => this.getAndSetNewClubData())
				.then(() => this.doAfterSaveActions());
		}
	},
	handleClickCancelButton() {
		switch (true) {
			case this.isParticipantListChange(): {
				window.confirmAlert(
					`Do you want to save the changes?`,
					"Yes",
					"No",
					() => {
						this.saveChildren().then(() => {
							this.removeListenersAndClearBinding();
							ClubsHelper.redirectToClubListPage();
						});
					},
					() => {
						this.removeListenersAndClearBinding();
						ClubsHelper.redirectToClubListPage();
					}
				);
				break;
			}
			default: {
				this.removeListenersAndClearBinding();
				ClubsHelper.redirectToClubListPage();
			}
		}
	},
	renderNotificationListPopup() {
		if(this.getDefaultBinding().toJS('isShowNotificationListPopup')) {
			return (
				<ClubChildrenEditNotificationListPopupWrapper
					binding={this.getDefaultBinding().sub('clubChildrenEditNotificationListPopupData')}
					clubId={this.props.clubId}
					schoolId={this.props.activeSchoolId}
					handleClickSubmitButton={(listItems: Item) => this.handleClickSubmitBookingFormsOnPopup(listItems)}
					handleClickCancelButton={() => this.handleClickCancelButtonOnPopup()}
				/>
			);
		} else {
			return null;
		}
	},
	render() {
		const binding = this.getDefaultBinding();
		const isActiveClub = binding.toJS('club.status') === 'ACTIVE';

		let clubForm = null;

		switch (true) {
			case !binding.toJS('isSync') && binding.toJS('isShowNotificationListPopup'): {
				clubForm = (
					<div className='bLoaderWrapper'>
						<Loader condition={true}/>
						{this.renderNotificationListPopup()}
					</div>
				);
				break;
			}
			case binding.toJS('isSync'): {
				clubForm = (
					<div className={`bClubChildrenManagerWrapper ${isActiveClub ? 'bClubChildrenManagerWrapper_disabled' : ''}`}>
						<ClubsChildrenEditHeader/>
						{
							!isActiveClub ?
								<ClubsChildrenBookingActionArea
									handleSendMessages = { () => this.handleClickSubmitBookingForms() }
								/>
								: null
						}
						<TeamManager
							key				= { this.getDefaultBinding().toJS('managerComponentKey') }
							isNonTeamSport	= { true }
							binding			= {
								{
									default:	binding.sub('teamManager'),
									error:		binding.sub('error')
								}
							}
							playerChoosersTabsModel = { this.playerChoosersTabsModel }
							actions					= { this.teamManagerActions }
							isClubPage              = { true }
						/>
						{!isActiveClub ?
							<div className="eClubChildrenManagerWrapper_footer">
								<Button
									text				= "Cancel"
									onClick				= { () => this.handleClickCancelButton() }
									extraStyleClasses   = { 'mCancel mMarginRight' }
								/>
								<Button
									text				= "Save"
									onClick				= { this.handleClickSubmitButton }
									extraStyleClasses	= { this.getSaveButtonStyleClass() }
								/>
							</div>
							: null
						}
					</div>
				);
				break;
			}
			default: {
				clubForm = (
					<div className='bLoaderWrapper'>
						<Loader condition={true}/>
					</div>
				);
				break;
			}
		}

		return clubForm;
	}
});