const	React								= require('react'),
		Immutable							= require('immutable'),
		Morearty							= require('morearty'),
		SchoolItem							= require('./school_item'),
		FixtureShowAllItemsButton			= require('./../fixture_show_all_item_button'),
		PublicSchoolUnionSchoolListStyle	= require('../../../../../../styles/ui/b_public_school_union_school_list.scss'),
		PublicSiteBlockDelimeterStyle		= require('../../../../../../styles/ui/b_public_site_block_delimeter.scss');

const SchoolList = React.createClass({
	mixins: [Morearty.Mixin],
	// this is count of showing event for case when state.isShowAllItems === false
	SCHOOLS_COUNT: 8,
	componentWillMount: function() {
		this.getDefaultBinding()
			.atomically()
			.set('isSync', false)
			.set('isShowAllItems', false)
			.commit();

		window.Server.publicSchoolUnionSchools.get({schoolUnionId: this.getMoreartyContext().getBinding().get('activeSchoolId')})
		.then(schools => {
			this.getDefaultBinding()
				.atomically()
				.set('isSync', true)
				.set('schoolList', Immutable.fromJS(schools))
				.commit();
		});
	},
	handleClickShowAllItemsButton: function() {
		this.getDefaultBinding().set('isShowAllItems', !this.getDefaultBinding().get('isShowAllItems'));
	},
	renderSchoolListBySchools: function(schoolList) {
		return schoolList.map(school => <SchoolItem key={school.id} school={school}/>);
	},
	renderSchoolList: function() {
		const	binding			= this.getDefaultBinding(),
				isSync			= binding.toJS('isSync'),
				isShowAllItems	= binding.toJS('isShowAllItems'),
				schoolList		= binding.toJS('schoolList');

		switch(true) {
			case isSync && schoolList.length === 0:
				return <div className="bFixtureMessage">{"There are no schools."}</div>;
			case isSync && (schoolList.length > 0 && schoolList.length <= this.SCHOOLS_COUNT):
				return this.renderSchoolListBySchools(schoolList);
			case isSync && isShowAllItems:
				return this.renderSchoolListBySchools(schoolList);
			case isSync && !isShowAllItems:
				return this.renderSchoolListBySchools(schoolList.slice(0, this.SCHOOLS_COUNT));
			default:
				return <div className="bFixtureMessage">{"Loading..."}</div>;
		}
	},
	renderShowAllItemsButton: function() {
		const	binding			= this.getDefaultBinding(),
				isSync			= binding.toJS('isSync'),
				isShowAllItems	= binding.toJS('isShowAllItems'),
				schoolList		= binding.toJS('schoolList');

		// show when events counts more then five
		if(isSync && schoolList.length > this.SCHOOLS_COUNT) {
			return (
				<FixtureShowAllItemsButton
					isShowAllItems	= {isShowAllItems}
					handleClick		= {this.handleClickShowAllItemsButton}
					text			= {"Show All School Members"}
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bSchoolUnionSchoolList">
				<h1 className="eSchoolUnionSchoolList_title">Schools</h1>
				<div className="eSchoolUnionSchoolList_body">
					{this.renderSchoolList()}
				</div>
				{this.renderShowAllItemsButton()}
			</div>
		);
	}
});

module.exports = SchoolList;