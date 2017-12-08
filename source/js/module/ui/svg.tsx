import * as React	from 'react';

/** Simple wrapper to render SVG from global SVG bundle
 *  This implementation use xlink:href tag for rendering images: there is big SVG file assembled during build, which
 *  have all required icons as symbols. This component references to this symbols by using `icon` property.
 *  Resulting SVG is something like that:
 *  <svg class="bIcon"><use xlink:href="#icon_key"></use></svg>
 */

interface SVGProps {
	onClick?:	() => void
	icon:		string
	classes?:	string
	title?:		string
}

export class SVG extends React.Component<SVGProps> {
	render() {
		const 	classes		= this.props.classes ? 'bIcon ' + this.props.classes : 'bIcon',
				iconHref	= '#' + this.props.icon,
				title		= typeof this.props.title !== 'undefined' ? this.props.title : '';
		
		return (
			<svg
				onClick		= {this.props.onClick}
				className	= {classes}
			>
				<use xlinkHref={iconHref}>
					<title>{title}</title>
				</use>
			</svg>
		);
	}
}

