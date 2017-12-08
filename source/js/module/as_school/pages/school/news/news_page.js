const 	{SVG} 			= require('module/ui/svg'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		DateTimeMixin 	= require('module/mixins/datetime');

const NewsPage = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	componentWillMount: function () {
		const 	self 			= this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('activeSchoolId'),
				binding 		= self.getDefaultBinding();


		window.Server.news.get(activeSchoolId).then(function(data) {
			binding.set(Immutable.fromJS(data));
		});
	},

	render: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				newsList 	= binding.toJS();
		let	newsNodes;		// TODO: ????

		if (newsList) {		// TODO: ????
			newsNodes = newsList.map(function(news) {
				return (
					<div className="eSchoolNews_news">
						<img style={{display: 'none'}} className="eSchoolNews_image" src="https://meduza.io/image/attachment_overrides/images/000/000/070/ov/OcNOeC1vqd2ehz5Qv7T1wQ.jpg" />
						<div className="eSchoolNews_date">{self.getDateFromIso(news.date)}</div>
						<div className="eSchoolNews_title">{news.title}</div>
						<div className="eSchoolNews_text" dangerouslySetInnerHTML={{__html: news.body}}></div>
					</div>
				);
			});
		}

		return (
			<div>
				<div className="bSchoolNews">
					{newsNodes}
				</div>
			</div>
		)
	}
});


module.exports = NewsPage;
