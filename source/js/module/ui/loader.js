/**
 * Created by Anatoly on 02.09.2016.
 */

const 	React 	= require('react'),
		SVG 	= require('module/ui/svg');

function Loader(props) {
	if (props.condition)
		return (
			<div className="bLoader">
				<span>Loading...</span>
				<SVG icon="icon_spin-loader-black" />
			</div>

		);

	return null;
}

module.exports = Loader;