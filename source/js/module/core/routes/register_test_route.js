const   React 			    = require('react'),
        {RegisterComponent} = require('module/ui/register_test/register_component');

const RegisterRoute = React.createClass({
    getDefaultProps: function() {
        return {
            path: 		'/register_test',
            component: 	RegisterComponent,
            unauthorizedAccess: true
        };
    },
    render: function() {
        null
    }
});

module.exports = RegisterRoute;