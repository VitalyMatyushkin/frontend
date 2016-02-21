/**
 * Created by bridark on 31/07/15.
 */
const   HomeHeader      = require('./home_header'),
        HomeFixture     = require('./home_fixtures'),
        HomeNews        = require('./home_news'),
        HomeCalender    = require('./home_calendar'),
        React           = require('react'),
        HomeBlog        = require('./home_carousel');

const SchoolHomePage = React.createClass({
    mixins:[Morearty.Mixin],
    render:function(){
        const   self    = this,
                binding = self.getDefaultBinding();
        return (
            <div className="eSchoolHomePage">
                <HomeHeader binding={binding}/>
                <div className="eSchoolBodyWrapper">
                    <HomeCalender binding={binding} />
                    <HomeFixture binding={binding} />
                    <HomeNews binding={binding}/>
                    <HomeBlog binding={binding}  />
                </div>
                <div className="eSchoolHomeFooter">
                    <img src = "images/logo.png"></img>
                    &copy;All Rights Reserved, SquadInTouch.com  SquadInTouch.com &trade;
                </div>
            </div>
        );
    }
});

module.exports = SchoolHomePage;