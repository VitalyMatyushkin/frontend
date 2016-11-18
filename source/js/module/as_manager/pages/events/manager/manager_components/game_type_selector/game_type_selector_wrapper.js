const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		GameTypeSelector	= require('./gametype_selector');

const GameTypeSelectorWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	iInterSchoolsChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'inter-schools';
	},
	isHousesChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'houses';
	},
	isInternalChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'internal';
	},

	handleClick: function(selectedGameType) {
		const binding = this.getDefaultBinding();

		let rivals = Immutable.List();

		switch (selectedGameType) {
			case 'inter-schools':
				rivals = rivals.push(binding.get('schoolInfo'));
				break;
			case 'internal':
				rivals = Immutable.fromJS([
					{
						id: null,
						name: ''
					},
					{
						id: null,
						name: ''
					}
				]);
				break;
		}

		binding
			.atomically()
			.set('rivals',			Immutable.fromJS(rivals))
			.set('model.type',		Immutable.fromJS(selectedGameType))
			.set('autocomplete',	Immutable.Map())
			.commit();
	},

	render: function() {
		return(
			<GameTypeSelector	iInterSchoolsChecked	= {this.iInterSchoolsChecked()}
								isHousesChecked			= {this.isHousesChecked()}
								isInternalChecked		= {this.isInternalChecked()}
								handleClick				= {this.handleClick}
			/>
		);
	}
});

module.exports = GameTypeSelectorWrapper;