/**
 * Created by wert on 16.01.16.
 */
const React = require('react');

const RoleSelectorComponent = React.createClass({
    getRoleSubdomain: function(roleName) {
        const roleMapper = {
            owner:      'manager',
            manager:    'manager',
            teacher:    'manager',
            coach:      'manager',
            parent:     'parents'
        };
        return roleMapper[roleName.toLowerCase()];
    },
    redirectToStartPage: function(roleName) {
        const self = this;

        const roleSubdomain = self.getRoleSubdomain(roleName);
        if(roleSubdomain) {
            let subdomains = document.location.host.split('.');
            subdomains[0] = roleSubdomain;
            const domain = subdomains.join(".");
            switch (roleSubdomain) {
                case 'manager':
                    window.location.href = `http://${domain}/#schools`;
                    break;
                case 'parents':
                    window.location.href = `http://${domain}/#events/calendar/all`;
                    break;
            }
        } else {
            alert('unknown role: ' + roleName);
        }
    },
    onRoleSelected: function(roleName){
        const self = this;

        return function(){
            console.log(`Role selected: ${roleName}`);
            self.redirectToStartPage(roleName.toLowerCase());
        }
    },
    renderRoleButton: function(roleName){
        const self = this;

        return <button onClick={self.onRoleSelected(roleName)}>{roleName}</button>
    },
    render: function(){
        const self = this;

        const availableRoles = self.props.availableRoles;
        if(availableRoles.length == 1) {
            self.redirectToStartPage(availableRoles[0]);
        }
        return (
            <div>
                {availableRoles.map(self.renderRoleButton)}
            </div>
        );
    }
});


module.exports = RoleSelectorComponent;
