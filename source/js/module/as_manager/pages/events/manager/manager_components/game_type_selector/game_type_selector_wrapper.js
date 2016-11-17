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
		this.getDefaultBinding().set('model.type', Immutable.fromJS(selectedGameType));
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