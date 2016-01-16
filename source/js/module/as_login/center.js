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

module.exports = Center;