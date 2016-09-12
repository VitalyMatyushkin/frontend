/**
 * Created by wert on 13.09.16.
 */

const React = require('react');

/** Button to be rendered with role name */
function RoleButton(props){
	const 	onClick = props.onClick,
			name	= props.name;
	return <div className="bButton" onClick={() => onClick(name)}>{name}</div>;
}

RoleButton.propTypes = {
	name: 		React.PropTypes.string.isRequired,
	onClick:	React.PropTypes.func.isRequired
};

module.exports = RoleButton;