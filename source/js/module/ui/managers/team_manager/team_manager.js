const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Promise			= require('bluebird'),
		Team			= require('./team/team'),
		PlayerChooser	= require('./player_chooser/player_chooser');

const TeamManager = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			filter:				undefined,
			foundStudents:		[],
			removedPlayers:		[],
			selectedStudentIds:	[],
			selectedPlayerIds:	[]
		});
	},
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.searchAndSetStudents('', binding);

		binding.sub('filter').addListener(() => {
			self.searchAndSetStudents('', binding);
		});
	},
	/**
	 * Search students by last name and set these to binding
	 * @param searchText
	 */
	searchAndSetStudents: function(searchText, binding) {
		const self = this;

		self.searchStudents(searchText).then(students => {
			binding.atomically()
				.set("selectedStudentIds",	Immutable.fromJS([]))
				.set("foundStudents",		Immutable.fromJS(students))
				.commit()
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
			const requestFilter = {
				filter: {
					where: {
						_id: {
							$nin: self.getNinUserId(binding)
						},
						lastName: {
							like:		searchText,
							options:	'i'
						},
						formId: {
							$in: filter.forms.map(form => form.id)
						}
					}
				}
			};

			self.setGenderToRequestFilter(filter.genders, requestFilter);

			filter.houseId && (requestFilter.filter.where.houseId = filter.houseId);

			return window.Server.schoolStudents.get(filter.schoolId, requestFilter).then(players => {
				return players.map(player => {
					player.name = `${player.firstName}' '${player.lastName}`;

					return player;
				});
			});
		} else {
			return Promise.resolve([]);
		}
	},
	setGenderToRequestFilter: function(genders, requestFilter) {
		if(genders.length === 1) {
			requestFilter.filter.where.gender = genders[0];
		} else if(genders.length === 2) {
			requestFilter.filter.where.$or = [{gender: genders[0]}, {gender: genders[1]}];
		}
	},
	getNinUserId: function(binding) {
		return binding.toJS('teamStudents') && binding.toJS('teamStudents').map(p => p.userId ? p.userId : p.id);
	},
	handleChangeSearchText: function(text) {
		const	self	= this,
				binding	= self.getDefaultBinding();

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
		console.log(selectedPlayerIds);
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
		console.log(selectedStudentIds);
	},
	/**
	 * Add student to team
	 */
	handleClickAddStudentButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const selectedStudentIds = binding.toJS('selectedStudentIds');
		
		if(selectedStudentIds.length !== 0) {
			const	teamStudents			= binding.toJS('teamStudents'),
					foundStudents			= binding.toJS('foundStudents'),
					removedPlayers			= binding.toJS('removedPlayers');

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
				} else {
					teamStudents.push(foundStudents[selectedStudentIndex]);
				}

				foundStudents.splice(selectedStudentIndex, 1);
			});

			binding.atomically()
				.set('selectedStudentIds',	Immutable.fromJS([]))
				.set('foundStudents',		Immutable.fromJS(foundStudents))
				.set('teamStudents',		Immutable.fromJS(teamStudents))
				.set('removedPlayers',		Immutable.fromJS(removedPlayers))
				.commit();
		}
	},
	handleClickRemovePlayerButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const selectedPlayerIds = binding.toJS('selectedPlayerIds');

		if(selectedPlayerIds.length !== 0) {
			const	teamStudents			= binding.toJS('teamStudents'),
					foundStudents			= binding.toJS('foundStudents'),
					removedPlayers			= binding.toJS('removedPlayers');

			selectedPlayerIds.forEach(id => {
				const	selectedPlayerIndex		= teamStudents.findIndex(s => s.id === id),
						foundRemovedPlayerIndex	= removedPlayers.findIndex(p => p.id === id);

				if(foundRemovedPlayerIndex === -1) {
					removedPlayers.push(teamStudents[selectedPlayerIndex]);
				}

				foundStudents.push(teamStudents[selectedPlayerIndex]);
				teamStudents.splice(selectedPlayerIndex, 1);
			});

			binding.atomically()
				.set('selectedPlayerIds',	Immutable.fromJS([]))
				.set('foundStudents',		Immutable.fromJS(foundStudents))
				.set('teamStudents',		Immutable.fromJS(teamStudents))
				.set('removedPlayers',		Immutable.fromJS(removedPlayers))
				.commit();
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
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div>
				<Team	players={binding.toJS('teamStudents')}
						positions={binding.toJS('positions')}
						handleClickPlayer={self.handleClickPlayer}
						handleChangePlayerPosition={self.handleChangePlayerPosition}
						handleClickPlayerSub={self.handleClickPlayerSub}
						handleClickRemovePlayerButton={self.handleClickRemovePlayerButton}
				/>
				<PlayerChooser	students={binding.toJS('foundStudents')}
								handleChangeSearchText={self.handleChangeSearchText}
								handleClickStudent={self.handleClickStudent}
								handleClickStudent={self.handleClickStudent}
								handleClickAddTeamButton={self.handleClickAddStudentButton}
				/>
			</div>
		);
	}
});

module.exports = TeamManager;