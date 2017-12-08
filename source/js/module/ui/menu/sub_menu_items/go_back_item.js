/**
 * Created by wert on 02.09.16.
 */

const 	React 	= require('react'),
		{SVG}	= require('module/ui/svg');

/** Menu Item which moves does `window.history.back()` when clicked */
function GoBackItem(props){
	const icon = props.icon ? <SVG classes={props.className} icon={props.icon} /> : null;
	return 	(
		<span
			onClick={() => window.history.back() }
			className={props.className2}>
               	{icon}
               	{props.name}
               	{props.num || ''}
		</span>
	);
}


GoBackItem.propTypes = {
	name:	 	React.PropTypes.string,
	icon:		React.PropTypes.any,
	className: 	React.PropTypes.string,
	num:		React.PropTypes.any, 	// what is that ?
	className2: React.PropTypes.string  // it takes two classnames. Right now I don't know where is difference
};


module.exports = GoBackItem;