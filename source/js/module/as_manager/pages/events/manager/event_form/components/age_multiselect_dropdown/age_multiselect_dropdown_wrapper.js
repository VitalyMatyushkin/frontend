const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		propz 				= require('propz'),
		
		SchoolConst 		= require('module/helpers/consts/schools'),
		
		MultiselectDropdown	= require('../../../../../../../ui/multiselect-dropdown/multiselect-dropdown');

const AgeMultiselectDropdownWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	getAgeView: function(age) {
		const 	binding = this.getDefaultBinding(),
				ageGroupsNaming = binding.toJS('schoolInfo.ageGroupsNaming'),
				ageGroup = propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, age]);

		return ageGroup;
	},
	getAgeArray: function(ages) {
		return ages.map(age => {
			return {
				id		: age,
				value	: this.getAgeView(age)
			};
		});
	},
	getAges: function() {
		return this.getAgeArray(this.getDefaultBinding().toJS('availableAges'));
	},
	getSelectedAges: function() {
		return this.getAgeArray(this.getDefaultBinding().toJS('model.ages'));
	},

	handleClickAgeItem: function(ageItem) {
		const ages = this.getDefaultBinding().toJS('model.ages');

		const foundAgeIndex = ages.findIndex(a => a === ageItem.id);

		if(foundAgeIndex !== -1) {
			ages.splice(foundAgeIndex, 1);
		} else {
			ages.push(ageItem.id);
		}

		this.getDefaultBinding().set('model.ages', Immutable.fromJS(ages));
	},

	render: function() {
		return(
			<MultiselectDropdown	items			= {this.getAges()}
									selectedItems	= {this.getSelectedAges()}
									handleClickItem	= {this.handleClickAgeItem}
			/>
		);
	}
});

module.exports = AgeMultiselectDropdownWrapper;