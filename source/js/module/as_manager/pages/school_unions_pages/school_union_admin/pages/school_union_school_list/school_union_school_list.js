const	React 						= require('react'),
		Morearty					= require('morearty'),
		MoreartyHelper				= require('../../../../../../helpers/morearty_helper'),
	{Grid}						= require('module/ui/grid/grid'),
		SchoolUnionSchoolListModel	= require('./school_union_school_list_model'),
		AddSchoolPopup				= require('./add_school_popup'),
		SchoolUnionSchoolListStyle	= require('../../../../../../../../styles/ui/b_school_union_school_list.scss');

const SchoolUnionSchoolList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.initData();
	},
	getBlackList: function() {
		const schools = this.getDefaultBinding().toJS('data');

		if(typeof schools !== "undefined") {
			return schools.map(s => s.id);
		} else {
			return [];
		}
	},
	getIsOpenAddSchoolPopup: function() {
		return this.getDefaultBinding().toJS('isAddSchoolPopupOpen');
	},
	setIsOpenAddSchoolPopup: function(isOpen) {
		this.getDefaultBinding().set('isAddSchoolPopupOpen', isOpen);
	},
	/**
	 * Function initialize data for this component.
	 * @returns {*|any}
	 */
	initData: function() {
		this.model = new SchoolUnionSchoolListModel(this, this.handleClickAddButton);

		this.setIsOpenAddSchoolPopup(false);
	},
	/**
	 * Handler for click event of add school button
	 */
	handleClickAddButton: function() {
		this.setIsOpenAddSchoolPopup(true);
	},
	handleClickOkButton: function(school) {
		return window.Server.schoolUnionSchools.post(
			{
				schoolUnionId: MoreartyHelper.getActiveSchoolId(this)
			}, {
				schoolId: school.id
			}
		).then(() => {
			this.getDefaultBinding().sub('data').update(function(result) {
				return result.filter(function(res) {
					return res.id !== school.id;
				});
			});
			this.setIsOpenAddSchoolPopup(false);
			this.model.reloadData();
		});
	},
	/**
	 * Handler for click event of close button from AddSchoolPopup
	 */
	handleClickCancelButton: function() {
		this.setIsOpenAddSchoolPopup(false);
	},
	renderGrid: function() {
		return typeof this.model.grid !== 'undefined' ? <Grid model={this.model.grid}/> : null;
	},
	render: function() {
		return (
			<div className="bSchoolUnionSchoolList">
				{this.renderGrid()}
				<AddSchoolPopup	isOpen					= {this.getIsOpenAddSchoolPopup()}
								handleClickOkButton		= {this.handleClickOkButton}
								handleClickCancelButton	= {this.handleClickCancelButton}
								blackList				= {this.getBlackList()}
				/>
			</div>
		);
	}
});

module.exports = SchoolUnionSchoolList;
