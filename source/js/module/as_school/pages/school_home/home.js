/**
 * Created by bridark on 31/07/15.
 */
const   HomeHeader          = require('./home_header'),
        HomeFixture         = require('./home_fixtures'),
        HomeResults         = require('./home_results'),
        HomeNews            = require('./home_news'),
        HomeCalender        = require('./home_calendar'),
        React               = require('react'),
        Morearty            = require('morearty'),
		SchoolAbout 		= require('./school_about'),
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
                    <HomeCalender binding={binding} />
					<HomeFixture binding={binding} />
					<HomeResults binding={binding} />
                    <HomeNews binding={binding}/>
					<SchoolAbout binding={binding} />
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