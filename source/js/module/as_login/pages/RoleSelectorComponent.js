/**
 * Created by wert on 13.09.16.
 */

const 	React 		= require('react'),
		Immutable	= require('immutable'),
		RoleButton	= require('./RoleButton');

function RoleSelectorComponent(props) {
	const 	onRoleSelected		= props.onRoleSelected,
			availableRoles		= props.availableRoles;

	return (
		<div className="bRoleSelector">
			{availableRoles.map( role => <RoleButton key={role} name={role} onClick={onRoleSelected}/>)}
		</div>
	);

}

RoleSelectorComponent.propTypes = {
	availableRoles: React.PropTypes.oneOfType([				// expecting array of string or Immutable.List with strings
		React.PropTypes.arrayOf(React.PropTypes.string),
		React.PropTypes.instanceOf(Immutable.List)
	]).isRequired,
	onRoleSelected: React.PropTypes.func.isRequired
};

module.exports = RoleSelectorComponent;