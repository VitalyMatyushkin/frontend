// Main components
const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		propz			= require('propz'),
		classNames		= require('classnames');

// Team bundle react components
const	TeamChooser		= require('./team_chooser'),
		TeamWrapper		= require('./team_wrapper');

// Helpers
const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper');

// Style
const	TeamBundleStyle	= require('../../../../styles/ui/teams_manager/b_team_bundle.scss');

const TeamBundle = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		playerChoosersTabsModel:	React.PropTypes.object.isRequired,
		actions:					React.PropTypes.object.isRequired
	},
	listeners: [],
	componentWillMount: function() {
		this.initBinding();
		this.addListeners();
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));

		this.getDefaultBinding().clear();
	},
	/** INIT FUNCTIONS **/
	initBinding: function() {
		this.initTeamIdBlackListBindings();
	},
	initTeamIdBlackListBindings: function() {
		const rivals = this.getBinding().rivals.toJS();

		rivals.forEach(rival => this.initTeamIdBlackListBindingByRival(rival));
	},
	initTeamIdBlackListBindingByRival: function(rival) {
		const	binding					= this.getDefaultBinding(),
				teamTables				= binding.toJS(`teamTable`),
				currentTeamTableIndex	= teamTables.findIndex(tw => tw.rivalId === rival.id);

		binding.set(
			`teamTable.${currentTeamTableIndex}.teamIdBlackList`,
			Immutable.fromJS(
				this.getTeamIdBlackListByRival(rival)
			)
		);
	},
	getTeamIdBlackListByRival: function(rival) {
		const	binding					= this.getDefaultBinding(),
				teamWrappers			= binding.toJS(`teamWrapper`),
				currentTeamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rival.id);

		const teamIdBlackList = [];
		// remove current team wrapper
		teamWrappers.splice(currentTeamWrapperIndex, 1);
		teamWrappers.forEach(tw => typeof tw.selectedTeamId !== 'undefined' && teamIdBlackList.push(tw.selectedTeamId));

		return teamIdBlackList;
	},

	/** LISTENER FUNCTIONS **/
	addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const teamWrappers = binding.toJS('teamWrapper');
		teamWrappers.forEach(tw => {
			const	rivals		= this.getBinding().rivals.toJS(),
					rivalIndex	= rivals.findIndex(r => r.id === tw.rivalId);
			
			self.addTeamPlayersListenerByRivalIndex(binding, rivalIndex)
		});
	},
	addTeamPlayersListenerByRivalIndex: function(binding, rivalIndex) {
		const	rivals					= this.getBinding().rivals.toJS(),
				currentRival			= rivals[rivalIndex],
				teamWrappers			= binding.toJS('teamWrapper'),
				currentTeamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === currentRival.id);

		// if players were change
		// add players from one team to blacklist of other team
		const listener = binding.sub(`teamWrapper.${currentTeamWrapperIndex}.___teamManagerBinding.teamStudents`).addListener(descriptor => {
			const anotherRivalIdArray = this.getAnotherRivalIdArray(rivalIndex);

			// TODO check blacklist
			if(typeof descriptor.getCurrentValue() !== 'undefined') {
				anotherRivalIdArray.forEach(rivalId => {
					const _teamWrappers				= binding.toJS('teamWrapper');
					const _currentTeamWrapperIndex	= _teamWrappers.findIndex(tw => tw.rivalId === rivalId);

					const blackList = binding.toJS(`teamWrapper.${_currentTeamWrapperIndex}.___teamManagerBinding.blackList`);
					binding.set(
						`teamWrapper.${_currentTeamWrapperIndex}.___teamManagerBinding.blackList`,
						Immutable.fromJS(
							blackList.concat(
								descriptor.getCurrentValue().toJS()
							)
						)
					);
				});
			}
		});

		this.listeners.push(listener);
	},
	/** HELPER FUNCTIONS **/
	isSelectedTeamWrapper: function (teamWrapper, selectedRivalId) {
		return teamWrapper.rivalId === selectedRivalId
	},
	isValidClassNames: function (type, classNames) {
		let isValid;

		switch (type) {
			case 'TEAM_WRAPPER': {
				let disableWrappersCount = 0;
				classNames.forEach(className => {
					if(className.search('mDisable') !== -1) {
						disableWrappersCount++;
					}
				});

				isValid = classNames.length - disableWrappersCount === 1;

				break;
			}
			default: {
				isValid = true;
				break;
			}
		}

		return isValid;
	},
	getTeamChooserBindings: function() {
		const	binding			= this.getDefaultBinding();

		const	event			= this.getBinding().model,
				teamTables		= binding.toJS(`teamTable`),
				teamWrappers	= binding.toJS(`teamWrapper`);

		return teamWrappers
			.map(tw => {
				const	currentRivalBinding		= this.getRivalBindingByTeamWrapper(event, tw),
						currentTeamTableIndex	= teamTables.findIndex(tt => tt.rivalId === tw.rivalId);

				return ({
					default:	binding.sub(`teamTable.${currentTeamTableIndex}`),
					model:		event,
					rival:		currentRivalBinding
				});
			});
	},
	getTeamWrapperBindings: function() {
		const	binding			= this.getDefaultBinding();

		const	event			= this.getBinding().model,
				teamWrappers	= binding.toJS(`teamWrapper`);

		return teamWrappers
			.map((tw, index) => {
				const errorIndex = this.getBinding('error').toJS().findIndex(e => e.rivalId === tw.rivalId);

				return {
					default		: binding.sub(`teamWrapper.${index}`),
					schoolInfo	: this.getBinding('schoolInfo'),
					model		: this.getBinding('model'),
					rival		: this.getRivalBindingByTeamWrapper(event, tw),
					players		: binding.sub(`players.${index}`),
					error		: this.getBinding('error').sub(errorIndex)
				};
			}
		);
	},
	getRivalBindingByTeamWrapper: function(event, teamWrapper) {
		const	rivals				= this.getBinding().rivals.toJS(),
				currentRivalIndex	= rivals.findIndex(rival => rival.id === teamWrapper.rivalId);

		return this.getBinding().rivals.sub(currentRivalIndex);
	},
	getClassNamesForTeamWrapper: function() {
		const	binding			= this.getDefaultBinding(),
				selectedRival	= this.getBinding().rivals.toJS()[ binding.toJS('selectedRivalIndex') ];

		const teamWrappers = binding.toJS(`teamWrapper`);

		return teamWrappers.map(tw =>
			classNames({
				bWrapperTeamWrapper:	true,
				mDisable:				!this.isSelectedTeamWrapper(tw, selectedRival.id)
			})
		);
	},
	getAllPlayers: function() {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamWrapper');

		return teamWrapper.map(tw => tw.___teamManagerBinding.teamStudents);
	},
	getOtherTeamPlayersByRivalIndex: function(rivalIndex) {
		let players = [];

		const	binding					= this.getDefaultBinding(),
				rivals					= this.getBinding().rivals.toJS(),
				currentRivalId			= rivals[rivalIndex].id,
				teamWrappers			= binding.toJS('teamWrapper'),
				currentTeamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === currentRivalId);

		teamWrappers.splice(currentTeamWrapperIndex, 1);
		teamWrappers.forEach(tw => {
			const teamStudents = propz.get(tw, ['___teamManagerBinding', 'teamStudents']);

			typeof teamStudents !== 'undefined' && (players = players.concat(teamStudents));
		});

		return players;
	},
	getAnotherRivalIdArray: function(rivalIndex) {
		const rivals = this.getBinding().rivals.toJS();
		if (typeof rivals !== 'undefined') { //I don't know, why rivals may be equal undefined, if you know, then fix it
			return rivals
			.filter((_, _rivalIndex) => _rivalIndex !== rivalIndex)
			.map(rival => rival.id);
		} else {
			return [];
		}

	},
	/**
	 * Function adds teamId to black list of other rivals.
	 * @param teamTable
	 * @param currentRivalIndex
	 * @param blackListTeamId
	 * @returns {*}
	 */
	addTeamIdToOtherRivalsBlackList: function(teamTable, currentRivalIndex, blackListTeamId) {
		const anotherRivalIdArray = this.getAnotherRivalIdArray(currentRivalIndex);

		anotherRivalIdArray.forEach(rivalId => {
			const currentTeamTableIndex = teamTable.findIndex(tt => tt.rivalId === rivalId);
			
			teamTable[currentTeamTableIndex].teamIdBlackList.push(blackListTeamId);
		});
	},
	/**
	 * Function removes teamId from black list of other rivals.
	 * @param teamTable
	 * @param currentRivalIndex
	 * @param blackListTeamId
	 */
	removeTeamIdToOtherRivalsBlackList: function(teamTable, currentRivalIndex, blackListTeamId) {
		const anotherRivalIdArray = this.getAnotherRivalIdArray(currentRivalIndex);

		anotherRivalIdArray.forEach(rivalId => {
			const currentTeamTableIndex = teamTable.findIndex(tt => tt.rivalId === rivalId);
			
			const teamIdIndex = teamTable[currentTeamTableIndex].teamIdBlackList.find(id => id === blackListTeamId);
			teamTable[currentTeamTableIndex].teamIdBlackList.splice(teamIdIndex, 1);
		});
	},
	selectTeam: function(teamId, team) {
		const	binding				= this.getDefaultBinding();

		const	teamWrappers		= binding.toJS('teamWrapper'),
				teamTables			= binding.toJS('teamTable'),
				rivals 				= this.getBinding().rivals.toJS(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex');

		const	currentTeamWrapper		= teamWrappers.findIndex(tw => tw.rivalId === rivals[selectedRivalIndex].id),
				currentTeamTableIndex	= teamTables.findIndex(tw => tw.rivalId === rivals[selectedRivalIndex].id);

		teamWrappers[currentTeamWrapper].selectedTeamId		= teamId;
		teamWrappers[currentTeamWrapper].teamType			= team.teamType;
		teamWrappers[currentTeamWrapper].selectedTeam		= team;
		teamWrappers[currentTeamWrapper].prevTeamName		= team.name;
		teamWrappers[currentTeamWrapper].teamName.name		= team.name;
		teamWrappers[currentTeamWrapper].teamName.prevName	= team.name;
		teamTables[currentTeamTableIndex].selectedTeamId	= teamId;
		this.addTeamIdToOtherRivalsBlackList(teamTables, selectedRivalIndex, teamId);

		binding
			.atomically()
			.set('teamWrapper',	Immutable.fromJS(teamWrappers))
			.set('teamTable',	Immutable.fromJS(teamTables))
			.commit();
	},
	deselectTeam: function() {
		const	binding		= this.getDefaultBinding();

		const	teamWrappers		= binding.toJS('teamWrapper'),
				teamTables			= binding.toJS('teamTable'),
				rivals 				= this.getBinding().rivals.toJS(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex');

		const	currentTeamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rivals[selectedRivalIndex].id),
				currentTeamTableIndex	= teamTables.findIndex(tw => tw.rivalId === rivals[selectedRivalIndex].id);

		teamWrappers[currentTeamWrapperIndex].selectedTeamId	= undefined;
		teamWrappers[currentTeamWrapperIndex].teamType		= undefined;
		teamWrappers[currentTeamWrapperIndex].selectedTeam	= undefined;
		teamWrappers[currentTeamWrapperIndex].prevTeamName	= undefined;
		teamWrappers[currentTeamWrapperIndex].teamName.name	= undefined;

		teamTables[currentTeamTableIndex].selectedTeamId	= undefined;

		const teamId = String(teamWrappers[currentTeamWrapperIndex].selectedTeamId);
		this.removeTeamIdToOtherRivalsBlackList(teamTables, selectedRivalIndex, teamId);

		binding
			.atomically()
			.set('teamWrapper',	Immutable.fromJS(teamWrappers))
			.set('teamTable',	Immutable.fromJS(teamTables))
			.commit();
	},

	/** HANDLE FUNCTIONS **/
	handleTeamClick: function(teamId, team) {
		const	binding					= this.getDefaultBinding();

		const	selectedRivalIndex		= binding.toJS('selectedRivalIndex'),
				rivals 					= this.getBinding().rivals.toJS(),
				teamWrappers			= binding.toJS('teamWrapper'),
				currentTeamWrapperIndex	= teamWrappers.findIndex(tw => tw.rivalId === rivals[selectedRivalIndex].id),
				prevSelectedTeamId		= binding.toJS(`teamWrapper.${currentTeamWrapperIndex}.selectedTeamId`);

		if(prevSelectedTeamId !== teamId) {
			this.selectTeam(teamId, team);
		}
	},
	handleIsSelectTeamLater: function(rivalIndex) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivals 					= this.getBinding().rivals.toJS(),
				teamTables				= binding.toJS('teamTable'),
				currentTeamTeamIndex	= teamTables.findIndex(tt => tt.rivalId === rivals[rivalIndex].id);

		self.deselectTeam();
		binding.set(`teamTable.${currentTeamTeamIndex}.isSelectedTeam`, Immutable.fromJS(false));
	},

	/** RENDER FUNCTIONS **/
	renderTeamChoosers: function() {
		const event = this.getBinding('model').toJS();

		let teamChoosers = null;
		if(TeamHelper.isTeamSport(event)) {
			//TODO shitty way
			//one react element and many data bundles - that's what we need
			//Need to go TeamChooser on react state, delete morearty
			//problem is in my ugly realization of TeamChooser component
			//some data init on componentWillMount function
			//so we can't just send new data to TeamChooser in some point of TeamChooser lifecycle
			//and hope - everything will work good. NO!)
			//All fall down. Sorrrry, mate.
			const	selectedRivalIndex	= this.getDefaultBinding().toJS('selectedRivalIndex'),
					selectedRivalId		= this.getBinding().rivals.toJS()[selectedRivalIndex].id;

			teamChoosers = this.getTeamChooserBindings().map((binding, index) => {
				const currentTeamTable = binding.default.toJS();

				return (
					<TeamChooser
						key				= { `team-chooser-${index}` }
						onTeamClick		= { this.handleTeamClick }
						onTeamDeselect	= { this.deselectTeam }
						binding			= { binding }
						isEnable		= { currentTeamTable.rivalId === selectedRivalId }
					/>
				);
			});
		}

		return teamChoosers;
	},
	renderTeamWrapper: function() {
		const _classNames = this.getClassNamesForTeamWrapper();

		const tw = this.getTeamWrapperBindings();

		if( !this.isValidClassNames('TEAM_WRAPPER', _classNames) ) {
			const rivals = this.getBinding().rivals.toJS();
			console.log('!!!PLS EXPAND ALL THIS STUFF BEFORE TAKE SCREEN SHOT FOR DEVELOPER!!!');
			console.log('RIVALS:');
			rivals.forEach(rival => {
				console.log(rival);
			});

			console.log('TEAM WRAPPERS:');
			tw.forEach(teamWrapper => {
				console.log(teamWrapper.default.toJS());
			});
		}

		return tw.map((binding, index) => {
			return (
				<div className = { _classNames[index] }>
					<TeamWrapper
						binding					= { binding }
						actions					= { this.props.actions }
						playerChoosersTabsModel	= { this.props.playerChoosersTabsModel }
						otherTeamPlayers		= { this.getOtherTeamPlayersByRivalIndex(index) }
						handleIsSelectTeamLater	= { this.handleIsSelectTeamLater.bind(this, index) }
					/>
				</div>
			);
		});
	},
	render: function() {
		return (
			<div className='bTeamBundle'>
				{ this.renderTeamChoosers() }
				{ this.renderTeamWrapper() }
			</div>
		);
	}
});

module.exports = TeamBundle;