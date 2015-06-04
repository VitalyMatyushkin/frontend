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
                        <Route path="/ /school /school/:subPage" binding={binding.sub('schoolProfile')} component="module/as_main/pages/school/school_page"  />
                        <Route path="/fixtures" binding={binding.sub('schoolFixtures')} component="module/as_main/pages/fixtures/fixtures_page"  />
                        <Route path="/event" binding={binding.sub('schoolEvent')} component="module/as_main/pages/event/event_page"  />
                        <Route path="/calendar" binding={binding.sub('schoolCalendar')} component="module/as_main/pages/calendar/calendar_page"  />
                        <Route path="/opponents/:subPage" binding={binding.sub('opponentsList')} component="module/as_main/pages/opponents/opponents_page"  />

                        <Route path="/albums /albums/:albumId" binding={binding.sub('albums')} component="module/as_manager/pages/albums/albums"  />
                        <Route path="/login" binding={binding.sub('userData')} component="module/as_admin/pages/admin_login/admin_login" loginRoute={true}  />
                    </RouterView>
                </div>
            </div>
        )
    }
});


module.exports = Center;
