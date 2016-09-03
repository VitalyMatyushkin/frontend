/**
 * Created by wert on 03.09.16.
 */

const React = require('react');

/** Item to be shown when no result found or still loading result or smth else.
 *  Just tiny wrapper for formatted text output
 */
function NoResultItem(props) {
	return <div className="eChallenge mNotFound">{props.text}</div>;
}

NoResultItem.propTypes = {
	text: React.PropTypes.string.isRequired
};

module.exports = NoResultItem;