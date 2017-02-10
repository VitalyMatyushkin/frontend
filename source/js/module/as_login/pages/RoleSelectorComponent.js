/**
 * Created by wert on 13.09.16.
 */

const 	React 		= require('react'),
		Immutable	= require('immutable'),
		Button		= require('module/ui/button/button'),
		RoleHelper 	= require('module/helpers/role_helper');

/**
 * It just renders list of buttons with role names. When any button clicked, handler called with role name.
 * 
 */
function RoleSelectorComponent(props) {
	const	onRoleSelected		= props.onRoleSelected,
			availableRoles		= props.availableRoles;

	return (
		<div className="bRoleSelector">
			{availableRoles.map(role =>
				<Button	key		= {role.name}
						text	= {RoleHelper.ROLE_TO_PERMISSION_MAPPING[role.name]}
						onClick	= {() => onRoleSelected(role)}
				/>
			)}
		</div>
	);
}

RoleSelectorComponent.propTypes = {
	availableRoles: React.PropTypes.oneOfType([				// expecting array of object or Immutable.List with strings
		React.PropTypes.arrayOf(React.PropTypes.object),
		React.PropTypes.instanceOf(Immutable.List)
	]).isRequired,
	onRoleSelected: React.PropTypes.func.isRequired
};

module.exports = RoleSelectorComponent;