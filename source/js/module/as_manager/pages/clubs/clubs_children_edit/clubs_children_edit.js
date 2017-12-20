const	React		= require('react'),
		Morearty	= require('morearty'),
		classNames	= require('classnames'),
		Immutable	= require('immutable'),
		Promise		= require('bluebird');

const	TeamManager	= require('module/ui/managers/team_manager/team_manager'),
		{Button}	= require('module/ui/button/button'),
		Header		= require('module/as_manager/pages/clubs/clubs_children_edit/header'),
		Error		= require('module/ui/managers/models/error'),
		Loader		= require('module/ui/loader');

const	TeamHelper							= require('module/ui/managers/helpers/team_helper'),
		RandomHelper						= require('module/helpers/random_helper'),
		{ PlayerChoosersTabsModelFactory }	= require('module/helpers/player_choosers_tabs_models_factory'),
		{ TeamManagerActions }				= require('module/helpers/actions/team_manager_actions'),
		{ ManagerTypes }					= require('module/ui/managers/helpers/manager_types'),
		{ ClubsChildrenBookingActionArea }	= require('module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_action_area/clubs_children_booking_action_area'),
		ClubsActions						= require('module/as_manager/pages/clubs/clubs_actions');

const	LoaderStyle					= require('styles/ui/loader.scss');
const	ClubcChildrenWrapperStyle	= require('styles/pages/b_club_children_manager_wrapper.scss');

const ClubChildrenEdit = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		clubId:			React.PropTypes.string.isRequired
	},
	listeners: [],
	playerChoosersTabsModel: undefined,
	teamManagerActions: undefined,
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();
		this.setNewManagerComponentKey();

		const clubId = this.props.clubId;

		let club, school, participants;

		binding.set('isSync', false);
		if (typeof clubId !== 'undefined') {
			window.Server.school.get(this.props.activeSchoolId).then(_school => {
				school = _school;

				return window.Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
			}).then(forms => {
				school.forms = forms;

				return window.Server.schoolClub.get(
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

				return window.Server.schoolClubParticipats.get(
					{
						schoolId:	this.props.activeSchoolId,
						clubId:		clubId
					}
				);
			})
			.then(_participants => {
				participants = _participants;

				binding.set('prevParticipants', Immutable.fromJS(participants));

				return window.Server.schoolSport.get(
					{
						schoolId:	this.props.activeSchoolId,
						sportId:	club.sportId
					}
				)
			})
			.then(sport => {
				binding.set(
					'teamManager',
					Immutable.fromJS(
						this.getTeamManagerDefaultState(school, club, sport, participants)
					)
				);
				binding.set('isSync', true);
				this.validate();
				this.addListeners();
			});
		}
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();

		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	addListeners: function () {
		this.listeners.push(
			this.getDefaultBinding().sub('teamManager.teamStudents').addListener(() => {
				this.validate();
			})
		);
	},
	initPlayerChoosersTabsModel: function () {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.ChildrenBooking
		);
	},
	initTeamManagerActions: function () {
		this.teamManagerActions = new TeamManagerActions(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.props.clubId
			}
		);
	},
	validate: function () {
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
	getTeamManagerDefaultState: function (school, club, sport, participants) {
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
	isSaveButtonEnable: function () {
		const clubStudentsCount = this.getDefaultBinding().toJS('teamManager.teamStudents').length;
		const maxParticipants = this.getMaxParticipants();

		return (
			clubStudentsCount > 0 &&
			(
				typeof maxParticipants !== 'undefined' ?
					clubStudentsCount <= maxParticipants :
					true
			)
		);
	},
	getMaxParticipants: function () {
		return this.getDefaultBinding().toJS('club.maxParticipants');
	},
	getSaveButtonStyleClass: function() {
		return classNames({
			'mDisable': !this.isSaveButtonEnable()
		});
	},
	saveChildren: function () {
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
	getAndSetNewClubData: function () {
		return window.Server.schoolClubParticipats.get(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.props.clubId
			}
		).then(participants => {
			this.getDefaultBinding().set('prevParticipants', Immutable.fromJS(participants));
			this.getDefaultBinding().set('teamManager.teamStudents', Immutable.fromJS(participants));

			return true;
		});
	},
	doAfterSaveActions: function () {
		this.getDefaultBinding().set('isSync', true);
		window.simpleAlert('The pupils have been added successfully.');
	},
	handleSendMessages: function () {
		this.getDefaultBinding().set('isSync', false);
		return window.Server.schoolClubSendMessages.post(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.props.clubId
			},
			{}
		).then(() => {
			window.simpleAlert('Messages has been send successfully.');

			this.setNewManagerComponentKey();

			this.getDefaultBinding().set('isSync', true);
		});
	},
	handleClickSubmitButton: function () {
		if(this.isSaveButtonEnable()) {
			this.getDefaultBinding().set('isSync', false);

			this.saveChildren()
				.then(() => this.getAndSetNewClubData())
				.then(() => this.doAfterSaveActions());
		}
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let clubForm = null;
		if(binding.toJS('isSync')) {
			return (
				<div className='bClubChildrenManagerWrapper'>
					<Header/>
					<ClubsChildrenBookingActionArea
						handleSendMessages = { () => this.handleSendMessages() }
					/>
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
					/>
					<div className="eClubChildrenManagerWrapper_footer">
						<Button
							text				= "Save"
							onClick				= { this.handleClickSubmitButton }
							extraStyleClasses	= { this.getSaveButtonStyleClass() }
						/>
					</div>
				</div>
			);
		} else {
			clubForm = (
				<div className='bLoaderWrapper'>
					<Loader condition={true}/>
				</div>
			);
		}

		return clubForm;
	}
});

module.exports = ClubChildrenEdit;
