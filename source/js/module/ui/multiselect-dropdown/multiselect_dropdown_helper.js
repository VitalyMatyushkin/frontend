const	propz 		= require('propz'),
		SchoolConst	= require('module/helpers/consts/schools');

const MultiselectDropdownHelper = {
	getAgeView: function(age, ageGroupsNaming) {
		const ageGroup = propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, age]);

		return ageGroup;
	},
	getAgeArray: function(ages, ageGroupsNaming) {
		return ages.map(age => {
			return {
				id		: age,
				value	: this.getAgeView(age, ageGroupsNaming)
			};
		});
	}
};

module.exports = MultiselectDropdownHelper;