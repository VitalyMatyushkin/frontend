const	React			= require('react'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Lazy			= require('lazy.js'),
		classNames		= require('classnames'),
		Morearty		= require('morearty'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Button			= require('module/ui/button/button'),
		Immutable		= require('immutable');

const TeamChooser = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onTeamClick:	React.PropTypes.func,
		onTeamDeselect:	React.PropTypes.func,
		isEnable:		React.PropTypes.bool
	},
	getDefaultProps: function() {
		return {
			isEnable: true
		};
	},
	componentWillMount: function () {
		const self = this;

		self._initBinding();
	},
	_initBinding: function() {
		const	self = this,
				binding	= self.getDefaultBinding();

		binding.set('viewMode', Immutable.fromJS('close'));

		self._getTeams().then(teams => {
				teams.sort((teamA, teamB)=>{
					if (teamA.name.toLowerCase() > teamB.name.toLowerCase()) {return 1}
					if (teamA.name.toLowerCase() < teamB.name.toLowerCase()) {return -1}
				});
				binding.set('teams', Immutable.fromJS(teams));
			}
		);
	},
	_getTeams: function() {
		const	self	= this,
				model	= self.getBinding().model.toJS(),
				rival	= self.getBinding().rival.toJS();

		const filter = {
			filter: {
				limit: 100,
				where: {
					gender:		TeamHelper.convertGenderToServerValue(model.gender),
					sportId:	model.sportId,
					teamType:	"PROTOTYPE",
					removed:	false
				}
			}
		};

		if(TeamHelper.getEventType(model) === "houses") {
			filter.filter.where.houseId = rival.id;
		}

		return window.Server.teams.get(MoreartyHelper.getActiveSchoolId(self), filter)
			.then(teams => {
				if(model.ages.length === 0) {
					return teams;
				} else {
					return teams
						.filter(team => team.ages.length > 0)
						.filter(team => Lazy(model.ages).intersection(team.ages).toArray().length === team.ages.length);
				}
			});
	},
	/**
	 * Convert ages array to table view
	 * @private
	 */
	_geAgesView: function(ages) {
		let	result = '';

		if (ages !== undefined) {
			result = ages.map(elem => {
				return `Y${elem}`;
			}).join("; ");
		}

		return result;
	},
	_setSelectTeamFlag: function(flag) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('isSelectedTeam', Immutable.fromJS(flag));
	},
	_isTeamSelected: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('isSelectedTeam');
	},
	/**
	 * Handler for click on team in team table
	 * @param teamId
	 * @private
	 */
	_onTeamClick: function(teamId, team) {
		const	self	= this;

		self._setSelectTeamFlag(true);
		self._closeTeamList();
		self.props.onTeamClick(teamId, team);
	},
	isBlackListTeam: function(teamId) {
		const	binding			= this.getDefaultBinding(),
				teamIdBlackList	= binding.toJS('teamIdBlackList');

		return teamIdBlackList.findIndex(_teamId => _teamId === teamId) !== -1;
	},
	_renderTeamList: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				teams			= binding.toJS('teams'),
				teamIdBlackList	= binding.toJS('teamIdBlackList'),
				selectedTeamId	= binding.toJS('selectedTeamId');
		let		teamItems		= [];

		if(
			typeof teams === 'undefined' ||
			(
				typeof teams !== 'undefined' && (
					// There are no teams
					teams.length === 0 ||
					// Only one team from blacklist
					teams.length === 1 && this.isBlackListTeam(teams[0].id) ||
					// Selected team is only one team
					teams.length === 1 && teams[0].id === selectedTeamId
				)
			)
		) {
			teamItems.push((
				<div	key			= 'sadsadas'
						className	= 'eTeamChooser_team mLast mAlert'
				>
					There are no teams matching you criteria. To create a new team pick players from the list.
				</div>
			)) ;
		} else if(teams && teams.length !== 0) {
			teamItems = teams
				// filter black list teams and selected team
				.filter(team => team.id !== selectedTeamId && !this.isBlackListTeam(team.id))
				.map((team, index) => {
					const teamClass = classNames({
						eTeamChooser_team:	true,
						mLast:				index == teams.length - 1
					});

					return (
						<div	key			= {team.id}
								className	= {teamClass}
								onMouseDown	= {self._onTeamClick.bind(self, team.id, team)}
						>
							<div className="eTeamChooser_teamName">{team.name}</div>
							<div className="eTeamChooser_teamAges">{self._geAgesView(team.ages)}</div>
						</div>
					);
			});
		}

		const teamChooserClass = classNames({
			eTeamChooser_teamListContainer:	true,
			mDisable:						!self.isOpenTeamChooser()
		});

		return (
			<div className={teamChooserClass}  ref="teamList">
				<div className="eTeamChooser_teamListHead"></div>
				<div className="eTeamChooser_teamList">

					{teamItems}
				</div>
			</div>
		);
	},
	isOpenTeamChooser: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		switch(binding.toJS('viewMode')) {
			case 'open':
				return true;
			case 'close':
				return false;
			default:
				return false;
		}
	},
	_onTeamChooserButtonClick: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		switch (binding.toJS('viewMode')) {
			case 'open':
				self._closeTeamList();
				break;
			case 'close':
				self._openTeamList();
				break;
		}
	},
	_onTeamDeselectButtonClick: function() {
		const	self	= this;

		self._setSelectTeamFlag(false);
		self.props.onTeamDeselect();
	},
	_onTeamChooserButtonBlur: function() {
		const	self	= this;

		self._closeTeamList();
	},
	_isOpen: function() {
		const	self	= this;

		return self.getDefaultBinding().get('viewMode') === 'open';
	},
	_openTeamList: function() {
		const	self	= this;

		self.getDefaultBinding().set('viewMode', Immutable.fromJS('open'));
	},
	_closeTeamList: function() {
		const	self	= this;

		self.getDefaultBinding().set('viewMode', Immutable.fromJS('close'));
	},
	_renderRevertButton: function() {
		const	self					= this,
				isDisabled				= !self._isTeamSelected(),
				classNameRevertButton	= classNames({
					bButton:				true,
					mCancel:				true,
					mDisable:				isDisabled
				});

		return (
			<Button
					text				= {'Deselect Team'}
					onClick				= {self._onTeamDeselectButtonClick}
					extraStyleClasses	= {classNameRevertButton}
					isDisabled			= {isDisabled}
			/>
		);
	},
	_renderTeamChooserButton: function() {
		const	self						= this,
				classNameTeamChooserButton	= classNames({
					bButton:				true,
					mActive:				self._isOpen()
				});

		return (
			<button	className	= {classNameTeamChooserButton}
					onClick		= {self._onTeamChooserButtonClick}
					onBlur		= {self._onTeamChooserButtonBlur}
			>
				Select Team
			</button>
		);
	},
	render: function() {
		const	self	= this;

		const teamChooserClass = classNames({
			bTeamChooser:	true,
			mDisable:		!self.props.isEnable
		});

		return (
			<div className={teamChooserClass}>
				<div className="eTeamChooser_leftSide">
					{self._renderTeamChooserButton()}
					{self._renderTeamList()}
				</div>
				<div className="eTeamChooser_rightSide">
					{self._renderRevertButton()}
				</div>
			</div>
		);
	}
});

module.exports = TeamChooser;