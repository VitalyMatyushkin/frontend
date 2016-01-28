/**
 * Created by wert on 16.01.16.
 */
const React = require('react');

const RoleSelectorComponent = React.createClass({
    onRoleSelected: function(roleName){
        return function(){
            const roleMapper = {
                admin:      'manager',
                manager:    'manager',
                teacher:    'manager',
                coach:      'manager',
                parent:     'parents'
            };
            console.log(`Role selected: ${roleName}`);
            const roleSubdomain = roleMapper[roleName.toLowerCase()];
            if(roleSubdomain) {
                let subdomains = document.location.host.split('.');
                subdomains[0] = roleSubdomain;
                const domain = subdomains.join(".");
                switch (roleSubdomain) {
                    case roleMapper.admin:
                        window.location.href = `http://${domain}/#schools`;
                        break;
                    case roleMapper.manager:
                        window.location.href = `http://${domain}/#schools`;
                        break;
                    case roleMapper.coach:
                        window.location.href = `http://${domain}/#schools`;
                        break;
                    case roleMapper.teacher:
                        window.location.href = `http://${domain}/#schools`;
                        break;
                    case roleMapper.parent:
                        window.location.href = `http://${domain}/#events/calendar`;
                        break;
                }
            } else {
                alert('unknown role: ' + roleName);
            }
        }
    },
    renderRoleButton: function(roleName){
        return <button onClick={this.onRoleSelected(roleName)}>{roleName}</button>
    },
    render: function(){
        const availableRoles = this.props.availableRoles;
        return (
            <div>
                {availableRoles.map(this.renderRoleButton)}
            </div>
        );
    }
});


module.exports = RoleSelectorComponent;
