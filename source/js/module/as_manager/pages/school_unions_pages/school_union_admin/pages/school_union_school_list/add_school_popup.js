const	React					= require('react'),
		PostcodeSelector		= require('module/ui/postcode_selector/postcode_selector'),
		{ ComboBox2 }			= require('module/ui/autocomplete2/ComboBox2'),
		{SchoolListItem}		= require('module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		{ConfirmPopup}			= require('module/ui/confirm_popup'),
		GeoSearchHelper			= require('module/helpers/geo_search_helper'),
		PermissionDetailsHelper	= require('module/ui/register/user/permission_details/permission_detail_helper');

/**
 * Wrapper for add school to school union.
 */
const AddSchoolPopup = React.createClass({
	propTypes: {
		schoolUnionId: React.PropTypes.string.isRequired,
		isOpen: React.PropTypes.bool.isRequired,
		handleClickOkButton: React.PropTypes.bool.isRequired,
		handleClickCancelButton: React.PropTypes.bool.isRequired,
		blackList: React.PropTypes.array.isRequired
	},
	componentWillMount() {
		window.Server.school.get({schoolId: this.props.schoolUnionId}).then(schoolUnion => {
			this.setState({
				activeSchoolUnion: schoolUnion,
				isSync: true
			});
		});
	},
	getInitialState: function() {
		return {
			isSync: false,
			activeSchoolUnion: undefined,
			school:		undefined,
			postcode:	undefined
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
	searchSchoolWrapper: function(schoolName) {
		return {
			sync:  [],
			async: this.searchSchools(schoolName)
		};
	},
	searchSchools: function (schoolName) {
		if(typeof this.state.postcode === 'undefined') {
			return this.searchSchool(schoolName);
		} else {
			return this.searchSchoolNearCurrentPostcode(schoolName);
		}
	},
	searchSchool: function(schoolName) {
		return window.Server.publicSchools.get(
			{
				filter: {
					where: {
						id: {
							$nin: this.props.blackList
						},
						name: {
							like: schoolName
						}
					},
					limit	: 20
				}
			}
		);
	},
	searchSchoolNearCurrentPostcode: function(schoolName) {
		return window.Server.publicSchools.get(
			{
				filter: {
					where: {
						id: {
							$nin: this.props.blackList
						},
						'postcode.point': GeoSearchHelper.getUnlimitedGeoSchoolFilter(this.state.postcode.point),
						name: {
							like: schoolName,
							options: 'i'
						}
					},
					limit: 40
				}
			}
		);
	},
	isOkButtonDisabled: function() {
		return typeof this.state.school === 'undefined';
	},
	handleSelectPostcode: function(id, postcode) {
		this.setState({
			postcode: postcode
		});
	},
	handleEscapePostcode: function() {
		this.setState({
			postcode: undefined
		});
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
		if(this.props.isOpen && this.state.isSync) {
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
							Postcode
						</div>
						<PostcodeSelector
							region                  = { this.state.activeSchoolUnion.region }
							currentPostcode			= { this.state.postcode }
							handleSelectPostcode	= { this.handleSelectPostcode }
							handleEscapePostcode	= { this.handleEscapePostcode }
							extraCssStyle			= { 'mSchoolUnionPostcode' }
						/>
					</div>
					<div className="eForm_field">
						<div className="eForm_fieldName">
							School
						</div>
						<div className="eForm_fieldSet">
							<ComboBox2	placeholder			= {'Please, select a school'}
										customListItem		= { SchoolListItem }
										searchFunction		= {this.searchSchoolWrapper}
										onSelect			= {this.handleSelectSchool}
										getElementTitle		= {this.getElementTitle}
										getElementTooltip	= {this.getElementTooltip}
										onEscapeSelection	= {() => {}}
										clearAfterSelect	= {false}
										extraCssStyle		= {'mBigSize mWidth350'}
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