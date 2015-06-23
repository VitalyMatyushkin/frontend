/**
 * Created by bridark on 04/06/15.
 */
var RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    LoginRoute = require('module/core/routes/login_route'),
    LogoutRoute = require('module/core/routes/logout_route'),
    RegisterRoute = require('module/core/routes/register_route'),
    VerifyRoute = require('module/core/routes/verify_route'),
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
        //<VerifyRoute binding={binding.sub('userData')} />
        return (
            <div className={mainClass}>
                <div className="bPageWrap">
                    <RouterView routes={ binding.sub('routing') } binding={binding}>
                        <Route path="/ /school /school/:subPage" binding={binding.sub('schoolProfile')} component="module/as_school/pages/school/school_page"  />
                        <Route path="/fixtures" binding={binding.sub('schoolFixtures')} component="module/as_school/pages/fixtures/fixtures_page"  />
                        <Route path="/event" binding={binding.sub('schoolEvent')} component="module/as_school/pages/event/event_page"  />
                        <Route path="/calendar" binding={binding.sub('schoolCalendar')} component="module/as_school/pages/calendar/calendar_page"  />
                        <Route path="/opponents/:subPage" binding={binding.sub('opponentsList')} component="module/as_school/pages/opponents/opponents_page"  />

                        <Route path="/albums /albums/:albumId" binding={binding.sub('albums')} component="module/as_manager/pages/albums/albums"  />
                        <Route path="/admin_schools /:subPage /admin_schools/:subPage/:mode" binding={binding.sub('adminSchoolList')} component="module/as_admin/pages/admin_schools/admin_dashboard"/>
                        <Route path="/admin_views /admin_views/:subPage" binding={binding.sub('schoolsDetail')} component="module/as_admin/pages/admin_schools/admin_dashboard"  />
                        <Route path="/settings /settings/:subPage" binding={binding.sub('userData')} component="module/as_admin/pages/settings/settings_page" />

                        <RegisterRoute binding={binding.sub('form.register')}  />
                        <LoginRoute binding={binding.sub('userData')}  />
                        <LogoutRoute binding={binding.sub('userData')}  />

                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = Center;
