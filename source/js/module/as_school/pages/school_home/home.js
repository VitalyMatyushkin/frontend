/**
 * Created by bridark on 31/07/15.
 */
var SchoolHomePage,
    HomeHeader = require('./home_header'),
    HomeFixture = require('./home_fixtures');
SchoolHomePage = React.createClass({
    mixins:[Morearty.Mixin],
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eSchoolHomePage">
                <HomeHeader binding={binding}/>
                <HomeFixture binding={binding} />
            </div>
        );
    }
});
module.exports = SchoolHomePage;