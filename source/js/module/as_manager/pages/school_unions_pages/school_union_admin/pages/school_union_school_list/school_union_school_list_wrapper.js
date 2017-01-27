const	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		SchoolUnionSchoolList 	= require("./school_union_school_list");

const SchoolUnionSchoolListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				globalBinding	= self.getMoreartyContext().getBinding();

		return (
			<RouterView	binding	= {globalBinding}
						routes	= {binding.sub('schoolUnionSchoolListRouting')}
			>
				<Route	binding		= {binding.sub('schoolUnionSchoolList')}
						path		= "/school_union_admin/schools"
						component	= {SchoolUnionSchoolList}
				/>
			</RouterView>
		)
	}
});

module.exports = SchoolUnionSchoolListWrapper;