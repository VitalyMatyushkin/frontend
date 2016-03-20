const	React			= require('react'),
		Immutable		= require('immutable'),
		Promise			= require('bluebird'),
		Lazy			= require('lazyjs');

const	PlayerChooser	= React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'AutocompleteTeam',
	componentWillMount: function () {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				type			= binding.get('model.type'),
				rivalBinding	= self.getBinding('rival');

		self._initBinding();
		self._addListeners();

		rivalBinding
			.meta()
			.atomically()
			.update('autocomplete', function () {
				return Immutable.Map();
			})
			.commit();
	},
	_initBinding: function() {
		const	self	= this;

		self._searchPlayers('');
	},
	_addListeners: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.sub('model').addListener(() => {
			self._searchPlayers('');
		});

		self.getBinding('players').addListener((descriptor) => {
			//if player has been deleted
			if (descriptor.getPreviousValue().size > descriptor.getCurrentValue().size) {
				const	prevPlayersList = descriptor.getPreviousValue().toJS(),
						currPlayersList = descriptor.getCurrentValue().toJS();

				for(let i = 0; i < prevPlayersList.length; i++) {
					let player = prevPlayersList[i];

					if (Lazy(currPlayersList).findWhere({id: player.id}) === undefined) {
						self._addPlayerForSelect(player);
						break;
					};
				}

			}
		});
	},
	/**
	 * Get school forms filtered by age
	 * @param ages
	 * @returns {*}
	 * @private
	 */
	_getFilteredForms: function(ages) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.get('schoolInfo.forms').filter(function (form) {
			return ages.indexOf(parseInt(form.get('age'))) !== -1 || ages.indexOf(String(form.get('age'))) !== -1;
		});
	},
	_searchPlayers: function(searchText) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self._getPlayers(searchText).then((players) => {
			binding.set('playersForSelect', Immutable.fromJS(players));
		});
	},
	_getPlayers: function (searchText) {
		const self = this,
			binding = self.getDefaultBinding();

		//TODO fix me
		if(binding.get('schoolInfo.forms')) {
			const	ages		= binding.get('model.ages'),
					gender		= binding.get('model.gender'),
					forms		= self._getFilteredForms(ages),
					type		= binding.get('model.type'),
					schoolId	= binding.get('schoolInfo.id'),

				filter = {
					where: {
						formId: {
							inq: forms.map(function (form) {
								return form.get('id');
							}).toJS()
						},
						or: [
								{
									'userInfo.lastName': {
										like:       searchText,
										options:    'i'
									}
								},
								{
									'userInfo.firstName': {
										like:       searchText,
										options:    'i'
									}
								}
							]
					},
					include:["user","form"]
				};

			if (type === 'houses') {
				filter.where.houseId = self.getBinding('rival').get('id');
			}

			return window.Server.students
				.get(schoolId, {filter: filter})
				.then((players) => {
					const	filteredPlayers	= [];

					players.forEach((player) => {
						//filter by gender
						if(!self._isSelectedPlayer(player) && player.user.gender === gender) {
							player.name = player.user.firstName + ' ' + player.user.lastName;
							filteredPlayers.push(player);
						}

					});

					return filteredPlayers;
				});
		} else {
			return new Promise((resolve) => {
				resolve([]);
			});
		}
	},
	_isSelectedPlayer: function(player) {
		const	self	= this,
				selectedPlayers = self.getBinding('players').toJS();

		return Lazy(selectedPlayers).findWhere({id: player.id}) !== undefined
	},
	_onSelectStudent: function (index, model) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				players	= self.getBinding('players').toJS();

		players.push(model);
		self.getBinding('players').set(Immutable.fromJS(players));

		const playersForSelect = binding.toJS('playersForSelect');
		playersForSelect.splice(index, 1);
		binding.set('playersForSelect', playersForSelect);
	},
	_addPlayerForSelect: function(model) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				playersForSelect = binding.toJS('playersForSelect');

		playersForSelect.unshift(model);
		binding.set('playersForSelect', Immutable.fromJS(playersForSelect));
	},
	_renderPlayerList: function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				playersForSelect	= binding.toJS('playersForSelect');
		let		players				= [];

		if(playersForSelect) {
			playersForSelect.forEach((player, index) => {
				players.push(
					<div	className="ePlayerChooser_player"
							onClick={self._onSelectStudent.bind(self, index, player)}
					>
						<div className="ePlayerChooser_playerName">
							{`${player.userInfo.firstName} ${player.userInfo.lastName}`}
						</div>
						<div className="ePlayerChooser_playerForm">
							{player.form.name}
						</div>
					</div>
				);
			});
		}

		return (
			<div className="ePlayerChooser_playerList">
				{players}
			</div>
		);
	},
	_renderPlayerSearchBox: function() {
		const	self	= this;

		return (
			<div className="ePlayerChooser_playerSearchBox">
				<input
					ref			= "input"
					className	= "eCombobox_input"
					placeholder	= "Enter student name"
					onChange	= {self._onChangePlayerSearchBoxText}
				/>
			</div>
		);
	},
	_onChangePlayerSearchBoxText: function(event) {
		const	self	= this;

		self._searchPlayers(event.target.value);
	},
	render: function() {
		const	self	= this;

		return (
			<div className="bPlayerChooser">
				{self._renderPlayerSearchBox()}
				{self._renderPlayerList()}
			</div>
		);
	}
});

module.exports = PlayerChooser;