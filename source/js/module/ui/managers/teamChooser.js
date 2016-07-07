const	React			= require('react'),
		ReactDOM		= require('reactDom'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Lazy			= require('lazyjs'),
		classNames		= require('classnames'),
		Immutable		= require('immutable');

const	TeamChooser	= React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onTeamClick:	React.PropTypes.func,
		onTeamDeselect:	React.PropTypes.func
	},
	componentWillMount: function () {
		const self = this;

		self._initBinding();
	},
	_initBinding: function() {
		const	self = this,
				binding	= self.getDefaultBinding();

		binding.set('viewMode', Immutable.fromJS('close'));

		self._getTeams().then(teams => binding.set('teams', Immutable.fromJS(teams)));
	},
	_getTeams: function() {
		const	self	= this,
				model	= self.getBinding().model.toJS(),
				rival	= self.getBinding().rival.toJS();

		const filter = {
			filter: {
				limit: 100,
				where: {
					gender: model.gender,
					sportId: model.sportId,
					tempTeam: false,
					removed: false
				}
			}
		};

		if(model.type === "houses") {
			filter.filter.where.houseId = rival.id;
		}

		return window.Server.teams.get(MoreartyHelper.getActiveSchoolId(self), filter)
			.then(teams => teams.filter(team => Lazy(model.ages).intersection(team.ages).toArray().length === team.ages.length));
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
			}).join(";");
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
	_renderTeamList: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				teams			= binding.toJS('teams'),
				exceptionTeamId	= binding.toJS('exceptionTeamId'),
				selectedTeamId	= binding.toJS('selectedTeamId');
		let		teamItems		= [];

		if(
			teams &&
			(
				teams.length === 0 ||
				teams.length === 1 && teams[0].id === exceptionTeamId ||
				teams.length === 1 && teams[0].id === selectedTeamId
			)
		) {
			teamItems.push((
				<div className='eTeamChooser_team mLast mAlert'>
					There are no teams matching you criteria. To create a new team pick players from the list.
				</div>
			)) ;
		} else if(teams && teams.length !== 0) {
			teams.forEach((team, index) => {
				if(exceptionTeamId != team.id) {
					const	teamClass	= classNames({
						eTeamChooser_team:	true,
						mLast:				index == teams.length - 1
					});

					teamItems.push((
						<div className={teamClass} onClick={self._onTeamClick.bind(self, team.id, team)}>
							<div className="eTeamChooser_teamName">{team.name}</div>
							<div className="eTeamChooser_teamAges">{self._geAgesView(team.ages)}</div>
						</div>
					));
				}
			});
		}

		const teamChooserClass = classNames({
			eTeamChooser_teamListContainer:	true,
			mDisable:						binding.toJS('viewMode') == 'close'
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
				classNameRevertButton	= classNames({
					eTeamChooser_button:	true,
					mDeselect:				true,
					mDisable:				!self._isTeamSelected()
				});

		return (
			<div	className={classNameRevertButton}
					onClick={self._onTeamDeselectButtonClick}
			>
				Deselect Team
			</div>
		);
	},
	_renderTeamChooserButton: function() {
		const	self						= this,
				classNameTeamChooserButton	= classNames({
					eTeamChooser_button:	true,
					mActive:				self._isOpen()
				});

		return (
			<button	className={classNameTeamChooserButton}
					onClick={self._onTeamChooserButtonClick}
					onBlur={self._onTeamChooserButtonBlur}
			>
				Select Team
			</button>
		);
	},
	render: function() {
		const	self	= this;

		return (
			<div className="bTeamChooser">
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