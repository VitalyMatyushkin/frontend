/**
 * Created by bridark on 31/07/15.
 */
const 	HomeHeader 			= require('./home_header'),
		HomeFixture 		= require('./home_fixtures'),
		HomeResults 		= require('./home_results'),
		HomeNews 			= require('./home_news'),
		HomeCalender 		= require('./home_calendar'),
		React 				= require('react'),
		ReactDOM 			= require('react-dom'),
		Morearty 			= require('morearty'),
		SchoolAbout 		= require('./school_about'),
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
			case '#calendar':
				if (ReactDOM.findDOMNode(this.refs.calendar) !== null) {
					ReactDOM.findDOMNode(this.refs.calendar).scrollIntoView();
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
		}
	},
	
	render: function(){
		const 	binding = this.getDefaultBinding();

		return (
			<div className="eSchoolHomePage">
				<HomeHeader
					binding = { binding }
				/>
				<div className="eSchoolBodyWrapper">
					<HomeCalender
						binding	= 	{ binding }
						ref		= 	{ 'calendar' }
					/>
					<HomeFixture
						binding	=	{ binding }
						ref		= 	{ 'fixtures' }
					/>
					<HomeResults
						binding	=	{ binding }
						ref		= 	{ 'results' }
					/>
					<HomeNews
						binding	=	{ binding }
						ref		= 	{ 'news' }
					/>
					<SchoolAbout
						binding	=	{ binding }
					/>
				</div>
				<div className="eSchoolHomeFooter">
					<div className="container">
						<div className="row">
							<div className="col-md-3 col-md-offset-1 col-sm-3">
								<img src="images/logo.svg"/>
							</div>
							<div className="col-md-7 col-sm-9 eSchoolHomeFooterCopyright">
								&copy;All Rights Reserved, SquadInTouch.com &trade;
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