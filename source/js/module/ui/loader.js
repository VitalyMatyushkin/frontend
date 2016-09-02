/**
 * Created by Anatoly on 02.09.2016.
 */

const React = require('react');

function Loader(props) {
	if (props.condition)
		return (
			<div className="bLoader">
				<span>Loading...</span>
				<img src="images/loader-facebook.gif"/>
			</div>

		);

	return null;
}

module.exports = Loader;