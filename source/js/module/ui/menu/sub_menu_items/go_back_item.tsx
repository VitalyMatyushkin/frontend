/**
 * Created by wert on 02.09.16.
 */

import * as React 	from 'react';
import {SVG} 		from 'module/ui/svg';

interface GoBackItemProps {
	name?:	 	string,
	icon?:		any,
	className?: string,
	num?:		any, 	// what is that ?
	className2?:string  // it takes two classnames. Right now I don't know where is difference
}

export class GoBackItem extends React.Component<GoBackItemProps> {
	render() {
		const icon = this.props.icon ? <SVG classes={this.props.className} icon={this.props.icon} /> : null;
		return 	(
			<span
				onClick={() => window.history.back() }
				className={this.props.className2}>
               	{icon}
				{this.props.name}
				{this.props.num || ''}
		</span>
		);
	}
}