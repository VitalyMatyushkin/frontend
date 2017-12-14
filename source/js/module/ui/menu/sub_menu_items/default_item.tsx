/**
 * Created by wert on 02.09.16.
 */

import * as React 	from 'react';
import {SVG} 		from 'module/ui/svg';

interface DefaultItemProps {
	name?:			string
	num?:			string
	href?:			string
	className?:		string
	className2?:	string
	icon?:			string
}

export class DefaultItem extends React.Component<DefaultItemProps> {
	render() {
		const icon = this.props.icon ? <SVG classes={this.props.className} icon={this.props.icon} /> : null;
		return (
			<a href={this.props.href} className={this.props.className2}>
				{icon} {this.props.name} {this.props.num || ''}
			</a>
		);
	}
}