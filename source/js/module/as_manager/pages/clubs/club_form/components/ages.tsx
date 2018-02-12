import * as React from 'react'
import * as MultiselectDropdown from 'module/ui/multiselect-dropdown/multiselect_dropdown'
import * as MultiselectDropdownHelper from 'module/ui/multiselect-dropdown/multiselect_dropdown_helper'

export const Ages = (React as any).createClass({
	propTypes: {
		ageGroupsNaming: (React as any).PropTypes.string.isRequired,
		availableAges: (React as any).PropTypes.array.isRequired,
		ages: (React as any).PropTypes.array.isRequired,
		handleClickItem: (React as any).PropTypes.func.isRequired
	},
	getAges() {
		return MultiselectDropdownHelper.getAgeArray(
			this.props.availableAges,
			this.props.ageGroupsNaming
		);
	},
	getSelectedAges() {
		return MultiselectDropdownHelper.getAgeArray(
			this.props.ages,
			this.props.ageGroupsNaming
		);
	},
	render() {
		return(
			<MultiselectDropdown
				items={this.getAges()}
				selectedItems={this.getSelectedAges()}
				handleClickItem={this.props.handleClickItem}
				extraStyle={'mSmallWide'}
			/>
		);
	}
});