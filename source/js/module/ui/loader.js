/**
 * Created by Anatoly on 02.09.2016.
 */

const 	React 	= require('react'),
		SVG 	= require('module/ui/svg');

/** animation loading. */
function Loader(props) {
	if (props.condition)
		return (
			<div className="bLoader">
				<SVG icon="icon_spin-loader-black" />
			</div>

		);

	return null;
}

Loader.propTypes = {
	condition: React.PropTypes.bool // if true - animation showed
};

module.exports = Loader;