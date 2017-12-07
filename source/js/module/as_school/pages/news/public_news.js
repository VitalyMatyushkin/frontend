/**
 * Created by Woland on 24.03.2017.
 */
const 	React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty			= require('morearty');

const 	NewsItem 			= require('module/shared_pages/news/view-news-item'),
		{Button}			= require('module/ui/button/button');

const 	SchoolNewsItemStyle 	= require('styles/pages/public_news/b_public_school_news.scss');

const NewsPageComponent = React.createClass({
	mixins: [Morearty.Mixin],
	
	componentWillMount: function() {
		const 	binding			= this.getDefaultBinding(),
				rootBinding		= this.getMoreartyContext().getBinding(),
				newsId 			= rootBinding.sub('routing.pathParameters.0').toJS(),
				activeSchoolId	= rootBinding.get('activeSchoolId');
		
		binding.set('isSync', false);
		
		if(typeof activeSchoolId !== 'undefined' && typeof newsId !== 'undefined'){
			window.Server.publicSchoolNewsItem.get({
				schoolId:	activeSchoolId,
				newsId:		newsId
			})
			.then(data => {
				binding.set('news', Immutable.fromJS(data));
				binding.set('isSync', true);
			});
		}
	},
	
	handleClickHome: function() {
		document.location.hash = 'home';
	},
	
	render: function(){
		const 	binding	= this.getDefaultBinding(),
				isSync 	= Boolean(binding.toJS('isSync'));
		
		if (isSync) {
			const news = binding.toJS('news');
			
			return (
				<div className="bPublicSchoolNewsItem">
					<div className="eButtonHome">
						<Button
							onClick 			= { this.handleClickHome }
							extraStyleClasses 	= "mCancel"
							text 				= {"Home"}
						>
						</Button>
					</div>
					<NewsItem value={news} binding={binding.sub('viewItem')} />
				</div>
			)
		} else {
			return null
		}
		
	}
});

module.exports = NewsPageComponent;