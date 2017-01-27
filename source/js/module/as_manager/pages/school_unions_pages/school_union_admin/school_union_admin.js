const	React							= require('react'),
		Morearty						= require('morearty'),
		RouterView						= require('module/core/router'),
		Route							= require('module/core/route'),
		Immutable						= require('immutable'),
		SchoolUnionSummary				= require('./pages/school_union_summary/school_union_summary'),
		SchoolUnionEdit					= require('./pages/school_union_edit/school_union_edit'),
		SchoolUnionSchoolListWrapper	= require('./pages/school_union_school_list/school_union_school_list_wrapper'),
		SchoolUnionSchoolViewWrapper	= require('./pages/school_union_school_view/school_union_school_view_wrapper'),
		SchoolUnionNews					= require('./pages/school_union_news/school_union_news'),
		SubMenu							= require('module/ui/menu/sub_menu');

const SchoolUnionAdmin = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			// binding for school union summary page
			schoolUnionSummary		: {},
			// binding for school union edit page
			schoolUnionEdit			: {},
			// binding for school list from school union
			schoolUnionSchoolListWrapper : {
				schoolUnionSchoolList: {},
				schoolUnionSchoolListRouting: {}
			},
			// binding for school view
			schoolUnionSchoolView: {

			},
			schoolUnionNews: {
				newsList	: {},
				newsAdd		: {},
				newsView	: {},
				newsForm	: {},
				newsRouting	: {}
			},
			schoolUnionRouting		: {}
		});
	},
	componentWillMount: function() {
		this.setMenuItems();
	},
	setMenuItems: function() {
		this.menuItems = [{
			href	: '/#school_union_admin/summary',
			name	: 'Summary',
			key		: 'Summary'
		}, {
			href	: '/#school_union_admin/schools',
			name	: 'Schools',
			key		: 'Schools'
		}, {
			href	: '/#school_union_admin/news',
			name	: 'News',
			key		: 'News'
		}];
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu	binding	= {binding.sub('schoolRouting')}
							items	= {this.menuItems}
				/>
				<div className="bSchoolUnion">
					<RouterView	routes	= {binding.sub('schoolRouting')}
								binding	= {globalBinding}
					>
						<Route	path		= "/school_union_admin/summary"
								binding		= {binding.sub('schoolUnionSummary')}
								component	= {SchoolUnionSummary}
						/>
						<Route	path		= "/school_union_admin/summary/edit"
								binding		= {binding.sub('schoolUnionEdit')}
								component	= {SchoolUnionEdit}
						/>
						<Route	path		= "/school_union_admin/schools /school_union_admin/schools:mode"
								binding		= {binding.sub('schoolUnionSchoolListWrapper')}
								component	= {SchoolUnionSchoolListWrapper}
						/>
						<Route	path		= "/school_union_admin/news /school_union_admin/news/:mode"
								binding		= {binding.sub('schoolUnionNews')}
								component	= {SchoolUnionNews}
						/>

						<Route	path		= "/school_union_admin/school /school_union_admin/school/:schoolId"
								binding		= {binding.sub('schoolUnionSchoolView')}
								component	= {SchoolUnionSchoolViewWrapper}
						/>
					</RouterView>
				</div>
			</div>
		);
	}
});

module.exports = SchoolUnionAdmin;