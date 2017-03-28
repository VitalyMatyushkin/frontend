const	React			= require('react'),
		ComboBox		= require('../../../../../../ui/autocomplete2/ComboBox2'),
		SchoolListItem	= require('module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		ConfirmPopup	= require('../../../../../../ui/confirm_popup');

/**
 * Wrapper for add school to school union.
 */
const AddSchoolPopup = React.createClass({
	propTypes: {
		isOpen					: React.PropTypes.bool.isRequired,
		handleClickOkButton		: React.PropTypes.bool.isRequired,
		handleClickCancelButton	: React.PropTypes.bool.isRequired,
		blackList				: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return {
			school: undefined
		};
	},
	/**
	 * Return title for element from combobox component
	 * @returns {string}
	 */
	getElementTitle: function(school) {
		return school.name;
	},
	/**
	 * Return plug tooltip for combobox component
	 * @returns {string}
	 */
	getElementTooltip: function() {
		return '';
	},
	/**
	 * Search function wrapper for combobox component
	 * @param searchText
	 * @returns {{sync: Array, async: *}}
	 */
	searchSchoolWrapper: function(searchText) {
		return {
			sync:  [],
			async: this.searchSchools(searchText)
		};
	},
	/**
	 * Just search schools. Call server.
	 * @param searchText
	 * @returns {*}
	 */
	searchSchools: function(searchText) {
		return window.Server.publicSchools.get({
			filter: {
				where: {
					id: {
						$nin: this.props.blackList
					},
					name: {
						like	: searchText
					}
				},
				limit	: 20
			}
		});
	},
	isOkButtonDisabled: function() {
		return typeof this.state.school === 'undefined';
	},
	handleSelectSchool: function(id, school) {
		this.setState({
			school: school
		});
	},
	handleClickOkButton: function() {
		this.props.handleClickOkButton(this.state.school);
		this.setState({
			school: undefined
		});
	},
	render: function () {
		if(this.props.isOpen) {
			return (
				<ConfirmPopup	okButtonText			= "Add school"
								cancelButtonText		= "Back"
								isOkButtonDisabled		= {this.isOkButtonDisabled()}
								handleClickOkButton		= {this.handleClickOkButton}
								handleClickCancelButton	= {this.props.handleClickCancelButton}
								customStyle				= {'mSmallWidth'}
				>
					<h3 className="eConfirmPopup_title">Add school to school union</h3>
					<div className="eForm_field">
						<div className="eForm_fieldName">
							School
						</div>
						<div className="eForm_fieldSet">
							<ComboBox	placeholder			= {'Please, select a school'}
										customListItem		= { SchoolListItem }
										searchFunction		= {this.searchSchoolWrapper}
										onSelect			= {this.handleSelectSchool}
										getElementTitle		= {this.getElementTitle}
										getElementTooltip	= {this.getElementTooltip}
										onEscapeSelection	= {() => {}}
										clearAfterSelect	= {false}
										extraCssStyle		= {'mBigSize mWidth350 mWhiteBG'}
										isBlocked			= {false}
							/>
						</div>
					</div>

				</ConfirmPopup>
			);
		} else {
			return null;
		}
	}
});

module.exports = AddSchoolPopup;