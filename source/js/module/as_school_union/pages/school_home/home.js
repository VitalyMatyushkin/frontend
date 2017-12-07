const   HomeHeader 			= require('./home_header'),
		HomeFixture 		= require('./home_fixtures'),
		HomeResults 		= require('./home_results'),
		HomeNews 			= require('./home_news'),
		HomeCalender 		= require('./home_calendar'),
		SchoolList 			= require('./school_list/school_list'),
		{Tournaments} 		= require('./tournaments/tournaments'),
		LeagueTables 		= require('./league/league'),
		React 				= require('react'),
		ReactDOM 			= require('react-dom'),
		Morearty 			= require('morearty'),
		CookiePopupMessage 	= require('./../../../ui/cookie_popup_message/cookie_popup_message');

const SchoolHomePage = React.createClass({
	mixins: [Morearty.Mixin],
	/**
	 * We subscribe on event "hashchange",
	 * because I don't see another option,
	 * how we can trace function in component public_menu
	 * (which change hash in onClick when we click on link menu)
	 * Also we once run function scroll, it for case, when we click on link public_menu on event page
	 */
	componentDidMount: function() {
		window.addEventListener('hashchange', this.scrollToAnchor, false);
		this.scrollToAnchor();
	},
	/**
	 * Maybe not the most correct, but the most common version of the page scroll for React App (stackoverflow)
	 */
	scrollToAnchor: function () {
		const hash = document.location.hash;
		
		switch (hash) {
			//we scroll page on 70px to top, because top menu has width 70px
			case '#league':
				if (ReactDOM.findDOMNode(this.refs.league) !== null) {
					ReactDOM.findDOMNode(this.refs.league).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#calendar':
				if (ReactDOM.findDOMNode(this.refs.calendar) !== null) {
					ReactDOM.findDOMNode(this.refs.calendar).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#tournaments':
				if (ReactDOM.findDOMNode(this.refs.tournaments) !== null) {
					ReactDOM.findDOMNode(this.refs.tournaments).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#fixtures':
				if (ReactDOM.findDOMNode(this.refs.fixtures) !== null) {
					ReactDOM.findDOMNode(this.refs.fixtures).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#news':
				if (ReactDOM.findDOMNode(this.refs.news) !== null) {
					ReactDOM.findDOMNode(this.refs.news).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#results':
				if (ReactDOM.findDOMNode(this.refs.results) !== null) {
					ReactDOM.findDOMNode(this.refs.results).scrollIntoView();
					window.scrollBy(0, -70);
				}
				break;
			case '#schools':
				if (ReactDOM.findDOMNode(this.refs.schools) !== null) {
					ReactDOM.findDOMNode(this.refs.schools).scrollIntoView();
				}
				break;
		}
	},
	render: function(){
		const 	binding 		= this.getDefaultBinding(),
				schoolUnionId 	= this.getMoreartyContext().getBinding().get('activeSchoolId');
		
		return (
			<div className="eSchoolHomePage">
				<HomeHeader binding={binding}/>
				<div className="eSchoolBodyWrapper">
					<LeagueTables
						binding = { binding }
						ref 	= { 'league' }
					/>
					<HomeCalender
						binding = { binding }
						ref 	= { 'calendar' }
					/>
					<Tournaments
						binding 		= { binding }
						ref 			= { 'tournaments' }
						schoolUnionId	= { schoolUnionId }
					/>
					<HomeFixture
						binding = { binding }
						ref 	= { 'fixtures' }
					/>
					<HomeResults
						binding = { binding }
						ref 	= { 'results' }
					/>
					<HomeNews
						binding = { binding }
						ref 	= { 'news' }
					/>
					<SchoolList
						binding = { binding }
						ref 	= { 'schools' }
					/>
				</div>
				<div className="eSchoolHomeFooter">
					<div className="eSchoolHomeFooter_container">
						<div className="eSchoolHomeFooter_row">
							<div className="eSchoolHomeFooter_col_size_4">
								<img className="eSchoolHomeFooter_logo" src="images/logo.svg"/>
							</div>
							<div className="eSchoolHomeFooter_col_size_8">
								<div className="eSchoolHomeFooter_copyright">Powered by Squad In Touch</div>
								<a className="eSchoolHomeFooter_link" href="http://squadintouch.co.uk/">www.squadintouch.co.uk</a>
							</div>
						</div>
					</div>
				</div>
				<CookiePopupMessage binding={binding}/>
			</div>
		);
	}
});

module.exports = SchoolHomePage;