/**
 * Created by wert on 16.01.16.
 */
const React = require('react');

const RoleSelectorComponent = React.createClass({
    onRoleSelected: function(roleName){
        return function(){
            const roleMapper = {
                manager:    'manager',
                owner:      'manager',
                parent:     'parents'
            };
            // TODO: fix me. Dirty solution to be ready for sprint
            //const domain = 'stage.squadintouch.com';
            const domain = 'squard.com:8080';
            console.log(`Role selected: ${roleName}`);
            const subdomain = roleMapper[roleName.toLowerCase()];
            if(subdomain) {
                window.location.href = `http://${subdomain}.${domain}`;
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
