const	React 						= require('react'),
		Morearty					= require('morearty'),
		Grid 						= require('module/ui/grid/grid'),
		SchoolUnionSchoolListModel	= require('./school_union_school_list_model'),
		SchoolUnionSchoolListStyle	= require('../../../../../../../../styles/ui/b_school_union_school_list.scss');

const SchoolUnionSchoolList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new SchoolUnionSchoolListModel(this, this.handleClickAddButton);
	},
	handleClickAddButton: function() {
		console.log("I FUCK YOUR MOTHER");
	},
	render: function() {
		return (
			<div className="bSchoolUnionSchoolList">
				{this.model.grid ? <Grid model={this.model.grid}/> : null}
			</div>
		);
	}
});

module.exports = SchoolUnionSchoolList;
