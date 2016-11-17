const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		GenderSelector	= require('./gender_selector');

const GenderSelectorWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	isBoysChecked: function() {
		const gender = this.getDefaultBinding().toJS('model.gender');

		switch (gender) {
			case "femaleOnly":
				return false;
			case "maleOnly":
				return true;
			case "mixed":
				return true;
			default:
				return false;
		}
	},
	isGirlsChecked: function() {
		const gender = this.getDefaultBinding().toJS('model.gender');

		switch (gender) {
			case "femaleOnly":
				return true;
			case "maleOnly":
				return false;
			case "mixed":
				return true;
			default:
				return false;
		}
	},
	isBoysDisabled: function() {
		const sportModel = this.getDefaultBinding().get('model.sportModel');

		if(sportModel) {
			const genders = sportModel.toJS().genders;

			return !genders.maleOnly;
		} else {
			return true;
		}
	},
	isGirlsDisabled: function() {
		const sportModel = this.getDefaultBinding().get('model.sportModel');

		if(sportModel) {
			const genders = sportModel.toJS().genders;

			return !genders.femaleOnly;
		} else {
			return true;
		}
	},

	handleClick: function(selectedGender) {
		const sportModel = this.getDefaultBinding().get('model.sportModel');

		if(sportModel) {
			const	genders			= sportModel.toJS().genders,
					currentGender	= this.getDefaultBinding().toJS('model.gender');

			switch (true) {
				case selectedGender === 'boys' && genders.mixed && currentGender === 'femaleOnly':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('mixed'));
					break;
				case selectedGender === 'boys' && currentGender === 'femaleOnly':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('maleOnly'));
					break;
				case selectedGender === 'boys' && currentGender === 'mixed':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('femaleOnly'));
					break;
				case selectedGender === 'boys' && typeof currentGender === 'undefined':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('maleOnly'));
					break;
				case selectedGender === 'girls' && genders.mixed && currentGender === 'maleOnly':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('mixed'));
					break;
				case selectedGender === 'girls' && currentGender === 'maleOnly':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('femaleOnly'));
					break;
				case selectedGender === 'girls' && currentGender === 'mixed':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('maleOnly'));
					break;
				case selectedGender === 'girls' && typeof currentGender === 'undefined':
					this.getDefaultBinding().set('model.gender', Immutable.fromJS('femaleOnly'));
					break;
			}
		}
	},

	render: function() {
		return(
			<GenderSelector	isBoysChecked	= {this.isBoysChecked()}
							isBoysDisabled	= {this.isBoysDisabled()}
							isGirlsChecked	= {this.isGirlsChecked()}
							isGirlsDisabled	= {this.isGirlsDisabled()}
							handleClick		= {this.handleClick}
			/>
		);
	}
});

module.exports = GenderSelectorWrapper;