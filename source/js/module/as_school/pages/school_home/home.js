/**
 * Created by bridark on 31/07/15.
 */
var SchoolHomePage,
    HomeHeader = require('./home_header'),
    HomeFixture = require('./home_fixtures'),
    HomeNews = require('./home_news'),
    HomeCalender = require('./home_calendar'),
    HomeBlog = require('./home_carousel');
SchoolHomePage = React.createClass({
    mixins:[Morearty.Mixin],
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //console.log(binding.toJS());
        return (
            <div className="eSchoolHomePage">
                <HomeHeader binding={binding}/>
                <div className="eSchoolBodyWrapper">
                    <HomeFixture binding={binding} />
                    <HomeNews binding={binding}/>
                    <HomeCalender binding={binding} />
                    <HomeBlog binding={binding}  />
                </div>
                <div className="eSchoolHomeFooter">
                    &copy;All Rights Reserved, SquadInTouch.com  SquadInTouch.com &trade;
                </div>
            </div>
        );
    }
});
module.exports = SchoolHomePage;