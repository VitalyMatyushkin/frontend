const	React						= require('react');

const	MultiselectDropdown			= require('module/ui/multiselect-dropdown/multiselect_dropdown');

const	MultiselectDropdownHelper	= require('module/ui/multiselect-dropdown/multiselect_dropdown_helper');


const Ages = React.createClass({
	propTypes: {
		ageGroupsNaming:	React.PropTypes.string.isRequired,
		availableAges:		React.PropTypes.array.isRequired,
		ages:				React.PropTypes.array.isRequired,
		handleClickItem:	React.PropTypes.func.isRequired
	},
	getAges: function() {
		return MultiselectDropdownHelper.getAgeArray(
			this.props.availableAges,
			this.props.ageGroupsNaming
		);
	},
	getSelectedAges: function() {
		return MultiselectDropdownHelper.getAgeArray(
			this.props.ages,
			this.props.ageGroupsNaming
		);
	},
	render: function() {
		return(
			<MultiselectDropdown
				items			= { this.getAges() }
				selectedItems	= { this.getSelectedAges() }
				handleClickItem	= { this.props.handleClickItem }
				extraStyle		= { 'mSmallWide' }
			/>
		);
	}
});

module.exports = Ages;