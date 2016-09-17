/**
 * Created by wert on 02.09.16.
 */

const React = require('react');

/** Menu item which when clicked show file chooser dialog */
function ChooseFileItem(props) {
	return (
		<span className={props.className}>
			{props.name}
			<input onChange={props.onChange} type='file' />
		</span>
	);

}

ChooseFileItem.propTypes = {
	name: 		React.PropTypes.string,
	className:	React.PropTypes.string,
	onChange: 	React.PropTypes.func
};

module.exports = ChooseFileItem;