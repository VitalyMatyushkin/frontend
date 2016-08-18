const	RouterView 			= require('module/core/router'),
		React 				= require('react'),
		Morearty			= require('morearty'),
		Route 				= require('module/core/route'),
		NewsListComponent 	= require("module/as_manager/pages/school_admin/news/news_list"),
		NewsAddComponent 	= require("module/as_manager/pages/school_admin/news/news_add"),
		NewsEditComponent 	= require("module/as_manager/pages/school_admin/news/news_edit"),
		NewsViewComponent 	= require("module/as_manager/pages/school_admin/news/news-view");



const NewsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('newsRouting') } binding={globalBinding}>
				<Route path="/school_admin/news" binding={binding.sub('newsList')} formBinding={binding.sub('classesForm')} component={NewsListComponent} />
				<Route path="/school_admin/news/add"  binding={binding.sub('newsAdd')} component={NewsAddComponent} />
				<Route path="/school_admin/news/edit" binding={binding.sub('newsForm')} component={NewsEditComponent}  />
				<Route path="/school_admin/news/view" binding={binding.sub('newsView')} component={NewsViewComponent}  />
			</RouterView>
		)
	}
});


module.exports = NewsPage;
