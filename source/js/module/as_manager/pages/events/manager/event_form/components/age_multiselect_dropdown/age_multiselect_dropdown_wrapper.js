const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		propz 						= require('propz');

const	MultiselectDropdown			= require('module/ui/multiselect-dropdown/multiselect_dropdown');

const	MultiselectDropdownHelper	= require('module/ui/multiselect-dropdown/multiselect_dropdown_helper');


const AgeMultiselectDropdownWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	getAgeGroupNaming: function() {
		return this.getDefaultBinding().toJS('schoolInfo.ageGroupsNaming');
	},
	getAges: function() {
		return MultiselectDropdownHelper.getAgeArray(
			this.getDefaultBinding().toJS('availableAges'),
			this.getAgeGroupNaming()
		);
	},
	getSelectedAges: function() {
		return MultiselectDropdownHelper.getAgeArray(
			this.getDefaultBinding().toJS('model.ages'),
			this.getAgeGroupNaming()
		);
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
			<MultiselectDropdown
				items			= { this.getAges() }
				selectedItems	= { this.getSelectedAges() }
				handleClickItem	= { this.handleClickAgeItem }
			/>
		);
	}
});

module.exports = AgeMultiselectDropdownWrapper;