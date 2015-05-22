var RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    Center;

Center = React.createClass({
    mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentPage = binding.get('routing.currentPageName') || '',
            mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

        return (
            <div className={mainClass}>
                <div className="bPageWrap">

                    <RouterView routes={ binding.sub('routing') } binding={binding}>

                        <Route path="/register" binding={binding.sub('form.register')}
                               component="module/as_manager/pages/register/user" unauthorizedAccess={true}/>
                        <Route path="/login" binding={binding.sub('userData')}
                               component="module/as_manager/pages/login/user" loginRoute={true}/>
                        <Route path="/logout" binding={binding.sub('userData')}
                               component="module/as_manager/pages/logout/logout" unauthorizedAccess={true}/>
                        <Route path="/settings /settings/:subPage" binding={binding.sub('userData')}
                               component="module/as_manager/pages/settings/settings_page"/>

                        <Route path="/student" binding={binding.sub('studentPage')}
                               component="module/as_manager/pages/student/student_page"/>

                        <Route path="/profile/:schoolID" binding={binding.sub('schoolProfile')}
                               component="module/as_manager/pages/school_profile/school_profile_page"/>

                        <Route path="/events /events/:subPage" binding={binding.sub('events')}
                               component="module/as_parents/pages/events/events"/>

                        <Route path="/event /event/:eventId /event/:eventId/:mode" binding={binding.sub('events')}
                               component="module/as_manager/pages/event/event"/>

                    </RouterView>

                </div>
            </div>
        )
    }
});

module.exports = Center;
