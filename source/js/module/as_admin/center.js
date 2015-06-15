/**
 * Created by bridark on 04/06/15.
 */
var RouterView = require('module/core/router'),
    Route = require('module/core/route'),
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
                        <Route path="/login" binding={binding.sub('userData')} component="module/ui/login/user" loginRoute={true}  />
                        <Route path="/logout" binding={binding.sub('userData')} component="module/as_admin/pages/logout/logout" unauthorizedAccess={true}  />
                        <Route path="/admin_schools /:subPage /admin_schools/:subPage/:mode" binding={binding.sub('adminSchoolList')} component="module/as_admin/pages/admin_schools/admin_dashboard"/>
                        <Route path="/admin_views /admin_views/:subPage" binding={binding.sub('schoolsDetail')} component="module/as_admin/pages/admin_schools/admin_dashboard"  />
                        <Route path="/settings /settings/:subPage" binding={binding.sub('userData')} component="module/as_admin/pages/settings/settings_page" />
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = Center;
