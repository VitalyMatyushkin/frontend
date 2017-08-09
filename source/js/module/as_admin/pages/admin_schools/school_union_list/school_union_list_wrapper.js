const	RouterView 		= require('module/core/router'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		Route 			= require('module/core/route'),
		SchoolUnionList	= require("./school_union_list");

const SchoolUnionListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				globalBinding	= self.getMoreartyContext().getBinding();

		return (
			<RouterView	binding	= {globalBinding}
						routes	= {binding.sub('schoolUnionListRouting')}
			>
				<Route	binding		= {binding.sub('schoolUnionList')}
						path		= "/schools/school_unions"
						component	= {SchoolUnionList}
				/>
			</RouterView>
		)
	}
});

module.exports = SchoolUnionListWrapper;