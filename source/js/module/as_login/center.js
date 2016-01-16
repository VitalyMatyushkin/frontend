/**
 * Created by wert on 16.01.16.
 */
const   React           = require('react'),
        RoleSelector    = require('./pages/RoleSelector'),
        UserLogin       = require('module/ui/login/user'),
        RouterView      = require('module/core/router'),
        Route           = require('module/core/route'),
        LoginRoute2     = require('module/core/routes/login_route2'),
        LogoutRoute     = require('module/core/routes/logout_route'),
        RegisterRoute   = require('module/core/routes/register_route'),
        VerifyRoute     = require('module/core/routes/verify_route'),
        SettingsRoute   = require('module/core/routes/settings_route');

const Center = React.createClass({
    mixins: [Morearty.Mixin],
    // todo: part of dirty fix to make array uniq. Need to use ArrayHelpers on lodash instead.
    onlyUnique: function(value, index, self) {
        return self.indexOf(value) === index;
    },
    componentDidMount: function(){
        const   self    = this,
            binding = this.getDefaultBinding(),
            userId  = this.getDefaultBinding().get('userData.authorizationInfo.userId');
        if(userId) {
            this.getUserRoles(userId).then(data => {
                const uniquePresets = data.map(role => role.preset).filter(self.onlyUnique); // todo: make really unique
                binding.set('userData.availableRoles', uniquePresets);
            });
        }
    },
    getUserRoles: function(userId){
        return window.Server.userPermission.get({
            id: userId
        }).then(result => {
            console.log('User permisions are:' + JSON.stringify(result, null, 2));
            return result;
        });
    },
    isAuthorized: function(){
        const userId = this.getDefaultBinding().get('userData.authorizationInfo.userId');
        return typeof userId !== 'undefined';
    },
    render: function(){
        const   binding         = this.getDefaultBinding(),
                self            = this,
                currentPage     = binding.get('routing.currentPageName') || '',
                mainClass       = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

        //if(this.isAuthorized()) {
        //    const roles = binding.get('userData.availableRoles') || [];
        //    console.log('roles:' + JSON.stringify(roles, null, 2));
        //    return <RoleSelector availableRoles={roles}/>
        //} else {
        //    return <UserLogin binding={binding.sub('userData')}/>
        //}

        return (
            <div className={mainClass}>
                <div className="bPageWrap">
                    <RouterView routes={ binding.sub('routing') } binding={binding}>
                        <RegisterRoute binding={binding.sub('form.register')}	/>
                        <LoginRoute2 binding={binding.sub('userData')}	/>
                        <LogoutRoute binding={binding.sub('userData')}	/>
                        <SettingsRoute binding={binding.sub('userData')} />
                    </RouterView>
            </div>
                </div>
        );
    }

});

/*
 render: function() {

 return (
 <div className={mainClass}>
 <div className="bPageWrap">
 <RouterView routes={ binding.sub('routing') } binding={binding}>
 <RegisterRoute binding={binding.sub('form.register')}	/>
 <LoginRoute binding={binding.sub('userData')}	/>
 <LogoutRoute binding={binding.sub('userData')}	/>

 <SettingsRoute binding={binding.sub('userData')} />

 <Route path="/student" binding={binding.sub('studentPage')} component="module/as_manager/pages/student/student_page" />

 <Route path="/profile/:schoolID" binding={binding.sub('schoolProfile')} component="module/as_manager/pages/school_profile/school_profile_page"	/>

 <Route path="/school_admin/:subPage /school_admin/:subPage/:mode" binding={binding.sub('activeSchool')} component="module/as_manager/pages/school_admin/school_page"	/>

 <Route path="/schools /schools/:subPage" binding={binding.sub('schoolsPage')} component="module/as_manager/pages/schools/schools_page"	/>


 <Route path="/events /events/:subPage" binding={binding.sub('events')} component="module/as_manager/pages/events/events"  />
 <Route path="/event /event/:eventId /event/:eventId/:mode" binding={binding.sub('events')} component="module/as_manager/pages/event/event"  />
 <Route path="/albums /albums/:mode/:albumId" binding={binding.sub('albums')} component="module/as_manager/pages/albums/albums" />
 <Route path="/photos /photos/:albumId" binding={binding.sub('albums')} component="module/as_manager/pages/school_admin/gallery/gallery_add"  />
 <Route path="/invites /invites/:filter /invites/:inviteId/:mode" binding={binding.sub('invites')} component="module/as_manager/pages/invites/invites"  />
 <Route path="/school_console /school_console/:filter /school_console/:inviteId/:mode" binding={binding.sub('permissions')} component="module/as_manager/pages/school_console/school_console"  />
 </RouterView>

 </div>
 </div>
 )
 }
 */

module.exports = Center;