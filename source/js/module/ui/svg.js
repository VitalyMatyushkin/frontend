

const   React       = require('react');

/** Simple wrapper to render SVG from global SVG bundle
 *  This implementation use xlink:href tag for rendering images: there is big SVG file assembled during build, which
 *  have all required icons as symbols. This component references to this symbols by using `icon` property.
 *  Resulting SVG is something like that:
 *  <svg class="bIcon"><use xlink:href="#icon_key"></use></svg>
 */
function SVG(props) {
	const 	classes		= props.classes ? 'bIcon ' + props.classes : 'bIcon',
			iconHref	= '#' + props.icon;

	return (
		<svg	onClick		= {props.onClick}
				className	= {classes}
		>
			<use xlinkHref={iconHref}/>
		</svg>
	);

}

SVG.propTypes = {
	onClick:	React.PropTypes.func,
	icon:		React.PropTypes.string.isRequired,
	classes:	React.PropTypes.string
};

module.exports = SVG;

