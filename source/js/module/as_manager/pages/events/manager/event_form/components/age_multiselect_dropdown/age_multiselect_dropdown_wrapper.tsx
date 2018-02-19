import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as MultiselectDropdown from 'module/ui/multiselect-dropdown/multiselect_dropdown';
import * as MultiselectDropdownHelper from 'module/ui/multiselect-dropdown/multiselect_dropdown_helper';

interface Age {
	id:     string
	value:  string
}

export const AgeMultiselectDropdownWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],

	getAgeGroupNaming: function(): string {
		return this.getDefaultBinding().toJS('schoolInfo.ageGroupsNaming');
	},

	getAges: function(): Age[] {
		return MultiselectDropdownHelper.getAgeArray(
			this.getDefaultBinding().toJS('availableAges'),
			this.getAgeGroupNaming()
		);
	},

	getSelectedAges: function(): Age[] {
		return MultiselectDropdownHelper.getAgeArray(
			this.getDefaultBinding().toJS('model.ages'),
			this.getAgeGroupNaming()
		);
	},

	handleClickAgeItem: function(ageItem: Age): void {
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