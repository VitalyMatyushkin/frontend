const	React								= require('react'),
		Immutable							= require('immutable'),
		Morearty							= require('morearty'),
		SchoolItem							= require('./school_item'),
		PublicSchoolUnionSchoolListStyle	= require('../../../../../../styles/ui/b_public_school_union_school_list.scss'),
		PublicSiteBlockDelimeterStyle		= require('../../../../../../styles/ui/b_public_site_block_delimeter.scss');

const SchoolList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		window.Server.publicSchools.get(
			{
				filter: {
					where: {
						limit: 10
					}
				}
			}
		)
		.then(schools => this.getDefaultBinding().set('schoolList', Immutable.fromJS(schools)));
	},
	renderSchools: function() {
		const	binding		= this.getDefaultBinding(),
				schoolList	= binding.toJS('schoolList');

		if(schoolList !== undefined){
			return schoolList.map(school => <SchoolItem key={school.id} school={school}/>);
		}
	},
	render: function() {
		return (
			<div className="bSchoolUnionSchoolList">
				<div className="bPublicSiteBlockDelimiter">
					<h1>Schools</h1><hr/>
					<span></span>
				</div>
				<div className="eSchoolUnionSchoolList_body">
					{this.renderSchools()}
				</div>
			</div>
		);
	}
});

module.exports = SchoolList;