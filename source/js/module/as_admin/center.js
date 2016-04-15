/**
 * Created by bridark on 04/06/15.
 */
var RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    LoginRoute = require('module/core/routes/login_route'),
    LogoutRoute = require('module/core/routes/logout_route'),
    RegisterRoute = require('module/core/routes/register_route'),
    SettingsRoute = require('module/core/routes/settings_route'),
    React = require('react'),
    Center;

Center = React.createClass({
    mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            currentPage =  binding.get('routing.currentPageName') || '',
            mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

        return (
            <div className={mainClass}>
                <div className="bPageWrap">
                    <RouterView routes={ binding.sub('routing') } binding={binding}>
                        <Route path="/ /school /school/:subPage" binding={binding.sub('schoolProfile')} component="module/as_school/pages/school/school_page"  />
                        <Route path="/fixtures" binding={binding.sub('schoolFixtures')} component="module/as_school/pages/fixtures/fixtures_page"  />
                        <Route path="/event" binding={binding.sub('schoolEvent')} component="module/as_school/pages/event/event_page"  />
                        <Route path="/calendar" binding={binding.sub('schoolCalendar')} component="module/as_school/pages/calendar/calendar_page"  />
                        <Route path="/opponents/:subPage" binding={binding.sub('opponentsList')} component="module/as_school/pages/opponents/opponents_page"  />
                        <Route path="/schools/add " binding={binding.sub('schoolsPage')} component="module/as_manager/pages/schools/schools_add"	/>
                        <Route path="/albums /albums/:albumId" binding={binding.sub('albums')} component="module/ui/gallery/albums"  />
                        <Route path="/admin_schools admin_schools/:subPage /admin_schools/:subPage/:mode" binding={binding.sub('adminSchoolList')}
                               component="module/as_admin/pages/admin_schools/admin_dashboard"/>
                        <Route path="/school_sandbox/:schoolId school_sandbox/:schoolId/:subPage /school_sandbox/:schoolId/:subPage/:mode /school_sandbox/:schoolId/:subPage/:mode/:id"
                               binding={binding.sub('adminSchoolList')} component="module/as_admin/pages/admin_schools/school_sandbox/sandbox"/>
                        <LoginRoute binding={binding.sub('userData')}  />
                        <LogoutRoute binding={binding.sub('userData')}  />
                        <SettingsRoute binding={binding.sub('userData')} />
                        <RegisterRoute binding={binding.sub('form.register')}  />
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = Center;
