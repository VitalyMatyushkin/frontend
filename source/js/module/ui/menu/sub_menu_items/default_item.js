/**
 * Created by wert on 02.09.16.
 */

const 	React 	= require('react'),
		{SVG}	= require('module/ui/svg');

function DefaultItem(props) {
	const icon = props.icon ? <SVG classes={props.className} icon={props.icon} /> : null;

	return (
		<a href={props.href} className={props.className2}>
			{icon} {props.name} {props.num || ''}
		</a>
	);
}

DefaultItem.propTypes = {
	name:		React.PropTypes.string,
	num:		React.PropTypes.any,
	href:		React.PropTypes.string,
	className:	React.PropTypes.string,
	className2:	React.PropTypes.string,
	icon:		React.PropTypes.any
};

module.exports = DefaultItem;