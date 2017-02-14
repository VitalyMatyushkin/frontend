const	RouterView 			= require('module/core/router'),
		React 				= require('react'),
		Morearty			= require('morearty'),
		Route 				= require('module/core/route'),
		NewsListComponent 	= require("module/as_manager/pages/school_admin/news/list/news-list"),
		NewsAddComponent 	= require("module/as_manager/pages/school_admin/news/news_add"),
		NewsEditComponent 	= require("module/as_manager/pages/school_admin/news/news_edit"),
		NewsViewComponent 	= require("module/as_manager/pages/school_admin/news/news-view");

const SchoolUnionNews = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> with News in Grid
	handleClickNews: function(newsId) {
		document.location.hash = 'school_union_admin/news/view?id=' + newsId;
	},
	
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('newsRouting') } binding={globalBinding}>
				<Route
					path		= "/school_union_admin/news"
					binding		= { binding.sub('newsList') }
					formBinding	= { binding.sub('classesForm') }
					component	= { NewsListComponent }
					handleClick	= { this.handleClickNews }
				/>
				<Route
					path		= "/school_union_admin/news/add"
					binding		= { binding.sub('newsAdd') }
					component	= { NewsAddComponent }
				/>
				<Route
					path		= "/school_union_admin/news/edit"
					binding		= { binding.sub('newsForm') }
					component	= { NewsEditComponent }
				/>
				<Route
					path		= "/school_union_admin/news/view"
					binding		= { binding.sub('newsView') }
					component	= { NewsViewComponent }
				/>
			</RouterView>
		)
	}
});


module.exports = SchoolUnionNews;