/**
 * Created by wert on 16.01.16.
 */
const React = require('react');

const RoleSelectorComponent = React.createClass({
    onRoleSelected: function(roleName){
        return function(){
            // TODO: fix me. Dirty solution to be ready for sprint
            const domain = 'squard.com:8080';
            console.log(`Role selected: ${roleName}`);
            switch (true) {
                case roleName === 'manager' || roleName === 'owner':
                    window.location.replace(`http://manager.${domain}`);
                    break;
                default:
                    console.log('role is: ' + roleName);
                    break;
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
