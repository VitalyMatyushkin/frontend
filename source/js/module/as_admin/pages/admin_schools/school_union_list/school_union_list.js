const	React						= require('react'),
		Morearty					= require('morearty'),
		Grid						= require('module/ui/grid/grid'),
		SchoolUnionSchoolListModel	= require('./school_union_list_model'),
		SchoolUnionSchoolListStyle	= require('../../../../../../styles/ui/b_school_union_school_list.scss');

const SchoolUnionList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.initData();
	},
	/**
	 * Function initialize data for this component.
	 * @returns {*|any}
	 */
	initData: function() {
		this.model = new SchoolUnionSchoolListModel(this, this.handleClickAddSchoolUnionButton);
	},
	handleClickAddSchoolUnionButton: function() {
		document.location.hash = 'schools/school_unions/add';
	},
	renderGrid: function() {
		return typeof this.model.grid !== 'undefined' ? <Grid model={this.model.grid}/> : null;
	},
	render: function() {
		return (
			<div className="bSchoolUnionSchoolList">
				{this.renderGrid()}
			</div>
		);
	}
});

module.exports = SchoolUnionList;
