/**
 * Created by wert on 13.09.16.
 */

const 	React 		= require('react'),
		RoleHelper 	= require('module/helpers/role_helper');

/** Button to be rendered with role name */
function RoleButton(props){
	const 	onClick 	= props.onClick,
			name		= props.name,
			clientName 	= RoleHelper.SERVER_ROLE_FOR_CLIENT[name];
	return <div className="bButton" onClick={() => onClick(name)}>{clientName}</div>;
}

RoleButton.propTypes = {
	name: 		React.PropTypes.string.isRequired,
	onClick:	React.PropTypes.func.isRequired
};

module.exports = RoleButton;