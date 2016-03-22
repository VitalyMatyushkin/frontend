const	React		= require('react'),
		Immutable	= require('immutable');

/**
 * TeamName element has two modes:
 * 1) Show current team name
 * 2) Edit current team name or new team name
 */
const TeamName = React.createClass({
	mixins: [Morearty.Mixin],
	MODES: {
		EDIT: 'edit',
		SHOW: 'show'
	},
	/*HELPERS*/
	_setNewTeamName: function(name) {
		const	self		= this,
				binding		= self.getDefaultBinding();

		binding.set('name', Immutable.fromJS(name));
	},

	/*RENDER*/
	_renderTeamName: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();
		let		result = '';

		if(binding !== undefined && binding !== null) {
			switch (binding.toJS('mode')) {
				case self.MODES.SHOW:
					result = self._renderShowMode();
					break;
				case self.MODES.EDIT:
					result = self._renderEditMode();
					break;
			};
		}

		return result;
	},
	_renderShowMode: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		return (
			<div className="eTeamName_nameContainer">
				<div className="eTeamName_name">
					{binding.toJS('name')}
				</div>
			</div>
		);
	},
	_renderEditMode: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		return (
			<div className="eTeamName_nameContainer">
				<input	className="eTeamName_nameForm"
						id={'team-name'}
						type={'text'}
						placeholder={'Enter new team name'}
						onChange={self._onChangeTeamName}
						value={binding.toJS('name')}
				/>
			</div>
		);
	},

	/*HANDLERS*/
	_onChangeTeamName: function(event) {
		const	self	= this;

		self._setNewTeamName(event.target.value);
	},
	render: function() {
		const	self	= this;

		return (
			<div className="bTeamName">
				{self._renderTeamName()}
			</div>
		);
	}
});

module.exports = TeamName;