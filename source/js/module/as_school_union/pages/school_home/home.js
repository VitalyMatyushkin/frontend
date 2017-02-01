const   HomeHeader          = require('./home_header'),
        Scores              = require('./scores/scores'),
        HomeFixture         = require('./home_fixtures'),
        HomeResults         = require('./home_results'),
        HomeNews            = require('./home_news'),
        HomeCalender        = require('./home_calendar'),
        SchoolList          = require('./school_list/school_list'),
        React               = require('react'),
        Morearty            = require('morearty'),
        CookiePopupMessage  = require('./../../../ui/cookie_popup_message/cookie_popup_message');

const SchoolHomePage = React.createClass({
    mixins: [Morearty.Mixin],

    render: function(){
        const   self    = this,
                binding = self.getDefaultBinding();

        return (
            <div className="eSchoolHomePage">
                <HomeHeader binding={binding}/>
                <div className="eSchoolBodyWrapper">
                    <Scores         binding = {binding}/>
                    <HomeCalender   binding = {binding}/>
					<HomeFixture    binding = {binding}/>
					<HomeResults    binding = {binding}/>
                    <HomeNews       binding = {binding}/>
                    <SchoolList     binding = {binding}/>
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