const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Promise			= require('bluebird'),
		Team			= require('./team/team'),
		PlayerChooser	= require('./player_chooser/player_chooser');

const TeamManager = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		isNonTeamSport: React.PropTypes.bool
	},
	currentSearchRequest: undefined,
	currentSearchText: '',
	getDefaultProps: function() {
		return {
			isNonTeamSport: false
		};
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			filter:						undefined,
			foundStudents:				[],
			removedPlayers:				[],
			selectedStudentIds:			[],
			selectedPlayerIds:			[],
			// TODO rename to isNeedClearBufferData
			// for ex. it's need for team create form
			// in case when user change type of team to houses
			// and we need clear all prev buffer data
			isSync:						true,
			isSearch:					false, // true when loading data
			// use this flag to command research users by current search text, see listeners
			isNeedSearch:				false,
			isRemovePlayerButtonBlock:	false,
			isAddTeamButtonBlocked:		false
		});
	},
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.searchAndSetStudents('', binding);
		self.initTeamValues();

		self.listeners.push(binding.sub('filter').addListener(() => {
			self.searchAndSetStudents(self.currentSearchText, binding);
		}));
		self.listeners.push(binding.sub('blackList').addListener(() => {
			self.searchAndSetStudents(self.currentSearchText, binding);
		}));
		self.listeners.push(binding.sub('isSync').addListener((descriptor) => {
			if(!descriptor.getCurrentValue()) {
				self.clearTeamValues();
			}
		}));
		self.listeners.push(binding.sub('isNeedSearch').addListener((descriptor) => {
			// if prev === false and curr === true
			if(
				descriptor.getPreviousValue() !== descriptor.getCurrentValue() &&
				descriptor.getCurrentValue()
			) {
				self.searchAndSetStudents(self.currentSearchText, binding);
			}
		}));
	},
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.listeners.forEach(l => binding.removeListener(l));
	},
	clearTeamValues: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set("selectedStudentIds",	Immutable.fromJS([]))
			.set("selectedPlayerIds",	Immutable.fromJS([]))
			.set("removedPlayers",		Immutable.fromJS([]))
			.set("isSync",				Immutable.fromJS(true))
			.commit()
	},
	/**
	 * Init some team stuff
	 */
	initTeamValues: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set("selectedStudentIds",	Immutable.fromJS([]))
			.set("selectedPlayerIds",	Immutable.fromJS([]))
			.set("removedPlayers",		Immutable.fromJS([]))
			.set("isSync",				Immutable.fromJS(true))
			.commit()
	},
	/**
	 * Search students by last name and set these to binding
	 * @param searchText
	 */
	searchAndSetStudents: function(searchText, binding) {
		const self = this;

		return self.searchStudents(searchText).then(students => {
			binding.atomically()
				.set("selectedStudentIds",	Immutable.fromJS([]))
				.set("foundStudents",		Immutable.fromJS(students))
				.set("isNeedSearch",		Immutable.fromJS(false))
				.commit()

			return true;
		});
	},
	/**
	 * Search players by search text
	 * @param searchText
	 * @private
	 */
	searchStudents: function (searchText) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const filter = binding.toJS('filter');

		if(filter) {
			binding.set('isSearch', true);

			const requestFilter = {
				filter: {
					where: {
						_id: {
							$nin: self.getNinUserId(binding)
						},
						formId: {
							$in: filter.forms.map(form => form.id)
						}
					},
					limit: 2000
				}
			};

			if(typeof searchText !== 'undefined' && searchText !== null && searchText.length > 0) {
				requestFilter.filter.where['$or'] = [
					{ lastName: { like:	searchText, options: 'i'} },
					{ firstName: { like: searchText, options: 'i'} }
				];
			}

			self.setGenderToRequestFilter(filter.genders, requestFilter);

			filter.houseId && (requestFilter.filter.where.houseId = filter.houseId);

			// cancel prev request
			typeof self.currentSearchRequest !== 'undefined' && self.currentSearchRequest.cancel();

			self.currentSearchRequest = window.Server.schoolStudents.get(filter.schoolId, requestFilter).then(players => {
				const updPlayers = players.map(player => {
					player.name = `${player.firstName}' '${player.lastName}`;

					return player;
				});

				binding.set('isSearch', false);

				return updPlayers;
			});
			return self.currentSearchRequest;
		} else {
			return Promise.resolve([]);
		}
	},
	setGenderToRequestFilter: function(genders, requestFilter) {
		if(genders.length === 1) {
			requestFilter.filter.where.gender = genders[0];
		} else if(genders.length === 2) {
			requestFilter.filter.where.gender = { $in: [genders[0], genders[1]] };
		}
	},
	getNinUserId: function(binding) {
		const self = this;

		return	self.getPlayerIdsFromPlayerStore(binding, 'teamStudents').concat(self.getPlayerIdsFromPlayerStore(binding, 'blackList'));
	},
	getPlayerIdsFromPlayerStore: function(binding, playerStoreName) {
		const playerStore = binding.toJS(playerStoreName);

		if(playerStore) {
			return playerStore.map(p => p.userId ? p.userId : p.id);
		} else {
			return [];
		}
	},
	handleChangeSearchText: function(text) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.currentSearchText = text;

		self.searchAndSetStudents(text, binding);
	},
	handleClickPlayer: function(playerId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	selectedPlayerIds	= binding.toJS('selectedPlayerIds'),
				foundPlayerIndex	= selectedPlayerIds.findIndex(p => p === playerId);

		if(foundPlayerIndex === -1) {
			selectedPlayerIds.push(playerId);
		} else {
			selectedPlayerIds.splice(foundPlayerIndex, 1);
		}

		binding.set('selectedPlayerIds', Immutable.fromJS(selectedPlayerIds));
	},
	handleClickStudent: function(studentId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	selectedStudentIds	= binding.toJS('selectedStudentIds'),
				foundStudentIndex	= selectedStudentIds.findIndex(s => s === studentId);

		if(foundStudentIndex === -1) {
			selectedStudentIds.push(studentId);
		} else {
			selectedStudentIds.splice(foundStudentIndex, 1);
		}

		binding.set('selectedStudentIds', Immutable.fromJS(selectedStudentIds));
	},
	/**
	 * Add student to team
	 */
	handleClickAddStudentButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const selectedStudentIds = binding.toJS('selectedStudentIds');
		
		if(selectedStudentIds.length !== 0) {
			const	teamStudents	= binding.toJS('teamStudents'),
					foundStudents	= binding.toJS('foundStudents'),
					removedPlayers	= binding.toJS('removedPlayers');

			binding.set("isAddTeamButtonBlocked", true);

			selectedStudentIds.forEach(id => {
				const	selectedStudentIndex	= foundStudents.findIndex(s => s.id === id),
						foundRemovedPlayerIndex	= removedPlayers.findIndex(p => {
							return p.userId ?
								p.userId === id :
								p.id === id;
						});

				if(foundRemovedPlayerIndex !== -1) {
					teamStudents.push(removedPlayers[foundRemovedPlayerIndex]);
					removedPlayers.splice(foundRemovedPlayerIndex, 1)
				} else if(selectedStudentIndex !== -1) {
					teamStudents.push(foundStudents[selectedStudentIndex]);
				}

				foundStudents.splice(selectedStudentIndex, 1);
			});

			binding.atomically()
				.set('selectedStudentIds',		Immutable.fromJS([]))
				.set('foundStudents',			Immutable.fromJS(foundStudents))
				.set('teamStudents',			Immutable.fromJS(teamStudents))
				.set('removedPlayers',			Immutable.fromJS(removedPlayers))
				.set("isAddTeamButtonBlocked",	false)
				.commit();
		}
	},
	handleClickRemovePlayerButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const selectedPlayerIds = binding.toJS('selectedPlayerIds');

		if(selectedPlayerIds.length !== 0) {
			const	teamStudents	= binding.toJS('teamStudents'),
					foundStudents	= binding.toJS('foundStudents'),
					removedPlayers	= binding.toJS('removedPlayers');

			binding.set("isRemovePlayerButtonBlock", true);

			selectedPlayerIds.forEach(id => {
				const	selectedPlayerIndex		= teamStudents.findIndex(s => s.id === id),
						foundRemovedPlayerIndex	= removedPlayers.findIndex(p => p.id === id);

				if(selectedPlayerIndex === -1 && foundRemovedPlayerIndex === -1) {
					removedPlayers.push(teamStudents[selectedPlayerIndex]);
				}

				foundStudents.push(teamStudents[selectedPlayerIndex]);
				teamStudents.splice(selectedPlayerIndex, 1);
			});

			binding.atomically()
				.set('selectedPlayerIds',	Immutable.fromJS([]))
				.set('teamStudents',		Immutable.fromJS(teamStudents))
				.set('removedPlayers',		Immutable.fromJS(removedPlayers))
				.commit();

			self.searchAndSetStudents(self.currentSearchText, binding)
				.then(() => binding.set("isRemovePlayerButtonBlock", false));
		}
	},
	handleChangePlayerPosition: function(playerId, positionId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	teamStudents	= binding.toJS('teamStudents'),
				playerIndex		= teamStudents.findIndex(s => s.id === playerId);

		teamStudents[playerIndex].positionId = positionId;

		binding.set('teamStudents', Immutable.fromJS(teamStudents));
	},
	handleClickPlayerSub: function(playerId, isSub) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	teamStudents	= binding.toJS('teamStudents'),
				playerIndex		= teamStudents.findIndex(s => s.id === playerId);

		teamStudents[playerIndex].sub = isSub;

		binding.set('teamStudents', Immutable.fromJS(teamStudents));
	},
	handleClickPlayerIsCaptain: function(playerId, isCaptain) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	teamStudents	= binding.toJS('teamStudents'),
				playerIndex		= teamStudents.findIndex(s => s.id === playerId),
				// ahah old captain, yohoho
				oldCaptainIndex	= teamStudents.findIndex(s => s.isCaptain);

		teamStudents[playerIndex].isCaptain = isCaptain;
		// kill captain, i'm a captain
		if(isCaptain && oldCaptainIndex !== -1) {
			teamStudents[oldCaptainIndex].isCaptain = false;
		}

		binding.set('teamStudents', Immutable.fromJS(teamStudents));
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div>
				<Team	isNonTeamSport					= { self.props.isNonTeamSport }
						players							= { binding.toJS('teamStudents') }
						positions						= { binding.toJS('positions') }
						handleClickPlayer				= { self.handleClickPlayer }
						handleChangePlayerPosition		= { self.handleChangePlayerPosition }
						handleClickPlayerSub			= { self.handleClickPlayerSub }
						handleClickPlayerIsCaptain		= { self.handleClickPlayerIsCaptain }
						handleClickRemovePlayerButton	= { self.handleClickRemovePlayerButton }
						isRemovePlayerButtonBlock		= { binding.toJS('isRemovePlayerButtonBlock') }
						error							= { typeof this.getBinding('error') !== 'undefined' ? this.getBinding('error').toJS() : {} }
				/>
				<PlayerChooser	students					= { binding.toJS('foundStudents') }
								handleChangeSearchText		= { self.handleChangeSearchText }
								handleClickStudent			= { self.handleClickStudent }
								handleClickAddTeamButton	= { self.handleClickAddStudentButton }
								isSearch					= { binding.toJS('isSearch') }
								isAddTeamButtonBlocked		= { binding.toJS('isAddTeamButtonBlocked') }
				/>
			</div>
		);
	}
});

module.exports = TeamManager;