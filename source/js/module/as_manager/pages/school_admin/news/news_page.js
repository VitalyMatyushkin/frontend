const	RouterView 	= require('module/core/router'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Route 		= require('module/core/route');

const NewsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('newsRouting') } binding={globalBinding}>
				<Route path="/school_admin/news" binding={binding.sub('newsList')} formBinding={binding.sub('classesForm')} component="module/as_manager/pages/school_admin/news/news_list"  />
				<Route path="/school_admin/news/add"  binding={binding.sub('newsAdd')} component="module/as_manager/pages/school_admin/news/news_add"  />
				<Route path="/school_admin/news/edit" binding={binding.sub('newsForm')} component="module/as_manager/pages/school_admin/news/news_edit"  />
			</RouterView>
		)
	}
});


module.exports = NewsPage;
